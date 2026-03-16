from django.db import models
from django.conf import settings


class Payment(models.Model):
    METHOD_CHOICES = [
        ('card', 'Card (PayPal)'),
        ('cash', 'Cash'),
        ('cliq', 'CliQ'),
    ]
    STATUS_CHOICES = [
        ('not_paid', 'Not Paid'),
        ('pending_verification', 'Pending Verification'),
        ('paid', 'Paid'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments')
    study_plan = models.ForeignKey('assessment.StudyPlan', on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    method = models.CharField(max_length=10, choices=METHOD_CHOICES)
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='not_paid')
    paypal_order_id = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL, related_name='verified_payments'
    )

    def __str__(self):
        return f"{self.user.email} - {self.method} - {self.status}"