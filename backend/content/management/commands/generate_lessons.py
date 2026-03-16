"""
AI Lesson Step & Quiz Generation Script
Place this file at: backend/content/management/commands/generate_lessons.py

Run with:
  python manage.py generate_lessons              # Process all 81 files
  python manage.py generate_lessons --limit 5    # Test with first 5 files only
  python manage.py generate_lessons --file-id 3  # Process a single file by ID
"""

import json
import time

from django.core.management.base import BaseCommand
from decouple import config
from openai import OpenAI

from content.models import LearningFile, LessonStep, QuizQuestion

client = OpenAI(api_key=config('OPENAI_API_KEY'))

# -------------------------------------------------------------------
# SYSTEM PROMPT — Lesson Step Generation
# -------------------------------------------------------------------
STEP_SYSTEM_PROMPT = """
You are an Odoo training content designer. Your job is to read Odoo documentation and convert it into a structured, step-by-step interactive lesson that a learner will follow inside a simulated Odoo interface.

Given the documentation content, output a JSON array of lesson steps. Each step must have these exact fields:

- "step_order": integer starting from 1
- "instruction_text": string — clear, friendly instruction for the learner (1-3 sentences). Write as if talking directly to them: "Click the Create button to start a new invoice."
- "odoo_screen_target": string — the Odoo screen/module this step happens on. Use one of: "home", "invoicing", "sales", "crm", "inventory", "employees", "leave_requests", "website_builder", "email_marketing", "purchase", "manufacturing", "payroll", "recruitment", "project", "helpdesk", "discuss", "calendar", "settings"
- "action_type": string — one of: "click", "observe", "type", "navigate"
- "highlight_selector": use ONLY one of these sim-friendly selectors:
  Navigation: "app-expenses", "app-invoicing", "app-sales", "app-crm", "app-inventory", "app-employees", "app-leaves", "app-website", "app-email"
  Buttons: "new-button", "save-button", "confirm-button", "submit-button", "approve-button", "cancel-button", "send-button", "create-button"
  Forms: "field-name", "field-amount", "field-date", "field-customer", "field-product", "field-description", "field-type"
  Lists: "list-row", "kanban-card", "status-bar"
  Leave empty string "" if no specific element needs highlighting.
  
Rules:
- Generate between 5 and 12 steps per file
- Mix action types: not all steps should be "observe"
- Steps should flow logically, like a guided tour
- Keep instructions simple and friendly
- Focus on the MOST IMPORTANT concepts from the documentation
- Do NOT include steps about installation or server setup
- Output ONLY the JSON array, no other text, no markdown backticks
"""

# -------------------------------------------------------------------
# SYSTEM PROMPT — Quiz Question Generation
# -------------------------------------------------------------------
QUIZ_SYSTEM_PROMPT = """
You are an Odoo training quiz designer. Your job is to create exactly 3 multiple-choice quiz questions based on Odoo documentation content.

Output a JSON array of exactly 3 quiz question objects. Each object must have:

- "question_text": string — a clear question about the documented feature
- "options": array of exactly 4 strings — the answer choices (A, B, C, D options without the letters)
- "correct_answer": string — must exactly match one of the options strings
- "explanation": string — 1-2 sentences explaining why the correct answer is right

Rules:
- Questions must be based on facts from the documentation
- Make distractors (wrong answers) plausible but clearly wrong to someone who read the content
- Do NOT ask about trivial things like button colors
- Focus on concepts, workflows, and key features
- Output ONLY the JSON array, no other text, no markdown backticks
"""


def call_gpt(system_prompt, user_content, file_title, attempt=1):
    """Call GPT-4o and return parsed JSON. Retries once on failure."""
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            max_tokens=2000,
            temperature=0.3,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_content},
            ]
        )
        raw = response.choices[0].message.content.strip()
        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        return json.loads(raw.strip())
    except json.JSONDecodeError as e:
        if attempt < 2:
            time.sleep(2)
            return call_gpt(system_prompt, user_content, file_title, attempt=2)
        raise ValueError(f"JSON parse failed for '{file_title}': {e}")
    except Exception as e:
        if attempt < 2:
            time.sleep(5)
            return call_gpt(system_prompt, user_content, file_title, attempt=2)
        raise


def truncate_content(rst_content, max_chars=6000):
    """Truncate RST content to avoid exceeding token limits."""
    if len(rst_content) <= max_chars:
        return rst_content
    # Take first 6000 chars — the intro and main concepts are usually at the top
    return rst_content[:max_chars] + "\n\n[Content truncated for processing]"


