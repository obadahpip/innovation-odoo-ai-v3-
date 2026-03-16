from django.contrib import admin
from .models import LearningSection, LearningFile, LessonSlide, LessonStep, QuizQuestion


@admin.register(LearningSection)
class LearningSectionAdmin(admin.ModelAdmin):
    list_display = ('number', 'name', 'estimated_hours')
    ordering = ('number',)


@admin.register(LearningFile)
class LearningFileAdmin(admin.ModelAdmin):
    list_display = ('title', 'section', 'lesson_type', 'file_order')
    list_filter = ('section', 'lesson_type')
    search_fields = ('title',)
    ordering = ('section', 'file_order')


@admin.register(LessonSlide)
class LessonSlideAdmin(admin.ModelAdmin):
    list_display = ('file', 'slide_number', 'title', 'is_intro', 'is_conclusion')
    list_filter = ('is_intro', 'is_conclusion', 'file__section')
    search_fields = ('file__title', 'title')
    ordering = ('file', 'slide_number')


@admin.register(LessonStep)
class LessonStepAdmin(admin.ModelAdmin):
    list_display = ('file', 'step_order', 'action_type')
    list_filter = ('action_type',)
    search_fields = ('file__title',)


@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ('file', 'question_text')
    search_fields = ('file__title', 'question_text')
