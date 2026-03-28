from django.db import models
from django.conf import settings
from django.utils import timezone


class Payment(models.Model):
    """
    V3 Payment — tied to a platform subscription ($300 / 1 year).
    Decoupled from the old V1 StudyPlan model.
    """
    METHOD_CHOICES = [
        ('paypal', 'PayPal (Card)'),
        ('cash',   'Cash'),
        ('cliq',   'CliQ'),
    ]
    STATUS_CHOICES = [
        ('pending_verification', 'Pending Verification'),  # cash / CliQ submitted
        ('paid',                 'Paid'),                  # confirmed
    ]

    SUBSCRIPTION_PRICE = 300  # USD

    user   = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='subscription_payments',
    )
    amount = models.DecimalField(max_digits=8, decimal_places=2, default=300)
    method = models.CharField(max_length=10, choices=METHOD_CHOICES)
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='pending_verification')

    # PayPal-specific
    paypal_order_id   = models.CharField(max_length=255, blank=True)
    paypal_capture_id = models.CharField(max_length=255, blank=True)

    # Cash / CliQ reference uploaded by user
    transfer_reference = models.CharField(max_length=255, blank=True,
                                          help_text='Transaction ref / screenshot description')

    created_at  = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='verified_subscription_payments',
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.email} | {self.method} | {self.status} | ${self.amount}'

    def approve(self, verified_by=None):
        """Mark paid and grant the user a 1-year subscription."""
        self.status      = 'paid'
        self.verified_at = timezone.now()
        self.verified_by = verified_by
        self.save()
        self.user.grant_subscription(granted_by=verified_by)
