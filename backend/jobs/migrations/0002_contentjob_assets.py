from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('jobs', '0001_initial')]
    operations = [
        migrations.AlterField(model_name='contentjob', name='status', field=models.CharField(choices=[('processing', 'Processing'), ('ready', 'Ready'), ('scheduled', 'Scheduled'), ('published', 'Published'), ('failed', 'Failed')], default='processing', max_length=20)),
        migrations.AddField(model_name='contentjob', name='candidate_urls', field=models.JSONField(blank=True, default=list)),
        migrations.AddField(model_name='contentjob', name='caption', field=models.TextField(blank=True)),
        migrations.AddField(model_name='contentjob', name='content_kind', field=models.CharField(choices=[('image', 'Image'), ('video', 'Video')], default='video', max_length=10)),
        migrations.AddField(model_name='contentjob', name='headline', field=models.CharField(blank=True, max_length=300)),
        migrations.AddField(model_name='contentjob', name='n8n_execution_id', field=models.CharField(blank=True, max_length=120)),
        migrations.AddField(model_name='contentjob', name='reference_text', field=models.TextField(blank=True)),
        migrations.AddField(model_name='contentjob', name='selected_url', field=models.URLField(blank=True)),
        migrations.AddField(model_name='contentjob', name='source_url', field=models.URLField(blank=True)),
        migrations.AddField(model_name='contentjob', name='target_platforms', field=models.JSONField(blank=True, default=list)),
    ]
