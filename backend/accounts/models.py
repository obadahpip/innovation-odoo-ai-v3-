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
    # ── Core fields ─────────────────────────────────────────────────────────
    email      = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name  = models.CharField(max_length=100, blank=True)
    job_title  = models.CharField(max_length=150, blank=True)
    company    = models.CharField(max_length=150, blank=True)
    is_verified = models.BooleanField(default=False)
    is_active   = models.BooleanField(default=True)
    is_staff    = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)

    # ── Phase 2: Onboarding fields ──────────────────────────────────────────
    ROLE_CHOICES = [
        ('developer',  'Developer'),
        ('accountant', 'Accountant'),
        ('manager',    'Manager'),
        ('student',    'Student'),
        ('other',      'Other'),
    ]
    EXPERIENCE_CHOICES = [
        ('none',     'None'),
        ('some',     'Some'),
        ('advanced', 'Advanced'),
    ]
    role            = models.CharField(max_length=20, choices=ROLE_CHOICES, blank=True)
    experience      = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES, blank=True)
    learning_goal   = models.TextField(blank=True)
    onboarding_done = models.BooleanField(default=False)

    # ── Task 2: Subscription fields ─────────────────────────────────────────
    SUBSCRIPTION_STATUS_CHOICES = [
        ('trial',         'Free Trial'),
        ('trial_expired', 'Trial Expired'),
        ('active',        'Active (Paid)'),
        ('admin_granted', 'Admin Granted'),
    ]
    subscription_status = models.CharField(
        max_length=20,
        choices=SUBSCRIPTION_STATUS_CHOICES,
        default='trial',
    )
    trial_ends_at     = models.DateTimeField(null=True, blank=True)
    subscription_end  = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'.strip() or self.email

    # ── Subscription helpers ────────────────────────────────────────────────

    def activate_trial(self):
        """Call once when the user verifies their email."""
        from datetime import timedelta
        self.subscription_status = 'trial'
        self.trial_ends_at = timezone.now() + timedelta(days=3)
        self.save(update_fields=['subscription_status', 'trial_ends_at'])

    def grant_subscription(self, granted_by=None, years=1):
        """Grant a paid or admin subscription."""
        from datetime import timedelta
        self.subscription_end = timezone.now() + timedelta(days=365 * years)
        self.subscription_status = 'admin_granted' if granted_by else 'active'
        self.save(update_fields=['subscription_status', 'subscription_end'])

    @property
    def has_active_access(self):
        """True when the user is allowed to access course content."""
        now = timezone.now()
        if self.subscription_status == 'trial':
            return bool(self.trial_ends_at) and now <= self.trial_ends_at
        if self.subscription_status in ('active', 'admin_granted'):
            return bool(self.subscription_end) and now <= self.subscription_end
        return False

    @property
    def trial_days_remaining(self):
        """Days left in trial, or 0 if expired / not in trial."""
        if self.subscription_status != 'trial' or not self.trial_ends_at:
            return 0
        delta = self.trial_ends_at - timezone.now()
        return max(0, delta.days)

    def refresh_subscription_status(self):
        """
        Sync the status field with reality (call before returning to frontend).
        Downgrades 'trial' → 'trial_expired' and 'active'/'admin_granted'
        → 'trial_expired' when dates have passed.
        """
        now = timezone.now()
        changed = False

        if self.subscription_status == 'trial':
            if self.trial_ends_at and now > self.trial_ends_at:
                self.subscription_status = 'trial_expired'
                changed = True

        elif self.subscription_status in ('active', 'admin_granted'):
            if self.subscription_end and now > self.subscription_end:
                self.subscription_status = 'trial_expired'
                changed = True

        if changed:
            self.save(update_fields=['subscription_status'])


class OTPToken(models.Model):
    PURPOSE_REGISTRATION   = 'registration'
    PURPOSE_PASSWORD_RESET = 'password_reset'
    PURPOSE_CHOICES = [
        (PURPOSE_REGISTRATION,   'Registration'),
        (PURPOSE_PASSWORD_RESET, 'Password Reset'),
    ]

    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otp_tokens')
    code       = models.CharField(max_length=6)
    expires_at = models.DateTimeField()
    is_used    = models.BooleanField(default=False)
    purpose    = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
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
