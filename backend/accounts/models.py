from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
import random
import string


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_verified', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    job_title = models.CharField(max_length=150, blank=True)
    company = models.CharField(max_length=150, blank=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'.strip() or self.email


class OTPToken(models.Model):
    PURPOSE_REGISTRATION = 'registration'
    PURPOSE_PASSWORD_RESET = 'password_reset'
    PURPOSE_CHOICES = [
        (PURPOSE_REGISTRATION, 'Registration'),
        (PURPOSE_PASSWORD_RESET, 'Password Reset'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otp_tokens')
    code = models.CharField(max_length=6)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'otp_tokens'

    @staticmethod
    def generate_code():
        return ''.join(random.choices(string.digits, k=6))

    @staticmethod
    def create_for_user(user, purpose):
        from datetime import timedelta
        OTPToken.objects.filter(user=user, purpose=purpose, is_used=False).update(is_used=True)
        return OTPToken.objects.create(
            user=user,
            code=OTPToken.generate_code(),
            expires_at=timezone.now() + timedelta(minutes=10),
            purpose=purpose,
        )

    def is_valid(self):
        return not self.is_used and self.expires_at > timezone.now()
