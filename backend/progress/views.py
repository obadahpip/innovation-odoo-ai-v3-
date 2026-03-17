from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from .models import UserProgress, Certificate
from content.models import LearningFile, LearningSection


class ProgressUpdateView(APIView):
    """
    POST /api/progress/update/
    Body: { file_id, slide_index, completed? }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file_id      = request.data.get('file_id')
        slide_index  = request.data.get('slide_index', request.data.get('step_index', 0))
        mark_complete = request.data.get('completed', False)

        try:
            file = LearningFile.objects.get(id=file_id)
        except LearningFile.DoesNotExist:
            return Response({'detail': 'Lesson not found.'}, status=404)

        progress, created = UserProgress.objects.get_or_create(
            user=request.user,
            file=file,
            defaults={'status': 'in_progress', 'started_at': timezone.now()},
        )

        if created or progress.status == 'not_started':
            progress.status     = 'in_progress'
            progress.started_at = timezone.now()

        progress.last_step_index = slide_index

        if mark_complete:
            progress.status       = 'completed'
            progress.completed_at = timezone.now()

        progress.save()
        return Response({
            'status':           progress.status,
            'last_slide_index': progress.last_step_index,
        })


class DashboardView(APIView):
    """
    GET /api/progress/dashboard/
    Returns all 9 sections with all lessons, all unlocked.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sections  = LearningSection.objects.prefetch_related('files').all()
        all_files = LearningFile.objects.select_related('section').all()

        progress_map = {
            p.file_id: p
            for p in UserProgress.objects.filter(user=request.user)
        }

        total_files     = 0
        total_completed = 0
        sections_data   = []

        for section in sections:
            files = sorted(
                [f for f in all_files if f.section_id == section.id],
                key=lambda f: f.file_order,
            )

            section_completed = 0
            files_data = []

            for f in files:
                prog       = progress_map.get(f.id)
                status     = prog.status           if prog else 'not_started'
                last_slide = prog.last_step_index  if prog else 0

                if status == 'completed':
                    section_completed += 1

                files_data.append({
                    'id':              f.id,
                    'title':           f.title,
                    'lesson_type':     f.lesson_type,
                    'status':          status,
                    'last_slide_index': last_slide,
                })

            total_files     += len(files)
            total_completed += section_completed

            sections_data.append({
                'id':              section.id,
                'number':          section.number,
                'name':            section.name,
                'description':     section.description,
                'estimated_hours': section.estimated_hours,
                'is_locked':       False,
                'completed_count': section_completed,
                'total_count':     len(files),
                'files':           files_data,
            })

        overall_pct = round((total_completed / total_files * 100) if total_files else 0)

        # First in_progress or not_started lesson
        continue_file = None
        for sec in sections_data:
            for f in sec['files']:
                if f['status'] in ('in_progress', 'not_started'):
                    continue_file = {'file_id': f['id'], 'title': f['title'], 'section': sec['name']}
                    break
            if continue_file:
                break

        return Response({
            'overall_progress': overall_pct,
            'total_files':      total_files,
            'total_completed':  total_completed,
            'continue_learning': continue_file,
            'sections':         sections_data,
        })


# ── Phase 3: Certificate ──────────────────────────────────────────────────────

class CertificateView(APIView):
    """
    POST /api/progress/certificate/generate/
    Generates (or fetches existing) certificate for a user who has completed all lessons.
    Returns: { certificate_id, issued_at }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Verify 100% completion server-side
        all_files       = LearningFile.objects.count()
        completed_count = UserProgress.objects.filter(
            user=request.user, status='completed'
        ).count()

        if all_files == 0 or completed_count < all_files:
            return Response(
                {'detail': 'Complete all lessons to receive your certificate.'},
                status=403,
            )

        cert, _ = Certificate.objects.get_or_create(user=request.user)
        return Response({
            'certificate_id': str(cert.certificate_id),
            'issued_at':      cert.issued_at.isoformat(),
        })
