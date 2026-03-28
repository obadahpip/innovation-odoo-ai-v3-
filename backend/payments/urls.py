from django.urls import path
from .views import (
    SubscriptionStatusView,
    InitiateManualPaymentView,
    PayPalConfirmView,
    AdminGrantSubscriptionView,
    AdminUserListView,
)

urlpatterns = [
    # User-facing
    path('subscription/',              SubscriptionStatusView.as_view(),    name='subscription-status'),
    path('initiate/',                  InitiateManualPaymentView.as_view(), name='payment-initiate'),
    path('paypal/confirm/',            PayPalConfirmView.as_view(),         name='paypal-confirm'),

    # Admin-only
    path('admin/grant/<int:user_id>/', AdminGrantSubscriptionView.as_view(), name='admin-grant'),
    path('admin/users/',               AdminUserListView.as_view(),          name='admin-users'),
]