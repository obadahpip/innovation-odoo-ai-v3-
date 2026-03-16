"""
management command: generate_slides

Usage:
    python manage.py generate_slides                  # all lessons
    python manage.py generate_slides --file-id 5      # one lesson
    python manage.py generate_slides --section 2      # entire section
    python manage.py generate_slides --overwrite      # regenerate existing

Generates LessonSlide records for each LearningFile using GPT-4o.
Structure enforced:
  - Slide 1:  Introduction (is_intro=True)  — what will be learned
  - Slides 2–N-1: Content slides from RST source
  - Slide N:  Conclusion (is_conclusion=True) — key takeaways summary
"""

import json
import time
from django.core.management.base import BaseCommand
from django.conf import settings
from openai import OpenAI

from content.models import LearningFile, LessonSlide

client = OpenAI(api_key=settings.OPENAI_API_KEY)

SLIDE_SYSTEM_PROMPT = """You are an expert Odoo educator. Your job is to convert raw Odoo documentation \
into a structured slide-based lesson for the Innovation Odoo AI learning platform.

Rules:
1. Output ONLY valid JSON — no markdown fences, no extra text.
2. Create between 6 and 10 slides total.
3. Slide 1 MUST be an introduction: title "What you'll learn", content lists the 3-5 key things \
   the learner will understand after this lesson. Mark is_intro: true.
4. Slides 2 through N-1 are content slides. Each covers one clear concept from the RST source. \
   Keep content concise (80-150 words per slide). Use plain language — avoid heavy jargon.
5. Slide N (last) MUST be a conclusion: title "Key takeaways", content summarises the most \
   important points as 3-5 bullet points (use "• " prefix). Mark is_conclusion: true.
6. All other slides have is_intro: false and is_conclusion: false.

Output format (JSON array):
[
  {
    "slide_number": 1,
    "title": "What you'll learn",
    "content": "In this lesson you will learn:\\n• ...",
    "is_intro": true,
    "is_conclusion": false
  },
  {
    "slide_number": 2,
    "title": "...",
    "content": "...",
    "is_intro": false,
    "is_conclusion": false
  },
  ...
  {
    "slide_number": N,
    "title": "Key takeaways",
    "content": "• ...\\n• ...\\n• ...",
    "is_intro": false,
    "is_conclusion": true
  }
]"""


class Command(BaseCommand):
    help = 'Generate V2 slide-based lesson content for LearningFile records'

    def add_arguments(self, parser):
        parser.add_argument('--file-id', type=int, help='Generate slides for a single file ID')
        parser.add_argument('--section', type=int, help='Generate slides for all files in a section number')
        parser.add_argument('--overwrite', action='store_true', help='Overwrite existing slides')

    def handle(self, *args, **options):
        qs = LearningFile.objects.select_related('section').all()

        if options['file_id']:
            qs = qs.filter(id=options['file_id'])
        elif options['section']:
            qs = qs.filter(section__number=options['section'])

        total = qs.count()
        self.stdout.write(f"Processing {total} lesson(s)...")

        success = 0
        failed = 0

        for i, file in enumerate(qs, 1):
            existing_count = file.slides.count()

            if existing_count > 0 and not options['overwrite']:
                self.stdout.write(
                    f"  [{i}/{total}] SKIP {file.title} (already has {existing_count} slides)"
                )
                continue

            self.stdout.write(f"  [{i}/{total}] Generating: {file.title}...")

            try:
                slides_data = self._generate_slides(file)
                self._save_slides(file, slides_data, overwrite=options['overwrite'])
                self.stdout.write(
                    self.style.SUCCESS(f"    ✓ {len(slides_data)} slides saved")
                )
                success += 1
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"    ✗ Failed: {e}")
                )
                failed += 1

            # Rate limit safety: 0.5s pause between calls
            if i < total:
                time.sleep(0.5)

        self.stdout.write(
            self.style.SUCCESS(
                f"\nDone. {success} succeeded, {failed} failed out of {total} total."
            )
        )

    def _generate_slides(self, file: LearningFile) -> list:
        """Call GPT-4o and return parsed slide list."""
        # Truncate RST content to avoid token overflow (~6000 chars)
        rst_content = (file.rst_content or '')[:6000]
        if not rst_content.strip():
            rst_content = f"Topic: {file.title} (from section: {file.section.name})"

        user_prompt = f"""Convert the following Odoo documentation into lesson slides.

Lesson title: {file.title}
Section: {file.section.name}
Section description: {file.section.description}

Documentation content:
{rst_content}

Remember: output ONLY the JSON array. No preamble, no markdown fences."""

        response = client.chat.completions.create(
            model='gpt-4o',
            messages=[
                {'role': 'system', 'content': SLIDE_SYSTEM_PROMPT},
                {'role': 'user', 'content': user_prompt},
            ],
            max_tokens=2000,
            temperature=0.4,
        )

        raw = response.choices[0].message.content.strip()

        # Strip markdown fences if model adds them anyway
        if raw.startswith('```'):
            raw = raw.split('\n', 1)[1]
            raw = raw.rsplit('```', 1)[0]

        slides_data = json.loads(raw)

        if not isinstance(slides_data, list) or len(slides_data) < 3:
            raise ValueError(f"Invalid slide data: expected list of >=3, got {type(slides_data)}")

        return slides_data

    def _save_slides(self, file: LearningFile, slides_data: list, overwrite: bool):
        """Delete existing slides if overwrite, then bulk-create new ones."""
        if overwrite:
            file.slides.all().delete()

        slides_to_create = []
        for s in slides_data:
            slides_to_create.append(LessonSlide(
                file=file,
                slide_number=s['slide_number'],
                title=s.get('title', f"Slide {s['slide_number']}"),
                content=s.get('content', ''),
                is_intro=s.get('is_intro', False),
                is_conclusion=s.get('is_conclusion', False),
            ))

        LessonSlide.objects.bulk_create(slides_to_create)
