from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='role',
            field=models.CharField(
                blank=True,
                choices=[
                    ('developer',  'Developer'),
                    ('accountant', 'Accountant'),
                    ('manager',    'Manager'),
                    ('student',    'Student'),
                    ('other',      'Other'),
                ],
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name='user',
            name='experience',
            field=models.CharField(
                blank=True,
                choices=[
                    ('none',     'None'),
                    ('some',     'Some'),
                    ('advanced', 'Advanced'),
                ],
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name='user',
            name='learning_goal',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='user',
            name='onboarding_done',
            field=models.BooleanField(default=False),
        ),
    ]
