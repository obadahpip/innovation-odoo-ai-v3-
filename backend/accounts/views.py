from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from django.core.cache import cache

from .models import User, OTPToken
from .serializers import (
    RegisterSerializer, OTPVerifySerializer, ResendOTPSerializer,
    LoginSerializer, ForgotPasswordSerializer, ResetPasswordSerializer,
    UserProfileSerializer, OnboardingSerializer,
)
from .emails import send_otp_email, send_welcome_email


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {'access': str(refresh.access_token), 'refresh': str(refresh)}


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    user = serializer.save()
    otp  = OTPToken.create_for_user(user, OTPToken.PURPOSE_REGISTRATION)
    try:
        send_otp_email(user.email, otp.code, OTPToken.PURPOSE_REGISTRATION)
    except Exception:
        pass
    return Response({'message': 'Registration successful. Please check your email for the verification code.', 'email': user.email}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    serializer = OTPVerifySerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    email = serializer.validated_data['email']
    code  = serializer.validated_data['code']
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    otp = OTPToken.objects.filter(user=user, code=code, purpose=OTPToken.PURPOSE_REGISTRATION, is_used=False).order_by('-created_at').first()
    if not otp or not otp.is_valid():
        return Response({'error': 'Invalid or expired verification code.'}, status=status.HTTP_400_BAD_REQUEST)
    otp.is_used = True
    otp.save()
    user.is_verified = True
    user.save()
    try:
        send_welcome_email(user.email, user.first_name)
    except Exception:
        pass
    tokens = get_tokens_for_user(user)
    return Response({'message': 'Email verified successfully.', 'tokens': tokens, 'user': UserProfileSerializer(user).data})


@api_view(['POST'])
@permission_classes([AllowAny])
def resend_otp(request):
    serializer = ResendOTPSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    email     = serializer.validated_data['email']
    cache_key = f'otp_resend_{email}'
    resend_count = cache.get(cache_key, 0)
    if resend_count >= 3:
        return Response({'error': 'Too many resend attempts. Please wait before trying again.'}, status=status.HTTP_429_TOO_MANY_REQUESTS)
    try:
        user = User.objects.get(email=email, is_verified=False)
        otp  = OTPToken.create_for_user(user, OTPToken.PURPOSE_REGISTRATION)
        send_otp_email(user.email, otp.code, OTPToken.PURPOSE_REGISTRATION)
    except User.DoesNotExist:
        pass
    except Exception:
        pass
    cache.set(cache_key, resend_count + 1, 3600)
    return Response({'message': 'If that email exists and is unverified, a new code has been sent.'})


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    email    = serializer.validated_data['email']
    password = serializer.validated_data['password']
    user     = authenticate(request, username=email, password=password)
    if not user:
        return Response({'error': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)
    if not user.is_verified:
        return Response({'error': 'Please verify your email before logging in.', 'needs_verification': True, 'email': email}, status=status.HTTP_403_FORBIDDEN)
    tokens = get_tokens_for_user(user)
    return Response({'tokens': tokens, 'user': UserProfileSerializer(user).data})


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    serializer = ForgotPasswordSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    email = serializer.validated_data['email']
    try:
        user = User.objects.get(email=email, is_verified=True)
        otp  = OTPToken.create_for_user(user, OTPToken.PURPOSE_PASSWORD_RESET)
        send_otp_email(user.email, otp.code, OTPToken.PURPOSE_PASSWORD_RESET)
    except Exception:
        pass
    return Response({'message': 'If that email is registered, a reset code has been sent.'})


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    serializer = ResetPasswordSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    email        = serializer.validated_data['email']
    code         = serializer.validated_data['code']
    new_password = serializer.validated_data['new_password']
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    otp = OTPToken.objects.filter(user=user, code=code, purpose=OTPToken.PURPOSE_PASSWORD_RESET, is_used=False).order_by('-created_at').first()
    if not otp or not otp.is_valid():
        return Response({'error': 'Invalid or expired reset code.'}, status=status.HTTP_400_BAD_REQUEST)
    otp.is_used = True
    otp.save()
    user.set_password(new_password)
    user.save()
    return Response({'message': 'Password reset successfully. You can now log in.'})


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile(request):
    if request.method == 'GET':
        return Response(UserProfileSerializer(request.user).data)
    serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    serializer.save()
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def onboarding(request):
    serializer = OnboardingSerializer(request.user, data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    user = serializer.save()
    return Response({'message': 'Onboarding complete.', 'user': UserProfileSerializer(user).data})


# ── Phase 5: Change password ──────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """
    POST /api/auth/change-password/
    Body: { current_password, new_password }
    """
    current  = request.data.get('current_password', '')
    new_pass = request.data.get('new_password', '')

    if not current or not new_pass:
        return Response({'error': 'Both current_password and new_password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if len(new_pass) < 8:
        return Response({'error': 'New password must be at least 8 characters.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=request.user.email, password=current)
    if not user:
        return Response({'error': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_pass)
    user.save()
    return Response({'message': 'Password changed successfully.'})


# ── Phase 5: Delete account ───────────────────────────────────────────────────

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    """
    DELETE /api/auth/delete-account/
    Permanently deletes the authenticated user's account.
    """
    user = request.user
    user.delete()
    return Response({'message': 'Account deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
