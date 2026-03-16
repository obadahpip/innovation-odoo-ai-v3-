from django.urls import path
from .views import (
    # V2 plan endpoints
    PlanStatusView,
    PlanChatView,
    PlanResetView,
    PlanToggleLessonView,
    # V1 quiz endpoints (kept)
    QuizQuestionsView,
    QuizSubmitView,
    # V1 assessment status (stub)
    AssessmentStatusView,
)

urlpatterns = [
    # V2 lesson plan
    path('plan/', PlanStatusView.as_view(), name='plan-status'),
    path('plan/chat/', PlanChatView.as_view(), name='plan-chat'),
    path('plan/reset/', PlanResetView.as_view(), name='plan-reset'),
    path('plan/toggle/<int:file_id>/', PlanToggleLessonView.as_view(), name='plan-toggle'),

    # V1 quiz (still used)
    path('quiz/<int:file_id>/', QuizQuestionsView.as_view(), name='quiz-questions'),
    path('quiz/submit/', QuizSubmitView.as_view(), name='quiz-submit'),

    # V1 stub (returns redirect message)
    path('', AssessmentStatusView.as_view(), name='assessment-status'),
]
