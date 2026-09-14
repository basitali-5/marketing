from django.contrib import admin
from .models import ContentJob


@admin.register(ContentJob)
class ContentJobAdmin(admin.ModelAdmin):
    list_display = ('title', 'platform', 'status', 'scheduled_at', 'created_at')
    list_filter = ('status', 'platform')
    search_fields = ('title', 'description')
