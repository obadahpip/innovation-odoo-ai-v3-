from django.urls import path
from .views import (
    LessonFileDetailView,
    LessonSlidesView,
    SlideSimplifyView,
    SlideAskView,
    GlobalAIView,
    TutorChatView,
    AIHistoryView,
    AIHistorySaveView,
    AIHistoryClearView,
)

urlpatterns = [
    path('files/<int:file_id>/',        LessonFileDetailView.as_view(), name='file-detail'),
    path('files/<int:file_id>/slides/', LessonSlidesView.as_view(),     name='file-slides'),
    path('slides/simplify/',            SlideSimplifyView.as_view(),    name='slide-simplify'),
    path('slides/ask/',                 SlideAskView.as_view(),         name='slide-ask'),
    path('ai/chat/',                    GlobalAIView.as_view(),         name='global-ai-chat'),
    path('tutor/',                      TutorChatView.as_view(),        name='tutor-chat'),
    # ── Phase 5: AI conversation persistence ────────────────────────────────
    path('ai/history/',                 AIHistoryView.as_view(),        name='ai-history'),
    path('ai/history/save/',            AIHistorySaveView.as_view(),    name='ai-history-save'),
    path('ai/history/clear/',           AIHistoryClearView.as_view(),   name='ai-history-clear'),
]
