from rest_framework.permissions import BasePermission


class HasActiveSubscription(BasePermission):
    """
    Allows access only to users who are within their free trial OR
    have an active paid / admin-granted subscription.

    Usage in any view:
        permission_classes = [IsAuthenticated, HasActiveSubscription]
    """
    message = 'Your free trial has expired. Please subscribe to continue.'

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        # Staff / superusers always have access
        if request.user.is_staff or request.user.is_superuser:
            return True
        request.user.refresh_subscription_status()
        return request.user.has_active_access
