from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/',         views.register,         name='register'),
    path('verify-otp/',       views.verify_otp,       name='verify-otp'),
    path('resend-otp/',       views.resend_otp,        name='resend-otp'),
    path('login/',            views.login_view,        name='login'),
    path('token/refresh/',    TokenRefreshView.as_view(), name='token-refresh'),
    path('forgot-password/',  views.forgot_password,  name='forgot-password'),
    path('reset-password/',   views.reset_password,   name='reset-password'),
    path('profile/',          views.profile,           name='profile'),
    path('onboarding/',       views.onboarding,        name='onboarding'),
    # ── Phase 5 ─────────────────────────────────────────────────────────────
    path('change-password/',  views.change_password,  name='change-password'),
    path('delete-account/',   views.delete_account,   name='delete-account'),
]
