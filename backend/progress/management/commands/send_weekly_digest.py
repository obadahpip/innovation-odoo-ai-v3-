"""
management command: send_weekly_digest

Sends a weekly progress email to every verified, active user.

Usage:
    python manage.py send_weekly_digest           # send to all users
    python manage.py send_weekly_digest --dry-run  # print without sending
    python manage.py send_weekly_digest --email user@example.com  # single user

Schedule this with Windows Task Scheduler or cron to run every Monday at 9am:
    # Linux/Mac cron (every Monday 09:00):
    0 9 * * 1 cd /path/to/backend && python manage.py send_weekly_digest

    # Windows Task Scheduler:
    Program: python
    Arguments: manage.py send_weekly_digest
    Start in: C:\\path\\to\\backend
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta

from accounts.models import User
from progress.models import UserProgress
from content.models import LearningFile, LearningSection
from accounts.emails import send_weekly_digest_email


class Command(BaseCommand):
    help = 'Send weekly progress digest emails to all active users'

    def add_arguments(self, parser):
        parser.add_argument('--dry-run',  action='store_true', help='Print output without sending emails')
        parser.add_argument('--email',    type=str, default=None, help='Send only to this email address')

    def handle(self, *args, **options):
        dry_run    = options['dry_run']
        target     = options['email']
        one_week_ago = timezone.now() - timedelta(days=7)
        total_files  = LearningFile.objects.count()

        users = User.objects.filter(is_verified=True, is_active=True)
        if target:
            users = users.filter(email=target)

        sent  = 0
        skipped = 0

        for user in users:
            # Lessons completed in the last 7 days
            lessons_this_week = UserProgress.objects.filter(
                user=user,
                status='completed',
                completed_at__gte=one_week_ago,
            ).count()

            # Total completed ever
            total_completed = UserProgress.objects.filter(
                user=user, status='completed'
            ).count()

            # Sections currently in progress (has at least one lesson started but not all done)
            streak_sections = []
            for section in LearningSection.objects.all():
                section_files    = LearningFile.objects.filter(section=section)
                completed_in_sec = UserProgress.objects.filter(
                    user=user, file__in=section_files, status='completed'
                ).count()
                in_progress_in_sec = UserProgress.objects.filter(
                    user=user, file__in=section_files, status='in_progress'
                ).count()
                if in_progress_in_sec > 0 or (0 < completed_in_sec < section_files.count()):
                    streak_sections.append(f"Section {section.number}: {section.name} ({completed_in_sec}/{section_files.count()})")

            if dry_run:
                self.stdout.write(
                    f"[DRY RUN] Would email {user.email}: "
                    f"{lessons_this_week} lessons this week, "
                    f"{total_completed}/{total_files} total"
                )
                sent += 1
                continue

            try:
                send_weekly_digest_email(
                    to_email         = user.email,
                    first_name       = user.first_name,
                    lessons_this_week = lessons_this_week,
                    total_completed  = total_completed,
                    total_files      = total_files,
                    streak_sections  = streak_sections[:3],  # max 3 sections shown
                )
                sent += 1
                self.stdout.write(self.style.SUCCESS(f"  ✓ Sent to {user.email}"))
            except Exception as e:
                skipped += 1
                self.stdout.write(self.style.WARNING(f"  ✗ Failed for {user.email}: {e}"))

        self.stdout.write(
            self.style.SUCCESS(
                f"\nDone. Sent: {sent} | Failed: {skipped} | Total users: {users.count()}"
            )
        )
