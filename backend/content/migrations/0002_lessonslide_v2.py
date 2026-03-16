from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        # Replace 'XXXX' with the number of your last content migration
        ('content', '0001_initial'),
    ]

    operations = [
        # Add lesson_type field to LearningFile
        migrations.AddField(
            model_name='learningfile',
            name='lesson_type',
            field=models.CharField(
                choices=[('intro', 'Introduction'), ('lesson', 'Lesson')],
                default='lesson',
                max_length=10,
            ),
        ),

        # Create LessonSlide model
        migrations.CreateModel(
            name='LessonSlide',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slide_number', models.IntegerField(default=1)),
                ('title', models.CharField(max_length=255)),
                ('content', models.TextField()),
                ('is_intro', models.BooleanField(default=False)),
                ('is_conclusion', models.BooleanField(default=False)),
                ('file', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='slides',
                    to='content.learningfile',
                )),
            ],
            options={
                'ordering': ['file', 'slide_number'],
            },
        ),

        # Unique constraint: one slide_number per file
        migrations.AlterUniqueTogether(
            name='lessonslide',
            unique_together={('file', 'slide_number')},
        ),
    ]
