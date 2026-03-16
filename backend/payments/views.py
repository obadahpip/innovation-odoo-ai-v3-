from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Payment
from assessment.models import StudyPlan


class InitiatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        method = request.data.get('method')
        if method not in ['cash', 'cliq']:
            return Response({'detail': 'Invalid method.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            study_plan = StudyPlan.objects.get(user=request.user)
        except StudyPlan.DoesNotExist:
            return Response({'detail': 'No study plan found.'}, status=status.HTTP_404_NOT_FOUND)

        # Avoid duplicate payments
        Payment.objects.filter(user=request.user, status='pending_verification').delete()

        payment = Payment.objects.create(
            user=request.user,
            study_plan=study_plan,
            amount=study_plan.total_price,
            method=method,
            status='pending_verification',
        )

        return Response({
            'id': payment.id,
            'method': payment.method,
            'amount': str(payment.amount),
            'status': payment.status,
        })


class PaymentStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        payment = Payment.objects.filter(user=request.user).order_by('-created_at').first()
        if not payment:
            return Response({'detail': 'No payment found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({
            'id': payment.id,
            'method': payment.method,
            'amount': str(payment.amount),
            'status': payment.status,
            'created_at': payment.created_at,
        })