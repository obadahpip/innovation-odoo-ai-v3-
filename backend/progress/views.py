from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from .models import UserProgress, Certificate
from content.models import LearningFile, LearningSection
from accounts.emails import send_section_complete_email, send_certificate_email


class ProgressUpdateView(APIView):
    """
    POST /api/progress/update/
    Body: { file_id, slide_index, completed? }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file_id       = request.data.get('file_id')
        slide_index   = request.data.get('slide_index', request.data.get('step_index', 0))
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

        if mark_complete and progress.status != 'completed':
            progress.status       = 'completed'
            progress.completed_at = timezone.now()
            progress.save()

            # ── Phase 7: check section completion ────────────────────────
            self._check_section_complete(request.user, file.section)
        else:
            progress.save()

        return Response({
            'status':           progress.status,
            'last_slide_index': progress.last_step_index,
        })

    def _check_section_complete(self, user, section):
        """Fire section-complete email if all lessons in the section are done."""
        section_files    = LearningFile.objects.filter(section=section)
        section_file_ids = set(section_files.values_list('id', flat=True))
        completed_ids    = set(
            UserProgress.objects.filter(
                user=user, file__in=section_files, status='completed'
            ).values_list('file_id', flat=True)
        )

        if section_file_ids != completed_ids:
            return   # section not yet fully complete

        # Avoid sending duplicate emails — check session cache key via DB flag
        # We use a simple approach: only send if this is the first time
        cache_attr = f'_section_{section.id}_email_sent'
        from django.core.cache import cache
        cache_key = f'section_complete_email_{user.id}_{section.id}'
        if cache.get(cache_key):
            return
        cache.set(cache_key, True, timeout=60 * 60 * 24 * 30)  # 30 days

        total_files     = LearningFile.objects.count()
        total_completed = UserProgress.objects.filter(user=user, status='completed').count()

        try:
            send_section_complete_email(
                to_email        = user.email,
                first_name      = user.first_name,
                section_number  = section.number,
                section_name    = section.name,
                total_completed = total_completed,
                total_files     = total_files,
            )
        except Exception:
            pass  # never crash the API due to email failure


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
                    'id':               f.id,
                    'title':            f.title,
                    'lesson_type':      f.lesson_type,
                    'status':           status,
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

        continue_file = None
        for sec in sections_data:
            for f in sec['files']:
                if f['status'] in ('in_progress', 'not_started'):
                    continue_file = {'file_id': f['id'], 'title': f['title'], 'section': sec['name']}
                    break
            if continue_file:
                break

        return Response({
            'overall_progress':  overall_pct,
            'total_files':       total_files,
            'total_completed':   total_completed,
            'continue_learning': continue_file,
            'sections':          sections_data,
        })


# ── Certificate ───────────────────────────────────────────────────────────────

class CertificateView(APIView):
    """
    POST /api/progress/certificate/generate/
    Generates (or fetches existing) certificate for a user who completed all lessons.
    Phase 7: sends certificate email on first generation.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        all_files       = LearningFile.objects.count()
        completed_count = UserProgress.objects.filter(
            user=request.user, status='completed'
        ).count()

        if all_files == 0 or completed_count < all_files:
            return Response(
                {'detail': 'Complete all lessons to receive your certificate.'},
                status=403,
            )

        created = False
        cert, created = Certificate.objects.get_or_create(user=request.user)

        # ── Phase 7: send certificate email on first generation ───────────
        if created:
            try:
                issued_date = cert.issued_at.strftime('%B %d, %Y')
                send_certificate_email(
                    to_email       = request.user.email,
                    first_name     = request.user.first_name,
                    certificate_id = cert.certificate_id,
                    issued_date    = issued_date,
                )
            except Exception:
                pass  # never crash the API due to email failure

        return Response({
            'certificate_id': str(cert.certificate_id),
            'issued_at':      cert.issued_at.isoformat(),
        })