class Command(BaseCommand):
    help = 'Generate AI lesson steps and quiz questions for all LearningFile records'

    def add_arguments(self, parser):
        parser.add_argument(
            '--limit',
            type=int,
            default=None,
            help='Only process the first N files (useful for testing)',
        )
        parser.add_argument(
            '--file-id',
            type=int,
            default=None,
            help='Process a single LearningFile by its database ID',
        )
        parser.add_argument(
            '--skip-existing',
            action='store_true',
            default=True,
            help='Skip files that already have steps generated (default: True)',
        )
        parser.add_argument(
            '--overwrite',
            action='store_true',
            help='Overwrite existing steps and quiz questions',
        )

    def handle(self, *args, **options):
        # Select files to process
        if options['file_id']:
            files = LearningFile.objects.filter(id=options['file_id'])
        else:
            files = LearningFile.objects.all().order_by('section__number', 'file_order')
            if options['limit']:
                files = files[:options['limit']]

        total = files.count()
        self.stdout.write(f'Processing {total} files...\n')

        success_count = 0
        fail_count = 0
        skip_count = 0

        for i, learning_file in enumerate(files, 1):
            label = f"[{i}/{total}] {learning_file.section.number}.{learning_file.file_order} {learning_file.title}"

            # Skip if already has steps and not overwriting
            if not options['overwrite'] and learning_file.steps.exists():
                self.stdout.write(f'  ⏭ SKIP {label}')
                skip_count += 1
                continue

            self.stdout.write(f'  ⚙ Processing: {label}')

            try:
                content = truncate_content(learning_file.rst_content)

                if not content.strip():
                    self.stdout.write(self.style.WARNING(f'    ⚠ Empty content, skipping'))
                    skip_count += 1
                    continue

                user_message = f"Documentation title: {learning_file.title}\n\nContent:\n{content}"

                # --- Generate lesson steps ---
                steps_data = call_gpt(STEP_SYSTEM_PROMPT, user_message, learning_file.title)

                if not isinstance(steps_data, list) or len(steps_data) < 3:
                    raise ValueError(f"Expected list of steps, got: {type(steps_data)}, length: {len(steps_data) if isinstance(steps_data, list) else 'N/A'}")

                # Clear existing steps if overwriting
                if options['overwrite']:
                    learning_file.steps.all().delete()

                # Save steps
                for step in steps_data:
                    LessonStep.objects.create(
                        file=learning_file,
                        step_order=step.get('step_order', 0),
                        instruction_text=step.get('instruction_text', ''),
                        odoo_screen_target=step.get('odoo_screen_target', 'home'),
                        action_type=step.get('action_type', 'observe'),
                        highlight_selector=step.get('highlight_selector', ''),
                    )

                self.stdout.write(f'    ✓ {len(steps_data)} steps saved')

                # Rate limit pause between step and quiz calls
                time.sleep(1)

                # --- Generate quiz questions ---
                quiz_data = call_gpt(QUIZ_SYSTEM_PROMPT, user_message, learning_file.title)

                if not isinstance(quiz_data, list):
                    raise ValueError(f"Expected list of quiz questions, got: {type(quiz_data)}")

                # Clear existing quiz if overwriting
                if options['overwrite']:
                    learning_file.quiz_questions.all().delete()

                # Save quiz questions
                for q in quiz_data[:3]:  # Max 3 questions
                    QuizQuestion.objects.create(
                        file=learning_file,
                        question_text=q.get('question_text', ''),
                        options=q.get('options', []),
                        correct_answer=q.get('correct_answer', ''),
                        explanation=q.get('explanation', ''),
                    )

                self.stdout.write(f'    ✓ {len(quiz_data[:3])} quiz questions saved')
                success_count += 1

                # Rate limit: ~1 request per second to stay within 60 RPM
                time.sleep(1.5)

            except Exception as e:
                self.stdout.write(self.style.ERROR(f'    ✗ FAILED: {e}'))
                fail_count += 1
                # Longer pause after failure
                time.sleep(5)

        # Summary
        self.stdout.write('\n' + '=' * 50)
        self.stdout.write(self.style.SUCCESS(f'✅ Done: {success_count} succeeded'))
        if skip_count:
            self.stdout.write(f'⏭  Skipped: {skip_count}')
        if fail_count:
            self.stdout.write(self.style.ERROR(f'✗  Failed: {fail_count}'))
        if fail_count:
            self.stdout.write('Re-run with --overwrite to retry failed files only')