from django.db import models


class ContentJob(models.Model):
    KIND_CHOICES = [('image', 'Image'), ('video', 'Video')]
    STATUS_CHOICES = [
        ('processing', 'Processing'),
        ('ready', 'Ready'),
        ('scheduled', 'Scheduled'),
        ('published', 'Published'),
        ('failed', 'Failed'),
    ]

    title = models.CharField(max_length=180)
    description = models.TextField()
    content_kind = models.CharField(max_length=10, choices=KIND_CHOICES, default='video')
    reference_text = models.TextField(blank=True)
    headline = models.CharField(max_length=300, blank=True)
    caption = models.TextField(blank=True)
    source_url = models.URLField(blank=True)
    candidate_urls = models.JSONField(default=list, blank=True)
    selected_url = models.URLField(blank=True)
    target_platforms = models.JSONField(default=list, blank=True)
    n8n_execution_id = models.CharField(max_length=120, blank=True)
    aspect_ratio = models.CharField(max_length=8, default='16:9')
    platform = models.CharField(max_length=40, default='instagram')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='processing')
    scheduled_at = models.DateTimeField(null=True, blank=True)
    workflow_response = models.JSONField(default=dict, blank=True)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
