"""
AI Task Generation Command — V3
================================
Automatically generates odoo_path and odoo_task (with step-by-step guide)
for every non-intro LearningFile, using the lesson's slide content as input.

Usage:
    python manage.py generate_odoo_tasks                  # all lessons
    python manage.py generate_odoo_tasks --file-id 5      # single lesson
    python manage.py generate_odoo_tasks --section 2      # entire section
    python manage.py generate_odoo_tasks --overwrite      # regenerate existing
    python manage.py generate_odoo_tasks --limit 5        # first 5 (testing)
"""

import json
import time

from django.core.management.base import BaseCommand
from django.conf import settings
from openai import OpenAI

from content.models import LearningFile

client = OpenAI(api_key=settings.OPENAI_API_KEY)

# ── Odoo path map ─────────────────────────────────────────────────────────────
# Maps keywords found in lesson titles / section names to Odoo URL paths.
# The AI will also suggest a path, but this is used as a fallback/override.
ODOO_PATH_MAP = [
    # keyword (lowercase)          path
    ('crm',                         '/odoo/crm'),
    ('lead',                        '/odoo/crm'),
    ('pipeline',                    '/odoo/crm'),
    ('contact',                     '/odoo/contacts'),
    ('activities',                  '/odoo/crm'),
    ('calendar',                    '/odoo/calendar'),
    ('discuss',                     '/odoo/discuss'),
    ('messaging',                   '/odoo/discuss'),
    ('invoice',                     '/odoo/accounting'),
    ('accounting',                  '/odoo/accounting'),
    ('expense',                     '/odoo/expenses'),
    ('payment',                     '/odoo/accounting'),
    ('fiscal',                      '/odoo/accounting'),
    ('esg',                         '/odoo/accounting'),
    ('sales order',                 '/odoo/sales'),
    ('sales',                       '/odoo/sales'),
    ('quotation',                   '/odoo/sales'),
    ('inventory',                   '/odoo/inventory'),
    ('warehouse',                   '/odoo/inventory'),
    ('stock',                       '/odoo/inventory'),
    ('purchase',                    '/odoo/purchase'),
    ('manufacturing',               '/odoo/manufacturing'),
    ('mrp',                         '/odoo/manufacturing'),
    ('barcode',                     '/odoo/inventory'),
    ('quality',                     '/odoo/manufacturing'),
    ('maintenance',                 '/odoo/maintenance'),
    ('repair',                      '/odoo/repairs'),
    ('plm',                         '/odoo/plm'),
    ('employee',                    '/odoo/employees'),
    ('payroll',                     '/odoo/payroll'),
    ('time off',                    '/odoo/time-off'),
    ('leave',                       '/odoo/time-off'),
    ('recruitment',                 '/odoo/recruitment'),
    ('appraisal',                   '/odoo/appraisals'),
    ('attendance',                  '/odoo/attendances'),
    ('referral',                    '/odoo/referrals'),
    ('fleet',                       '/odoo/fleet'),
    ('lunch',                       '/odoo/lunch'),
    ('email marketing',             '/odoo/mass-mailing'),
    ('sms',                         '/odoo/mass-mailing'),
    ('social',                      '/odoo/social-marketing'),
    ('marketing automation',        '/odoo/marketing-automation'),
    ('event',                       '/odoo/events'),
    ('survey',                      '/odoo/surveys'),
    ('project',                     '/odoo/project'),
    ('timesheet',                   '/odoo/timesheets'),
    ('helpdesk',                    '/odoo/helpdesk'),
    ('field service',               '/odoo/field-service'),
    ('planning',                    '/odoo/planning'),
    ('website',                     '/odoo/website'),
    ('ecommerce',                   '/odoo/website'),
    ('point of sale',               '/odoo/point-of-sale'),
    ('pos',                         '/odoo/point-of-sale'),
    ('search',                      '/odoo/crm'),        # search & filters → use CRM as demo
    ('reporting',                   '/odoo/accounting'), # reporting → use accounting
    ('export',                      '/odoo/contacts'),   # export/import → use contacts
    ('import',                      '/odoo/contacts'),
    ('studio',                      '/odoo/settings'),
    ('setting',                     '/odoo/settings'),
    ('user',                        '/odoo/settings'),
    ('compan',                      '/odoo/settings'),
    ('apps',                        '/odoo/settings'),
    ('developer',                   '/odoo/settings'),
    ('iot',                         '/odoo/settings'),
    ('integration',                 '/odoo/settings'),
    ('keyboard',                    '/odoo/settings'),
    ('html editor',                 '/odoo/website'),
    ('property',                    '/odoo/crm'),
    ('stage',                       '/odoo/crm'),
    ('in-app purchase',             '/odoo/settings'),
    ('sign',                        '/odoo/sign'),
    ('knowledge',                   '/odoo/knowledge'),
    ('spreadsheet',                 '/odoo/spreadsheet'),
    ('document',                    '/odoo/documents'),
    ('discuss',                     '/odoo/discuss'),
]

