from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html
from .models import Payment
from accounts.models import User


# ── Payment Admin ─────────────────────────────────────────────────────────────

class PaymentStatusFilter(admin.SimpleListFilter):
    title = 'Payment Status'
    parameter_name = 'status'

    def lookups(self, request, model_admin):
        return [
            ('pending_verification', 'Pending Verification'),
            ('paid', 'Paid'),
        ]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(status=self.value())
        return queryset


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        'user_email', 'method', 'amount', 'status',
        'transfer_reference', 'created_at', 'verified_at', 'action_button',
    )
    list_filter  = (PaymentStatusFilter, 'method')
    search_fields = ('user__email', 'paypal_order_id', 'transfer_reference')
    readonly_fields = (
        'created_at', 'verified_at', 'verified_by',
        'paypal_order_id', 'paypal_capture_id',
    )
    ordering = ('-created_at',)

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User'

    def action_button(self, obj):
        if obj.status == 'pending_verification':
            return format_html(
                '<a href="/admin/payments/payment/{}/approve/" '
                'style="background:#714B67;color:white;padding:4px 12px;'
                'border-radius:4px;text-decoration:none;font-size:12px;">✓ Approve</a>',
                obj.id,
            )
        return '—'
    action_button.short_description = 'Action'

    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom = [
            path(
                '<int:payment_id>/approve/',
                self.admin_site.admin_view(self.approve_payment),
                name='approve-payment',
            ),
        ]
        return custom + urls

    def approve_payment(self, request, payment_id):
        from django.shortcuts import redirect
        from django.contrib import messages
        try:
            payment = Payment.objects.get(id=payment_id)
            payment.approve(verified_by=request.user)
            messages.success(
                request,
                f'✅ Payment for {payment.user.email} approved. '
                f'Subscription active until {payment.user.subscription_end:%Y-%m-%d}.',
            )
        except Payment.DoesNotExist:
            messages.error(request, 'Payment not found.')
        return redirect('/admin/payments/payment/')


# ── User Subscription Admin ───────────────────────────────────────────────────

class SubscriptionStatusFilter(admin.SimpleListFilter):
    title = 'Subscription Status'
    parameter_name = 'subscription_status'

    def lookups(self, request, model_admin):
        return [
            ('trial',         'On Trial'),
            ('trial_expired', 'Trial Expired'),
            ('active',        'Active (Paid)'),
            ('admin_granted', 'Admin Granted'),
        ]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(subscription_status=self.value())
        return queryset


class UserSubscriptionAdmin(admin.ModelAdmin):
    """
    Read-only view of users' subscription state with a one-click Grant button.
    Register this instead of the default UserAdmin if you want quick access.
    """
    list_display = (
        'email', 'subscription_status', 'trial_ends_at',
        'subscription_end', 'grant_button',
    )
    list_filter  = (SubscriptionStatusFilter,)
    search_fields = ('email', 'first_name', 'last_name')
    readonly_fields = (
        'email', 'subscription_status', 'trial_ends_at', 'subscription_end',
    )
    ordering = ('-created_at',)

    def grant_button(self, obj):
        return format_html(
            '<a href="/admin/accounts/user/{}/grant-subscription/" '
            'style="background:#1a7f4b;color:white;padding:4px 12px;'
            'border-radius:4px;text-decoration:none;font-size:12px;">🎁 Grant 1 Year</a>',
            obj.id,
        )
    grant_button.short_description = 'Grant Access'

    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom = [
            path(
                '<int:user_id>/grant-subscription/',
                self.admin_site.admin_view(self.grant_subscription),
                name='grant-subscription',
            ),
        ]
        return custom + urls

    def grant_subscription(self, request, user_id):
        from django.shortcuts import redirect
        from django.contrib import messages
        try:
            user = User.objects.get(id=user_id)
            user.grant_subscription(granted_by=request.user)
            # Audit trail payment
            Payment.objects.create(
                user=user,
                method='cash',
                amount=0,
                transfer_reference=f'Admin grant by {request.user.email}',
                status='paid',
                verified_by=request.user,
                verified_at=timezone.now(),
            )
            messages.success(
                request,
                f'✅ 1-year subscription granted to {user.email}. '
                f'Expires: {user.subscription_end:%Y-%m-%d}.',
            )
        except User.DoesNotExist:
            messages.error(request, 'User not found.')
        return redirect('/admin/accounts/user/')


# Register the UserSubscriptionAdmin on the User model
# (comment out if you already have a UserAdmin registered)
try:
    admin.site.unregister(User)
except Exception:
    pass

admin.site.register(User, UserSubscriptionAdmin)
