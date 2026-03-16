"""
V2 RST Parser & Bulk Import
Usage:
    python manage.py import_rst --docs-path "C:/path/to/odoo-docs"
    python manage.py import_rst --docs-path "C:/path/to/odoo-docs" --section 2
    python manage.py import_rst --docs-path "C:/path/to/odoo-docs" --reset

Changes from V1:
  - Reads lesson_type from section_mapping.json (intro | lesson)
  - Sets LearningFile.lesson_type accordingly
  - Intro RST files live in odoo-docs/content/intro/
  - file_order now starts at 0 for intro lessons
  - --reset flag wipes and re-imports cleanly
"""

import json
import os

from django.core.management.base import BaseCommand, CommandError
from docutils.core import publish_parts

from content.models import LearningSection, LearningFile

MAPPING_PATH = os.path.join(
    os.path.dirname(__file__), '..', '..', '..', '..', 'section_mapping.json'
)


class Command(BaseCommand):
    help = 'Import RST files into LearningSection and LearningFile records (V2)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--docs-path',
            required=True,
            help='Absolute path to the odoo-docs root folder',
        )
        parser.add_argument(
            '--section',
            type=int,
            default=None,
            help='Only import a specific section number',
        )
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Delete all existing sections and files before importing',
        )

    def handle(self, *args, **options):
        docs_path = options['docs_path']
        target_section = options['section']

        if not os.path.isdir(docs_path):
            raise CommandError(f"docs-path does not exist: {docs_path}")

        # Load section mapping
        mapping_file = os.path.normpath(MAPPING_PATH)
        if not os.path.isfile(mapping_file):
            # Fallback: look next to manage.py
            mapping_file = os.path.join(docs_path, '..', 'section_mapping.json')
            mapping_file = os.path.normpath(mapping_file)

        if not os.path.isfile(mapping_file):
            raise CommandError(
                f"section_mapping.json not found. Tried: {mapping_file}"
            )

        with open(mapping_file, 'r', encoding='utf-8') as f:
            mapping = json.load(f)

        if options['reset']:
            self.stdout.write(self.style.WARNING("Resetting all sections and files..."))
            LearningFile.objects.all().delete()
            LearningSection.objects.all().delete()
            self.stdout.write("  Cleared.")

        total_sections = 0
        total_files = 0
        total_skipped = 0

        for sec_data in mapping:
            sec_num = sec_data['section_number']

            if target_section and sec_num != target_section:
                continue

            # Upsert section
            section, created = LearningSection.objects.update_or_create(
                number=sec_num,
                defaults={
                    'name': sec_data['section_name'],
                    'description': sec_data.get('description', ''),
                    'estimated_hours': sec_data.get('estimated_hours', 0),
                }
            )
            action = 'Created' if created else 'Updated'
            self.stdout.write(f"\n{action} section {sec_num}: {section.name}")
            total_sections += 1

            for file_entry in sec_data.get('files', []):
                rel_path = file_entry['path']
                title = file_entry['title']
                order = file_entry['order']
                lesson_type = file_entry.get('lesson_type', 'lesson')

                abs_path = os.path.join(docs_path, rel_path)
                abs_path = os.path.normpath(abs_path)

                if not os.path.isfile(abs_path):
                    self.stdout.write(
                        self.style.WARNING(f"  SKIP (not found): {rel_path}")
                    )
                    total_skipped += 1
                    continue

                # Parse RST → HTML
                with open(abs_path, 'r', encoding='utf-8', errors='replace') as f:
                    rst_content = f.read()

                try:
                    parts = publish_parts(
                        source=rst_content,
                        writer_name='html',
                        settings_overrides={'report_level': 5, 'halt_level': 5},
                    )
                    html_content = parts.get('body', '')
                except Exception as e:
                    self.stdout.write(
                        self.style.WARNING(f"  RST parse error for {title}: {e}")
                    )
                    html_content = ''

                # Upsert file record
                obj, created = LearningFile.objects.update_or_create(
                    section=section,
                    file_order=order,
                    defaults={
                        'title': title,
                        'rst_content': rst_content,
                        'html_content': html_content,
                        'lesson_type': lesson_type,
                    }
                )
                flag = '✓ NEW' if created else '↻ UPD'
                type_tag = f'[{lesson_type}]' if lesson_type == 'intro' else ''
                self.stdout.write(
                    f"  {flag} {type_tag} [{order:02d}] {title}"
                )
                total_files += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"\n{'─'*50}\n"
                f"Done. {total_sections} section(s), {total_files} file(s) imported, "
                f"{total_skipped} skipped (file not found).\n"
                f"Total lessons in DB: {LearningFile.objects.count()}"
            )
        )