# ── System prompt ─────────────────────────────────────────────────────────────
SYSTEM_PROMPT = """You are an expert Odoo trainer creating practical hands-on tasks for students.

Given a lesson title, section name, and the lesson's slide content, you must generate:

1. odoo_path — the Odoo URL path where this task is performed (e.g. /odoo/crm, /odoo/contacts)
2. task_summary — a 1-2 sentence overview of what the student will do
3. steps — a numbered list of 4-8 clear, specific steps the student must follow in Odoo

Rules:
- Steps must be concrete and actionable (e.g. "Click the New button in the top left")
- Steps must match what's actually possible in standard Odoo 17 Community/Enterprise
- Use simple language — assume the student is seeing Odoo for the first time
- The task should directly reinforce what was taught in the slides
- Do NOT include steps about installation, configuration, or admin setup
- Each step should be 1-2 sentences max

Output ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "odoo_path": "/odoo/crm",
  "task_summary": "Create a new lead in the CRM pipeline and schedule a follow-up activity.",
  "steps": [
    "Open the CRM module by clicking on it from the main menu.",
    "Click the New button in the top-left corner to create a new lead.",
    "Fill in the Lead Name field with a sample customer name.",
    "Set the Expected Revenue field to any amount.",
    "Click the Activities button (clock icon) and schedule a Phone Call activity for tomorrow.",
    "Click Save manually or let Odoo auto-save, then verify your lead appears in the Kanban view."
  ]
}"""


def guess_path_from_title(title: str, section: str) -> str:
    """Fallback: guess odoo_path from lesson title keywords."""
    text = (title + ' ' + section).lower()
    for keyword, path in ODOO_PATH_MAP:
        if keyword in text:
            return path
    return '/odoo/crm'  # default fallback


