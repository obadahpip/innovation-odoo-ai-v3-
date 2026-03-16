from django.contrib import admin
from .models import Assessment, StudyPlan, UserQuizResult

@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_finalized', 'created_at')
    list_filter = ('is_finalized',)
    search_fields = ('user__email',)

@admin.register(StudyPlan)
class StudyPlanAdmin(admin.ModelAdmin):
    list_display = ('user', 'status')
    list_filter = ('status',)

@admin.register(UserQuizResult)
class UserQuizResultAdmin(admin.ModelAdmin):
    list_display = ('user', 'learning_file', 'score', 'total', 'completed_at')
    search_fields = ('user__email',)