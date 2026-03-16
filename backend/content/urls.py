from django.urls import path
from .views import (
    LessonFileDetailView,
    LessonSlidesView,
    SlideSimplifyView,
    SlideAskView,
    GlobalAIView,
    TutorChatView,
)

urlpatterns = [
    # Lesson detail
    path('files/<int:file_id>/', LessonFileDetailView.as_view(), name='file-detail'),

    # V2 slides
    path('files/<int:file_id>/slides/', LessonSlidesView.as_view(), name='file-slides'),

    # V2 per-slide AI actions
    path('slides/simplify/', SlideSimplifyView.as_view(), name='slide-simplify'),
    path('slides/ask/', SlideAskView.as_view(), name='slide-ask'),

    # Global floating AI (course concierge)
    path('ai/chat/', GlobalAIView.as_view(), name='global-ai-chat'),

    # Legacy V1 tutor (kept for compatibility)
    path('tutor/', TutorChatView.as_view(), name='tutor-chat'),
]
