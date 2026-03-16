from django.db import models


class LearningSection(models.Model):
    number = models.IntegerField(unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    estimated_hours = models.IntegerField(default=0)

    class Meta:
        ordering = ['number']

    def __str__(self):
        return f"{self.number}. {self.name}"


class LearningFile(models.Model):
    LESSON_TYPES = [
        ('intro', 'Introduction'),
        ('lesson', 'Lesson'),
    ]

    title = models.CharField(max_length=255)
    section = models.ForeignKey(
        LearningSection, on_delete=models.CASCADE, related_name='files'
    )
    rst_content = models.TextField(blank=True)
    html_content = models.TextField(blank=True)
    file_order = models.IntegerField(default=0)
    lesson_type = models.CharField(
        max_length=10, choices=LESSON_TYPES, default='lesson'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['section__number', 'file_order']

    def __str__(self):
        return f"[Section {self.section.number}] {self.title}"


class LessonSlide(models.Model):
    """
    V2 slide-based lesson content.
    Each lesson is broken into slides: first = intro, last = conclusion.
    """
    file = models.ForeignKey(
        LearningFile, on_delete=models.CASCADE, related_name='slides'
    )
    slide_number = models.IntegerField(default=1)
    title = models.CharField(max_length=255)
    content = models.TextField()          # Rich markdown/text content
    is_intro = models.BooleanField(default=False)
    is_conclusion = models.BooleanField(default=False)

    class Meta:
        ordering = ['file', 'slide_number']
        unique_together = ['file', 'slide_number']

    def __str__(self):
        tag = ' [INTRO]' if self.is_intro else ' [CONCLUSION]' if self.is_conclusion else ''
        return f"[{self.file.title}] Slide {self.slide_number}{tag}"


class LessonStep(models.Model):
    """
    V1 step model — kept for data migration safety. Not used in V2 UI.
    """
    ACTION_TYPES = [
        ('click',    'Click'),
        ('observe',  'Observe'),
        ('type',     'Type'),
        ('navigate', 'Navigate'),
    ]

    file = models.ForeignKey(
        LearningFile, on_delete=models.CASCADE, related_name='steps'
    )
    step_order = models.IntegerField(default=0)
    instruction_text = models.TextField()
    odoo_screen_target = models.CharField(max_length=255, blank=True)
    action_type = models.CharField(
        max_length=20, choices=ACTION_TYPES, default='observe'
    )
    highlight_selector = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['file', 'step_order']

    def __str__(self):
        return f"[{self.file.title}] Step {self.step_order}"


class QuizQuestion(models.Model):
    file = models.ForeignKey(
        LearningFile, on_delete=models.CASCADE, related_name='quiz_questions'
    )
    question_text = models.TextField()
    options = models.JSONField()
    correct_answer = models.CharField(max_length=255)
    explanation = models.TextField(blank=True)

    class Meta:
        ordering = ['file']

    def __str__(self):
        return f"[{self.file.title}] {self.question_text[:60]}"
