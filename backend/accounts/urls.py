from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/',        views.register,        name='register'),
    path('verify-otp/',      views.verify_otp,      name='verify-otp'),
    path('resend-otp/',      views.resend_otp,      name='resend-otp'),
    path('login/',           views.login_view,       name='login'),
    path('token/refresh/',   TokenRefreshView.as_view(), name='token-refresh'),
    path('forgot-password/', views.forgot_password, name='forgot-password'),
    path('reset-password/',  views.reset_password,  name='reset-password'),
    path('profile/',         views.profile,         name='profile'),
    # ── Phase 2 ─────────────────────────────────────────────────────────
    path('onboarding/',      views.onboarding,      name='onboarding'),
]
