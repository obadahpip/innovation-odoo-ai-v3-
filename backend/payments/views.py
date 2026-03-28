import base64
import requests
from django.conf import settings
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status

from accounts.models import User
from accounts.serializers import UserProfileSerializer
from .models import Payment


# ── PayPal configuration (matches Innovation AI project) ─────────────────────

PAYPAL_CLIENT_ID = settings.PAYPAL_CLIENT_ID
PAYPAL_SECRET = settings.PAYPAL_CLIENT_SECRET
PAYPAL_MODE      = settings.PAYPAL_MODE  # 'sandbox' or 'live'

if PAYPAL_MODE == 'sandbox':
    PAYPAL_API_URL = 'https://api-m.sandbox.paypal.com'
else:
    PAYPAL_API_URL = 'https://api-m.paypal.com'


def get_paypal_access_token():
    """Get PayPal access token using base64-encoded credentials."""
    url = f'{PAYPAL_API_URL}/v1/oauth2/token'

    credentials         = f'{PAYPAL_CLIENT_ID}:{PAYPAL_SECRET}'
    encoded_credentials = base64.b64encode(credentials.encode()).decode()

    headers = {
        'Authorization': f'Basic {encoded_credentials}',
        'Content-Type':  'application/x-www-form-urlencoded',
    }

    response = requests.post(url, headers=headers, data={'grant_type': 'client_credentials'})

    if response.status_code == 200:
        return response.json()['access_token']
    raise Exception(f'Failed to get PayPal access token: {response.text}')


def verify_paypal_order(order_id):
    """
    Verify a completed PayPal order server-side.
    Called by PayPalConfirmView to ensure the frontend didn't fake the capture.
    """
    token = get_paypal_access_token()
    url   = f'{PAYPAL_API_URL}/v2/checkout/orders/{order_id}'

    response = requests.get(
        url,
        headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'},
    )

    if response.status_code == 200:
        return response.json()
    raise Exception(f'PayPal order verification failed: {response.text}')


# ── Subscription Status ───────────────────────────────────────────────────────

class SubscriptionStatusView(APIView):
    """GET /api/payments/subscription/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user.refresh_subscription_status()

        latest_payment = Payment.objects.filter(user=user).first()

        return Response({
            'subscription_status':  user.subscription_status,
            'has_active_access':    user.has_active_access,
            'trial_ends_at':        user.trial_ends_at,
            'trial_days_remaining': user.trial_days_remaining,
            'subscription_end':     user.subscription_end,
            'price_usd':            Payment.SUBSCRIPTION_PRICE,
            'latest_payment': {
                'id':         latest_payment.id,
                'method':     latest_payment.method,
                'status':     latest_payment.status,
                'amount':     str(latest_payment.amount),
                'created_at': latest_payment.created_at,
            } if latest_payment else None,
        })


# ── PayPal: Confirm (frontend handled create + capture) ───────────────────────

class PayPalConfirmView(APIView):
    """
    POST /api/payments/paypal/confirm/

    Called AFTER the frontend PayPal SDK has already created and captured
    the order (using actions.order.create / actions.order.capture).

    Body: {
        order_id,    capture_id,
        payer_email, payer_id,
        status,      amount
    }

    This endpoint:
      1. Verifies the order with PayPal server-side (security check)
      2. Records the payment
      3. Grants 1-year subscription to the user
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id    = request.data.get('order_id', '').strip()
        capture_id  = request.data.get('capture_id', '').strip()
        payer_email = request.data.get('payer_email', '').strip()
        payer_id    = request.data.get('payer_id', '').strip()
        status_str  = request.data.get('status', '').strip()
        amount      = request.data.get('amount', str(Payment.SUBSCRIPTION_PRICE))

        if not order_id:
            return Response({'success': False, 'message': 'order_id is required.'}, status=400)

        # ── Security: verify the order with PayPal directly ──────────────────
        try:
            order_data = verify_paypal_order(order_id)
        except Exception as e:
            return Response({
                'success': False,
                'message': f'PayPal verification failed: {str(e)}',
            }, status=502)

        # Confirm the order is truly COMPLETED on PayPal's side
        if order_data.get('status') != 'COMPLETED':
            return Response({
                'success': False,
                'message': f"Order status is '{order_data.get('status')}', not COMPLETED.",
            }, status=400)

        # Guard against duplicate confirmation
        if Payment.objects.filter(paypal_order_id=order_id, status='paid').exists():
            return Response({
                'success': False,
                'message': 'This payment has already been confirmed.',
            }, status=400)

        # ── Record payment + grant subscription ──────────────────────────────
        payment = Payment.objects.create(
            user=request.user,
            method='paypal',
            amount=Payment.SUBSCRIPTION_PRICE,
            paypal_order_id=order_id,
            paypal_capture_id=capture_id,
            transfer_reference=payer_email,
            status='pending_verification',  # approve() will set to 'paid'
        )
        payment.approve()  # sets status='paid' and grants subscription

        request.user.refresh_from_db()

        return Response({
            'success': True,
            'message': 'Payment confirmed! Your 1-year subscription is now active.',
            'data': {
                'user':              UserProfileSerializer(request.user).data,
                'subscription_end':  request.user.subscription_end,
                'paypal_order_id':   order_id,
                'paypal_capture_id': capture_id,
            },
        })


# ── Cash / CliQ ───────────────────────────────────────────────────────────────

class InitiateManualPaymentView(APIView):
    """
    POST /api/payments/initiate/
    Body: { method: 'cash'|'cliq', transfer_reference: '...' }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        method    = request.data.get('method', '')
        reference = request.data.get('transfer_reference', '').strip()

        if method not in ('cash', 'cliq'):
            return Response({'success': False, 'message': 'method must be cash or cliq.'}, status=400)

        Payment.objects.filter(
            user=request.user,
            status='pending_verification',
            method__in=('cash', 'cliq'),
        ).delete()

        payment = Payment.objects.create(
            user=request.user,
            method=method,
            amount=Payment.SUBSCRIPTION_PRICE,
            transfer_reference=reference,
            status='pending_verification',
        )

        return Response({
            'success': True,
            'message': 'Payment submitted. Admin will verify within 24 hours.',
            'data': {
                'id':     payment.id,
                'method': payment.method,
                'status': payment.status,
                'amount': str(payment.amount),
            },
        }, status=status.HTTP_201_CREATED)


# ── Admin: Grant Subscription ─────────────────────────────────────────────────

class AdminGrantSubscriptionView(APIView):
    """POST /api/payments/admin/grant/<user_id>/"""
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'success': False, 'message': 'User not found.'}, status=404)

        target_user.grant_subscription(granted_by=request.user)

        Payment.objects.create(
            user=target_user,
            method='cash',
            amount=0,
            transfer_reference=f'Admin grant by {request.user.email}',
            status='paid',
            verified_by=request.user,
            verified_at=timezone.now(),
        )

        return Response({
            'success': True,
            'message': f'1-year subscription granted to {target_user.email}.',
            'data': {'subscription_end': target_user.subscription_end},
        })


class AdminUserListView(APIView):
    """GET /api/payments/admin/users/"""
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.all().order_by('-created_at')
        data  = []
        for u in users:
            u.refresh_subscription_status()
            data.append({
                'id':                  u.id,
                'email':               u.email,
                'full_name':           u.full_name,
                'subscription_status': u.subscription_status,
                'trial_ends_at':       u.trial_ends_at,
                'subscription_end':    u.subscription_end,
                'has_active_access':   u.has_active_access,
                'created_at':          u.created_at,
            })
        return Response({'success': True, 'data': data})