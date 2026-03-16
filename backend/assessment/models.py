from django.db import models
from django.conf import settings


class Assessment(models.Model):
    """V1 assessment — kept for data safety, not used in V2 UI."""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='assessment'
    )
    chat_history = models.JSONField(default=list, blank=True)
    generated_plan = models.JSONField(null=True, blank=True)
    is_finalized = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Assessment — {self.user.email}"


class StudyPlan(models.Model):
    """V1 study plan — kept for data safety, not used in V2 UI."""
    STATUS_CHOICES = [
        ('pending_payment', 'Pending Payment'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='study_plan'
    )
    assessment = models.ForeignKey(
        Assessment, null=True, blank=True,
        on_delete=models.SET_NULL, related_name='study_plans'
    )
    sections_ordered = models.JSONField(default=list)
    total_price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='pending_payment')

    def __str__(self):
        return f"StudyPlan — {self.user.email}"


class LessonPlan(models.Model):
    """
    V2 lesson plan.
    Created optionally via a chat with the AI agent.
    Stores an ordered list of lesson IDs as a checklist.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lesson_plan'
    )
    # AI chat history used to generate this plan
    chat_history = models.JSONField(default=list, blank=True)
    # Ordered list of { file_id, title, section_name, checked }
    lessons = models.JSONField(default=list, blank=True)
    is_generated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"LessonPlan — {self.user.email} ({'generated' if self.is_generated else 'draft'})"
    
class UserQuizResult(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='quiz_results'
    )
    learning_file = models.ForeignKey(
        'content.LearningFile',
        on_delete=models.CASCADE,
        related_name='quiz_results'
    )
    score = models.IntegerField(default=0)
    total = models.IntegerField(default=0)
    answers = models.JSONField(default=dict)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'learning_file']

    def __str__(self):
        return f"{self.user.email} — {self.learning_file.title} [{self.score}/{self.total}]"
