from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name='ContentJob',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=180)),
                ('description', models.TextField()),
                ('aspect_ratio', models.CharField(default='16:9', max_length=8)),
                ('platform', models.CharField(default='instagram', max_length=40)),
                ('status', models.CharField(choices=[('processing', 'Processing'), ('scheduled', 'Scheduled'), ('published', 'Published'), ('failed', 'Failed')], default='processing', max_length=20)),
                ('scheduled_at', models.DateTimeField(blank=True, null=True)),
                ('workflow_response', models.JSONField(blank=True, default=dict)),
                ('error_message', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={'ordering': ['-created_at']},
        ),
    ]
