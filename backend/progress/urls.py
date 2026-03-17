from django.urls import path
from .views import ProgressUpdateView, DashboardView, CertificateView

urlpatterns = [
    path('update/',                 ProgressUpdateView.as_view(), name='progress-update'),
    path('dashboard/',              DashboardView.as_view(),      name='dashboard'),
    # ── Phase 3 ─────────────────────────────────────────────────────────────
    path('certificate/generate/',   CertificateView.as_view(),    name='certificate-generate'),
]
