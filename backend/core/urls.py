from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def health_check(request):
    return JsonResponse({'status': 'ok', 'service': 'innovation-odoo-ai', 'version': '3.0'})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check),

    # Auth
    path('api/auth/', include('accounts.urls')),

    # Content
    path('api/content/', include('content.urls')),

    # Assessment
    path('api/assessment/', include('assessment.urls')),

    # Progress
    path('api/progress/', include('progress.urls')),

    # Payments & Subscriptions  ← Task 2: uncommented and active
    path('api/payments/', include('payments.urls')),
]
