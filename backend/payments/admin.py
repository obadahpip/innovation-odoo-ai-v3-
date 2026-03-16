from django.contrib import admin
from django.utils import timezone
from .models import Payment


class PaymentStatusFilter(admin.SimpleListFilter):
    title = 'Payment Status'
    parameter_name = 'status'

    def lookups(self, request, model_admin):
        return [
            ('pending_verification', 'Pending Verification'),
            ('paid', 'Paid'),
            ('failed', 'Failed'),
        ]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(status=self.value())
        return queryset


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        'user_email', 'method', 'amount', 'status',
        'created_at', 'verified_at', 'approve_button'
    )
    list_filter = (PaymentStatusFilter, 'method')
    search_fields = ('user__email',)
    readonly_fields = ('created_at', 'verified_at', 'verified_by')
    ordering = ('-created_at',)

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User'

    def approve_button(self, obj):
        if obj.status == 'pending_verification':
            return f'<a href="/admin/payments/payment/{obj.id}/approve/" ' \
                   f'style="background:#714B67;color:white;padding:4px 10px;' \
                   f'border-radius:4px;text-decoration:none;">Approve</a>'
        return '—'
    approve_button.allow_tags = True
    approve_button.short_description = 'Action'

    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom = [
            path('<int:payment_id>/approve/', self.admin_site.admin_view(self.approve_payment), name='approve-payment'),
        ]
        return custom + urls

    def approve_payment(self, request, payment_id):
        from django.shortcuts import redirect
        from django.contrib import messages
        from accounts.emails import send_payment_approved_email
        try:
            payment = Payment.objects.get(id=payment_id)
            payment.status = 'paid'
            payment.verified_at = timezone.now()
            payment.verified_by = request.user
            payment.save()

            study_plan = payment.user.study_plans.filter(status='pending_payment').first()
            if study_plan:
                study_plan.status = 'active'
                study_plan.save()

            send_payment_approved_email(payment.user.email)
            messages.success(request, f'Payment for {payment.user.email} approved and email sent.')
        except Payment.DoesNotExist:
            messages.error(request, 'Payment not found.')
        return redirect('/admin/payments/payment/')