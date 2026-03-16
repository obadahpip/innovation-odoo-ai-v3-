from django.urls import path
from .views import ProgressUpdateView, DashboardView

urlpatterns = [
    path('update/', ProgressUpdateView.as_view(), name='progress-update'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]