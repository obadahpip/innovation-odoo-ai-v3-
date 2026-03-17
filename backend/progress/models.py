import uuid
from django.db import models
from django.conf import settings


class UserProgress(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed',   'Completed'),
    ]

    user   = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='progress_records')
    file   = models.ForeignKey('content.LearningFile',   on_delete=models.CASCADE, related_name='user_progress')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    # V2: stores the last slide index (was step_index in V1)
    last_step_index = models.IntegerField(default=0)
    started_at      = models.DateTimeField(null=True, blank=True)
    completed_at    = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['user', 'file']

    def __str__(self):
        return f"{self.user.email} — {self.file.title} [{self.status}]"


# ── Phase 3: Certificate ──────────────────────────────────────────────────────

class Certificate(models.Model):
    user           = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='certificate')
    certificate_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    issued_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'certificates'

    def __str__(self):
        return f"Certificate({self.user.email}, {self.certificate_id})"
