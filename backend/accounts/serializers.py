from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'confirm_password']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        return User.objects.create_user(**validated_data)


class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    code  = serializers.CharField(max_length=6, min_length=6)


class ResendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()


class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    email            = serializers.EmailField()
    code             = serializers.CharField(max_length=6, min_length=6)
    new_password     = serializers.CharField(validators=[validate_password])
    confirm_password = serializers.CharField()

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    has_active_access    = serializers.SerializerMethodField()
    trial_days_remaining = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'job_title', 'company',
            'is_verified', 'created_at',
            # Onboarding
            'role', 'experience', 'learning_goal', 'onboarding_done',
            # Subscription
            'subscription_status', 'trial_ends_at', 'subscription_end',
            'has_active_access', 'trial_days_remaining',
        ]
        read_only_fields = [
            'id', 'email', 'is_verified', 'created_at',
            'subscription_status', 'trial_ends_at', 'subscription_end',
            'has_active_access', 'trial_days_remaining',
        ]

    def get_has_active_access(self, obj):
        obj.refresh_subscription_status()
        return obj.has_active_access

    def get_trial_days_remaining(self, obj):
        return obj.trial_days_remaining


class OnboardingSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['role', 'experience', 'learning_goal']

    def update(self, instance, validated_data):
        instance.role          = validated_data.get('role', instance.role)
        instance.experience    = validated_data.get('experience', instance.experience)
        instance.learning_goal = validated_data.get('learning_goal', instance.learning_goal)
        instance.onboarding_done = True
        instance.save()
        return instance
