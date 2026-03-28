# ── accounts/views.py  (only the verify_otp function changes) ───────────────
# Replace your existing verify_otp with this version.
# Everything else in accounts/views.py stays identical.

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

    otp = OTPToken.objects.filter(
        user=user, code=code,
        purpose=OTPToken.PURPOSE_REGISTRATION, is_used=False
    ).order_by('-created_at').first()

    if not otp or not otp.is_valid():
        return Response(
            {'error': 'Invalid or expired verification code.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    otp.is_used = True
    otp.save()

    user.is_verified = True
    user.save()

    # ── Task 2: Start 3-day free trial ──────────────────────────────────────
    user.activate_trial()
    # ────────────────────────────────────────────────────────────────────────

    try:
        send_welcome_email(user.email, user.first_name)
    except Exception:
        pass

    tokens = get_tokens_for_user(user)
    return Response({
        'message': 'Email verified successfully.',
        'tokens': tokens,
        'user': UserProfileSerializer(user).data,
    })
