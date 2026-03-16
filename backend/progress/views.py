from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from .models import UserProgress
from content.models import LearningFile, LearningSection


class ProgressUpdateView(APIView):
    """
    POST /api/progress/update/
    Body: { file_id, slide_index, completed? }

    V2: No payment gate. Any authenticated user can update progress.
    Uses slide_index instead of step_index.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file_id = request.data.get('file_id')
        slide_index = request.data.get('slide_index', request.data.get('step_index', 0))
        mark_complete = request.data.get('completed', False)

        try:
            file = LearningFile.objects.get(id=file_id)
        except LearningFile.DoesNotExist:
            return Response({'detail': 'Lesson not found.'}, status=404)

        progress, created = UserProgress.objects.get_or_create(
            user=request.user,
            file=file,
            defaults={
                'status': 'in_progress',
                'started_at': timezone.now(),
            }
        )

        if created or progress.status == 'not_started':
            progress.status = 'in_progress'
            progress.started_at = timezone.now()

        # V2: reuse last_step_index field to store slide index
        progress.last_step_index = slide_index

        if mark_complete:
            progress.status = 'completed'
            progress.completed_at = timezone.now()

        progress.save()
        return Response({
            'status': progress.status,
            'last_slide_index': progress.last_step_index,
        })


class DashboardView(APIView):
    """
    GET /api/progress/dashboard/

    V2: Returns ALL 9 sections with ALL 91 lessons, all unlocked.
    No study plan required. No payment check.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sections = LearningSection.objects.prefetch_related('files').all()
        all_files = LearningFile.objects.select_related('section').all()

        progress_map = {
            p.file_id: p
            for p in UserProgress.objects.filter(user=request.user)
        }

        total_files = 0
        total_completed = 0
        sections_data = []

        for section in sections:
            files = sorted(
                [f for f in all_files if f.section_id == section.id],
                key=lambda f: f.file_order
            )

            section_completed = 0
            files_data = []

            for f in files:
                prog = progress_map.get(f.id)
                status = prog.status if prog else 'not_started'
                last_slide = prog.last_step_index if prog else 0

                if status == 'completed':
                    section_completed += 1

                files_data.append({
                    'id': f.id,
                    'title': f.title,
                    'lesson_type': f.lesson_type,
                    'status': status,
                    'last_slide_index': last_slide,
                })

            total_files += len(files)
            total_completed += section_completed

            sections_data.append({
                'id': section.id,
                'number': section.number,
                'name': section.name,
                'description': section.description,
                'estimated_hours': section.estimated_hours,
                'is_locked': False,   # V2: always unlocked
                'completed_count': section_completed,
                'total_count': len(files),
                'files': files_data,
            })

        overall_pct = round(
            (total_completed / total_files * 100) if total_files else 0
        )

        # Find "continue learning" lesson (first in_progress or not_started)
        continue_file = None
        for sec in sections_data:
            for f in sec['files']:
                if f['status'] in ('in_progress', 'not_started'):
                    continue_file = {
                        'file_id': f['id'],
                        'title': f['title'],
                        'section': sec['name'],
                    }
                    break
            if continue_file:
                break

        return Response({
            'overall_progress': overall_pct,
            'total_files': total_files,
            'total_completed': total_completed,
            'continue_learning': continue_file,
            'sections': sections_data,
        })
