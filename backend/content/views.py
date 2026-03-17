from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from openai import OpenAI

from .models import LearningFile, LessonSlide, AIConversation

client = OpenAI(api_key=settings.OPENAI_API_KEY)


# ── Slide list ────────────────────────────────────────────────────────────────

class LessonSlidesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, file_id):
        try:
            file = LearningFile.objects.get(id=file_id)
        except LearningFile.DoesNotExist:
            return Response({'detail': 'Lesson not found.'}, status=404)

        slides = file.slides.all()
        data = [{
            'id': s.id, 'slide_number': s.slide_number, 'title': s.title,
            'content': s.content, 'is_intro': s.is_intro, 'is_conclusion': s.is_conclusion,
        } for s in slides]

        return Response({
            'file_id': file.id, 'title': file.title,
            'lesson_type': file.lesson_type, 'section': file.section.name,
            'total_slides': len(data), 'slides': data,
        })


class LessonFileDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, file_id):
        try:
            file = LearningFile.objects.get(id=file_id)
        except LearningFile.DoesNotExist:
            return Response({'detail': 'Lesson not found.'}, status=404)
        return Response({'id': file.id, 'title': file.title, 'section': file.section.name, 'lesson_type': file.lesson_type})


# ── Per-slide AI: Simplify ────────────────────────────────────────────────────

class SlideSimplifyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        slide_id = request.data.get('slide_id')
        if not slide_id:
            return Response({'detail': 'slide_id is required.'}, status=400)
        try:
            slide = LessonSlide.objects.select_related('file').get(id=slide_id)
        except LessonSlide.DoesNotExist:
            return Response({'detail': 'Slide not found.'}, status=404)

        prompt = f"""You are an expert Odoo tutor. Simplify the following lesson slide content \
so that a complete beginner can understand it easily. Use plain language, short sentences, \
and a friendly tone. Keep it concise (max 150 words). Do not use jargon without explanation.

Slide title: {slide.title}
Slide content:
{slide.content}

Provide only the simplified explanation — no preamble or meta-commentary."""

        try:
            response = client.chat.completions.create(
                model='gpt-4o', messages=[{'role': 'user', 'content': prompt}],
                max_tokens=300, temperature=0.5,
            )
            simplified = response.choices[0].message.content.strip()
        except Exception as e:
            return Response({'detail': f'AI error: {str(e)}'}, status=503)
        return Response({'simplified': simplified})


# ── Per-slide AI: Ask ─────────────────────────────────────────────────────────

class SlideAskView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        slide_id = request.data.get('slide_id')
        question = request.data.get('question', '').strip()
        history  = request.data.get('history', [])

        if not slide_id or not question:
            return Response({'detail': 'slide_id and question are required.'}, status=400)
        try:
            slide = LessonSlide.objects.select_related('file__section').get(id=slide_id)
        except LessonSlide.DoesNotExist:
            return Response({'detail': 'Slide not found.'}, status=404)

        system_prompt = f"""You are an expert Odoo tutor helping a student understand a lesson slide.
Answer the student's question clearly and concisely. Stay focused on the slide context.
Lesson: {slide.file.title} | Section: {slide.file.section.name}
Slide {slide.slide_number}: {slide.title}
Content: {slide.content[:800]}"""

        messages = [{'role': 'system', 'content': system_prompt}]
        for msg in history[-4:]:
            if msg.get('role') in ('user', 'assistant'):
                messages.append({'role': msg['role'], 'content': msg['content']})
        messages.append({'role': 'user', 'content': question})

        try:
            response = client.chat.completions.create(model='gpt-4o', messages=messages, max_tokens=400, temperature=0.7)
            answer = response.choices[0].message.content.strip()
        except Exception as e:
            return Response({'detail': f'AI error: {str(e)}'}, status=503)
        return Response({'answer': answer})


# ── Global AI chat ────────────────────────────────────────────────────────────

class GlobalAIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        message = request.data.get('message', '').strip()
        history = request.data.get('history', [])
        if not message:
            return Response({'detail': 'message is required.'}, status=400)

        from .models import LearningSection
        sections = LearningSection.objects.prefetch_related('files').all()
        section_summary = '\n'.join([
            f"Section {s.number}: {s.name} ({s.files.count()} lessons) — {s.description}"
            for s in sections
        ])

        system_prompt = f"""You are a helpful AI assistant for an Odoo learning platform called Innovation Odoo AI.
Help users navigate the course, understand topics, recommend lessons, and answer Odoo questions.
Platform: 81 lessons in 9 sections:\n{section_summary}
Be concise and friendly. Do not answer questions unrelated to Odoo or this course."""

        messages = [{'role': 'system', 'content': system_prompt}]
        for msg in history[-6:]:
            if msg.get('role') in ('user', 'assistant'):
                messages.append({'role': msg['role'], 'content': msg['content']})
        messages.append({'role': 'user', 'content': message})

        try:
            response = client.chat.completions.create(model='gpt-4o', messages=messages, max_tokens=400, temperature=0.7)
            reply = response.choices[0].message.content.strip()
        except Exception as e:
            return Response({'detail': f'AI error: {str(e)}'}, status=503)
        return Response({'reply': reply})


# ── Legacy tutor ──────────────────────────────────────────────────────────────

class TutorChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file_id = request.data.get('file_id')
        message = request.data.get('message', '').strip()
        history = request.data.get('history', [])
        if not message:
            return Response({'detail': 'message is required.'}, status=400)

        context = ''
        if file_id:
            try:
                file = LearningFile.objects.select_related('section').get(id=file_id)
                context = f"Lesson: {file.title}, Section: {file.section.name}"
            except LearningFile.DoesNotExist:
                pass

        system_prompt = f"You are an expert Odoo tutor. {context}\nBe concise, clear, and encouraging. Max 200 words."
        messages = [{'role': 'system', 'content': system_prompt}]
        for msg in history[-6:]:
            if msg.get('role') in ('user', 'assistant'):
                messages.append({'role': msg['role'], 'content': msg['content']})
        messages.append({'role': 'user', 'content': message})

        try:
            response = client.chat.completions.create(model='gpt-4o', messages=messages, max_tokens=400, temperature=0.7)
            reply = response.choices[0].message.content.strip()
        except Exception as e:
            return Response({'detail': f'AI error: {str(e)}'}, status=503)
        return Response({'reply': reply})


# ── Phase 5: AI Conversation Persistence ─────────────────────────────────────

class AIHistoryView(APIView):
    """GET /api/content/ai/history/ — returns last 10 messages"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            convo = AIConversation.objects.get(user=request.user)
            messages = convo.messages[-10:]
        except AIConversation.DoesNotExist:
            messages = []
        return Response({'messages': messages})


class AIHistorySaveView(APIView):
    """POST /api/content/ai/history/save/ — saves up to 20 messages"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        messages = request.data.get('messages', [])
        if not isinstance(messages, list):
            return Response({'detail': 'messages must be a list.'}, status=400)

        convo, _ = AIConversation.objects.get_or_create(user=request.user)
        convo.messages = messages[-20:]
        convo.save()
        return Response({'saved': len(convo.messages)})


class AIHistoryClearView(APIView):
    """POST /api/content/ai/history/clear/ — clears all messages"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        AIConversation.objects.filter(user=request.user).update(messages=[])
        return Response({'detail': 'Conversation cleared.'})
