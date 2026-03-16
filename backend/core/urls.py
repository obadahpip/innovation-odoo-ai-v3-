from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def health_check(request):
    return JsonResponse({'status': 'ok', 'service': 'innovation-odoo-ai', 'version': '2.0'})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check),

    # Auth — unchanged from V1
    path('api/auth/', include('accounts.urls')),

    # Content — V2: adds slides, simplify, ask, global AI
    path('api/content/', include('content.urls')),

    # Assessment — V2: plan chat + checklist (quiz kept)
    path('api/assessment/', include('assessment.urls')),

    # Progress — V2: no payment gate, free access dashboard
    path('api/progress/', include('progress.urls')),

    # Payments — kept in codebase but not linked from UI in V2
    # path('api/payment/', include('payments.urls')),
]
