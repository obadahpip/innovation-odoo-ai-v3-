import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import anthropic

from .models import LessonPlan
from content.models import LearningFile, LearningSection

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
MODEL  = "claude-sonnet-4-6"


def build_section_context():
    """Build a compact course map string for the AI system prompt."""
    sections = LearningSection.objects.prefetch_related('files').all()
    lines = []
    for s in sections:
        files = list(s.files.order_by('file_order'))
        file_list = ', '.join([f'#{f.id} {f.title}' for f in files])
        lines.append(f"Section {s.number} — {s.name}: {file_list}")
    return '\n'.join(lines)


PLAN_SYSTEM_PROMPT = """You are an Odoo learning advisor for the Innovation Odoo AI platform.
Your goal is to chat with the user, understand their role, experience level, and learning goals, \
then recommend a curated, ordered list of lessons from the course.

Course map:
{course_map}

Conversation flow:
1. Ask 3–5 friendly questions about their role (e.g. accountant, developer, manager), \
   their Odoo experience, and what they want to achieve.
2. When you have enough context, generate a plan.

When ready to output the plan, respond ONLY with this exact JSON (no extra text, no markdown fences):
{{"plan": [<file_id>, <file_id>, ...], "summary": "<1-2 sentence rationale>"}}

If the user is still answering questions, reply conversationally. Do not output JSON until you \
have enough information. Keep questions short and friendly."""


class PlanStatusView(APIView):
    """
    GET /api/assessment/plan/
    Returns the current user's lesson plan (if any).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            plan = LessonPlan.objects.get(user=request.user)
        except LessonPlan.DoesNotExist:
            return Response({'has_plan': False, 'lessons': [], 'chat_history': []})

        return Response({
            'has_plan': plan.is_generated,
            'lessons': plan.lessons,
            'chat_history': plan.chat_history,
        })


class PlanChatView(APIView):
    """
    POST /api/assessment/plan/chat/
    Body: { message: str }

    Multi-turn chat. When the AI is ready it outputs JSON with a lesson list.
    We parse it, build the checklist, and return it.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        message = request.data.get('message', '').strip()
        if not message:
            return Response({'detail': 'message is required.'}, status=400)

        plan, _ = LessonPlan.objects.get_or_create(user=request.user)

        history = plan.chat_history or []
        history.append({'role': 'user', 'content': message})

        course_map   = build_section_context()
        system       = PLAN_SYSTEM_PROMPT.format(course_map=course_map)

        # Build messages list (exclude system — passed separately to Anthropic)
        messages = [
            {'role': m['role'], 'content': m['content']}
            for m in history
            if m.get('role') in ('user', 'assistant')
        ]

        try:
            response = client.messages.create(
                model=MODEL,
                max_tokens=600,
                system=system,
                messages=messages,
            )
            ai_reply = response.content[0].text.strip()
        except Exception as e:
            return Response({'detail': f'AI error: {str(e)}'}, status=503)

        history.append({'role': 'assistant', 'content': ai_reply})
        plan.chat_history = history

        # Try to detect if the AI returned a JSON plan
        plan_data    = _extract_plan(ai_reply)
        is_complete  = False
        lessons_list = []

        if plan_data:
            file_ids     = plan_data.get('plan', [])
            lessons_list = _build_lessons_list(file_ids)
            plan.lessons      = lessons_list
            plan.is_generated = True
            is_complete       = True

        plan.save()

        return Response({
            'reply':       ai_reply,
            'is_complete': is_complete,
            'lessons':     lessons_list if is_complete else [],
        })


class PlanResetView(APIView):
    """
    POST /api/assessment/plan/reset/
    Clears the user's lesson plan so they can start over.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        LessonPlan.objects.filter(user=request.user).delete()
        return Response({'detail': 'Plan cleared.'})


class PlanToggleLessonView(APIView):
    """
    PATCH /api/assessment/plan/toggle/<file_id>/
    Toggles the checked state of a lesson in the plan checklist.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, file_id):
        try:
            plan = LessonPlan.objects.get(user=request.user)
        except LessonPlan.DoesNotExist:
            return Response({'detail': 'No plan found.'}, status=404)

        lessons = plan.lessons or []
        updated = False

        for lesson in lessons:
            if lesson.get('file_id') == file_id:
                lesson['checked'] = not lesson.get('checked', False)
                updated = True
                break

        if not updated:
            return Response({'detail': 'Lesson not in plan.'}, status=404)

        plan.lessons = lessons
        plan.save(update_fields=['lessons'])

        return Response({'lessons': lessons})


# ── Helpers ────────────────────────────────────────────────────────────────

def _extract_plan(text: str):
    """Try to parse a JSON plan from the AI reply."""
    try:
        data = json.loads(text)
        if 'plan' in data:
            return data
    except json.JSONDecodeError:
        pass

    try:
        start = text.find('{')
        end   = text.rfind('}') + 1
        if start != -1 and end > start:
            data = json.loads(text[start:end])
            if 'plan' in data:
                return data
    except json.JSONDecodeError:
        pass

    return None


def _build_lessons_list(file_ids: list):
    """
    Given a list of file IDs, return a checklist-ready list of dicts.
    Any IDs not found in DB are skipped silently.
    """
    files    = LearningFile.objects.select_related('section').filter(id__in=file_ids)
    file_map = {f.id: f for f in files}

    lessons = []
    for fid in file_ids:
        f = file_map.get(fid)
        if f:
            lessons.append({
                'file_id':        f.id,
                'title':          f.title,
                'section_name':   f.section.name,
                'section_number': f.section.number,
                'lesson_type':    f.lesson_type,
                'checked':        False,
            })
    return lessons


# ── V1 endpoints kept for backward compatibility ───────────────────────────

class AssessmentStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'detail': 'V2: Use /api/assessment/plan/ for the lesson plan.'
        })


# ── V1 Quiz endpoints (kept) ──────────────────────────────────────────────

class QuizQuestionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, file_id):
        return Response({'detail': 'Quiz not available in V2.'}, status=410)


class QuizSubmitView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({'detail': 'Quiz not available in V2.'}, status=410)
