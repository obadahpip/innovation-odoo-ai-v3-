from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        # Replace 'XXXX' with the number of your last assessment migration
        ('assessment', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='LessonPlan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('chat_history', models.JSONField(blank=True, default=list)),
                ('lessons', models.JSONField(blank=True, default=list)),
                ('is_generated', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='lesson_plan',
                    to=settings.AUTH_USER_MODEL,
                )),
            ],
        ),
    ]