class Command(BaseCommand):
    help = 'Auto-generate odoo_path and odoo_task for all lessons using GPT-4o'

    def add_arguments(self, parser):
        parser.add_argument('--file-id',  type=int, help='Process a single lesson by ID')
        parser.add_argument('--section',  type=int, help='Process all lessons in a section number')
        parser.add_argument('--limit',    type=int, help='Process only the first N lessons (for testing)')
        parser.add_argument('--overwrite', action='store_true',
                            help='Regenerate even if odoo_task already exists')

    def handle(self, *args, **options):
        # ── Build queryset ────────────────────────────────────────────────
        qs = LearningFile.objects.select_related('section').filter(
            lesson_type='lesson'   # skip intro lessons — they get no task
        ).order_by('section__number', 'file_order')

        if options['file_id']:
            qs = qs.filter(id=options['file_id'])
        elif options['section']:
            qs = qs.filter(section__number=options['section'])

        if options['limit']:
            qs = qs[:options['limit']]

        total   = qs.count()
        success = 0
        skipped = 0
        failed  = 0

        self.stdout.write(f"\n🤖 Generating Odoo tasks for {total} lesson(s)...\n")

        for i, lesson in enumerate(qs, 1):
            # Skip if already populated (unless --overwrite)
            if lesson.odoo_task and not options['overwrite']:
                self.stdout.write(
                    f"  [{i}/{total}] SKIP  {lesson.title} (already has task)"
                )
                skipped += 1
                continue

            self.stdout.write(f"  [{i}/{total}] Generating: {lesson.title}...")

            try:
                result = self._generate_task(lesson)

                lesson.odoo_path = result['odoo_path']
                lesson.odoo_task = self._format_task(result)
                lesson.save(update_fields=['odoo_path', 'odoo_task'])

                self.stdout.write(
                    self.style.SUCCESS(
                        f"    ✓  path={result['odoo_path']}  "
                        f"steps={len(result['steps'])}"
                    )
                )
                success += 1

            except Exception as e:
                # Fallback: save a basic path at least so the iframe opens somewhere
                fallback_path = guess_path_from_title(lesson.title, lesson.section.name)
                lesson.odoo_path = fallback_path
                lesson.save(update_fields=['odoo_path'])
                self.stdout.write(
                    self.style.ERROR(f"    ✗  Failed ({e}) — saved fallback path {fallback_path}")
                )
                failed += 1

            # Rate-limit: 0.5s between calls to avoid hitting OpenAI limits
            if i < total:
                time.sleep(0.5)

        # ── Summary ───────────────────────────────────────────────────────
        self.stdout.write('\n' + '─' * 50)
        self.stdout.write(
            self.style.SUCCESS(
                f"Done.  ✓ {success} generated  "
                f"⟳ {skipped} skipped  "
                f"✗ {failed} failed  "
                f"(total: {total})"
            )
        )

    # ── Helpers ───────────────────────────────────────────────────────────────

    def _generate_task(self, lesson: LearningFile) -> dict:
        """Call GPT-4o and return parsed task dict."""

        # Build slide content summary (truncated to keep token count low)
        slides = lesson.slides.order_by('slide_number')
        slide_text = '\n\n'.join([
            f"Slide {s.slide_number}: {s.title}\n{s.content[:400]}"
            for s in slides
        ])[:5000]  # max ~5000 chars

        if not slide_text.strip():
            slide_text = f"(No slides available — use lesson title: {lesson.title})"

        user_prompt = (
            f"Lesson title: {lesson.title}\n"
            f"Section: {lesson.section.name}\n"
            f"Section description: {lesson.section.description}\n\n"
            f"Slide content:\n{slide_text}"
        )

        response = client.chat.completions.create(
            model='gpt-4o',
            messages=[
                {'role': 'system', 'content': SYSTEM_PROMPT},
                {'role': 'user',   'content': user_prompt},
            ],
            max_tokens=600,
            temperature=0.4,
        )

        raw = response.choices[0].message.content.strip()

        # Strip markdown fences if model adds them anyway
        if raw.startswith('```'):
            raw = raw.split('\n', 1)[1]
            raw = raw.rsplit('```', 1)[0].strip()

        data = json.loads(raw)

        # Validate
        if 'odoo_path' not in data or 'steps' not in data:
            raise ValueError(f"Missing required keys in response: {data.keys()}")
        if not isinstance(data['steps'], list) or len(data['steps']) < 2:
            raise ValueError(f"Expected at least 2 steps, got: {data['steps']}")

        return data

    def _format_task(self, result: dict) -> str:
        """Format the task dict into a clean string stored in odoo_task field."""
        lines = []

        summary = result.get('task_summary', '').strip()
        if summary:
            lines.append(summary)
            lines.append('')

        steps = result.get('steps', [])
        if steps:
            lines.append('Steps:')
            for idx, step in enumerate(steps, 1):
                lines.append(f"{idx}. {step.strip()}")

        return '\n'.join(lines)