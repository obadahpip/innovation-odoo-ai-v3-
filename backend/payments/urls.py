from django.urls import path
from .views import InitiatePaymentView, PaymentStatusView

urlpatterns = [
    path('initiate/', InitiatePaymentView.as_view(), name='payment-initiate'),
    path('status/', PaymentStatusView.as_view(), name='payment-status'),
]