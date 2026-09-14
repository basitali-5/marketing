from rest_framework import serializers
from .models import ContentJob


class ContentJobSerializer(serializers.ModelSerializer):
    platform = serializers.CharField(read_only=True)
    scheduled_at = serializers.DateTimeField(allow_null=True, required=False)

    class Meta:
        model = ContentJob
        fields = [
            'id', 'title', 'description', 'content_kind', 'reference_text', 'headline', 'caption',
            'source_url', 'candidate_urls', 'selected_url', 'target_platforms', 'n8n_execution_id',
            'aspect_ratio', 'platform', 'status',
            'scheduled_at', 'workflow_response', 'error_message', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'status', 'platform', 'workflow_response', 'error_message', 'created_at', 'updated_at']

    def validate_aspect_ratio(self, value):
        if value not in {'16:9', '9:16', '1:1'}:
            raise serializers.ValidationError('Choose 16:9, 9:16, or 1:1.')
        return value

    def validate(self, attrs):
        if attrs.get('platform', 'instagram') != 'instagram':
            raise serializers.ValidationError({'platform': 'Instagram is the only connected platform right now.'})
        return attrs
