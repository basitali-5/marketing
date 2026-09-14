import json

from django.db.models import Count
from django.http import JsonResponse
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import ContentJob
from .serializers import ContentJobSerializer
from .services import dispatch_to_n8n, extract_urls, generate_image, generate_post_options, publish_content


def parse_json_field(value, fallback):
    if isinstance(value, (list, dict)):
        return value
    if not isinstance(value, str) or not value.strip():
        return fallback
    try:
        return json.loads(value)
    except json.JSONDecodeError:
        return fallback


@api_view(['GET'])
def health(request):
    return JsonResponse({'status': 'ok', 'service': 'clipflow-api'})


@api_view(['GET', 'POST'])
def jobs(request):
    if request.method == 'GET':
        return Response(ContentJobSerializer(ContentJob.objects.all()[:50], many=True).data)

    serializer = ContentJobSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    job = serializer.save(platform='instagram')
    is_scheduled = job.scheduled_at and job.scheduled_at > timezone.now()

    if is_scheduled:
        job.status = 'scheduled'
        job.save(update_fields=['status', 'updated_at'])
        return Response(ContentJobSerializer(job).data, status=status.HTTP_201_CREATED)

    try:
        job.workflow_response = dispatch_to_n8n(job)
        job.status = 'processing'
        job.save(update_fields=['workflow_response', 'status', 'updated_at'])
    except Exception as exc:
        job.status = 'failed'
        job.error_message = str(exc)
        job.save(update_fields=['status', 'error_message', 'updated_at'])
        return Response(ContentJobSerializer(job).data, status=status.HTTP_502_BAD_GATEWAY)

    return Response(ContentJobSerializer(job).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def job_detail(request, pk):
    try:
        job = ContentJob.objects.get(pk=pk)
    except ContentJob.DoesNotExist:
        return Response({'detail': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)
    return Response(ContentJobSerializer(job).data)


@api_view(['GET'])
def stats(request):
    counts = ContentJob.objects.values('status').annotate(total=Count('id'))
    return Response({item['status']: item['total'] for item in counts})


@api_view(['POST'])
def image_options(request):
    reference_text = request.data.get('reference_text', '').strip()
    if not reference_text:
        return Response({'detail': 'reference_text is required.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        body = generate_post_options(reference_text)
        options = body if isinstance(body, list) else body.get('options') or body.get('output') or []
        if isinstance(options, str):
            options = [options]
        return Response({'options': options, 'workflow_response': body})
    except Exception as exc:
        return Response({'detail': str(exc)}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(['POST'])
def images(request):
    prompt = request.data.get('prompt', '').strip()
    if not prompt:
        return Response({'detail': 'prompt is required.'}, status=status.HTTP_400_BAD_REQUEST)
    job = ContentJob.objects.create(
        title=request.data.get('title', prompt[:180]),
        description=prompt,
        content_kind='image',
        headline=request.data.get('post_text', prompt),
        reference_text=request.data.get('reference_text', ''),
        aspect_ratio=request.data.get('aspect_ratio') or request.data.get('aspectRatio') or '16:9',
    )
    try:
        body = generate_image(job)
        urls = extract_urls(body)
        if not urls:
            urls = ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80']
        job.candidate_urls = urls
        job.status = 'ready'
        job.workflow_response = body
        job.save(update_fields=['candidate_urls', 'status', 'workflow_response', 'updated_at'])
        return Response({'job': ContentJobSerializer(job).data, 'image_urls': urls}, status=status.HTTP_201_CREATED)
    except Exception as exc:
        fallback_url = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'
        job.candidate_urls = [fallback_url]
        job.status = 'ready'
        job.error_message = str(exc)
        job.workflow_response = {'fallback': True, 'error': str(exc)}
        job.save(update_fields=['candidate_urls', 'status', 'error_message', 'workflow_response', 'updated_at'])
        return Response({'job': ContentJobSerializer(job).data, 'image_urls': job.candidate_urls}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def image_callback(request):
    return callback(request, 'image')


@api_view(['POST'])
def videos(request):
    prompt = request.data.get('prompt', '').strip()
    if not prompt:
        return Response({'detail': 'prompt is required.'}, status=status.HTTP_400_BAD_REQUEST)
    job = ContentJob.objects.create(
        title=prompt[:180],
        description=prompt,
        content_kind='video',
        reference_text=request.data.get('reference_text', ''),
        aspect_ratio=request.data.get('aspect_ratio') or request.data.get('aspectRatio') or '16:9',
    )
    try:
        body = dispatch_to_n8n(job)
        urls = extract_urls(body, '.mp4')
        if not urls:
            urls = ['https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4']
        job.candidate_urls = urls
        job.status = 'ready'
        job.workflow_response = body
        job.save(update_fields=['candidate_urls', 'status', 'workflow_response', 'updated_at'])
        return Response({'job': ContentJobSerializer(job).data, 'video_urls': urls}, status=status.HTTP_201_CREATED)
    except Exception as exc:
        fallback_url = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
        job.candidate_urls = [fallback_url]
        job.status = 'ready'
        job.error_message = str(exc)
        job.workflow_response = {'fallback': True, 'error': str(exc)}
        job.save(update_fields=['candidate_urls', 'status', 'error_message', 'workflow_response', 'updated_at'])
        return Response({'job': ContentJobSerializer(job).data, 'video_urls': job.candidate_urls}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def video_callback(request):
    return callback(request, 'video')


def callback(request, kind):
    job_id = request.data.get('job_id')
    try:
        job = ContentJob.objects.get(pk=job_id, content_kind=kind)
    except ContentJob.DoesNotExist:
        return Response({'detail': 'Matching job not found.'}, status=status.HTTP_404_NOT_FOUND)
    urls = request.data.get('urls') or request.data.get(f'{kind}_urls') or extract_urls(request.data, '.mp4' if kind == 'video' else None)
    job.candidate_urls = urls
    job.status = 'ready'
    job.workflow_response = request.data
    job.save(update_fields=['candidate_urls', 'status', 'workflow_response', 'updated_at'])
    return Response(ContentJobSerializer(job).data)


@api_view(['POST'])
def publish(request):
    media_url = request.data.get('media_url', '').strip()
    platforms = parse_json_field(request.data.get('platforms', []), [])
    schedule_plan = parse_json_field(request.data.get('schedule_plan') or request.data.get('schedule_details'), [])
    if not media_url or not platforms:
        return Response({'detail': 'media_url and platforms are required.'}, status=status.HTTP_400_BAD_REQUEST)
    job = ContentJob.objects.create(
        title=request.data.get('title', 'Scheduled content'),
        description=request.data.get('caption', ''),
        content_kind=request.data.get('content_type', 'image'),
        selected_url=media_url,
        target_platforms=platforms,
        caption=request.data.get('caption', ''),
        scheduled_at=request.data.get('scheduled_at') or request.data.get('schedule_at'),
        workflow_response={'schedule_plan': schedule_plan, 'hashtags': request.data.get('hashtags')},
        status='processing',
    )
    try:
        job.workflow_response = publish_content(job)
        job.status = 'scheduled'
        job.save(update_fields=['workflow_response', 'status', 'updated_at'])
        return Response(ContentJobSerializer(job).data, status=status.HTTP_201_CREATED)
    except Exception as exc:
        job.status, job.error_message = 'failed', str(exc)
        job.save(update_fields=['status', 'error_message', 'updated_at'])
        return Response(ContentJobSerializer(job).data, status=status.HTTP_502_BAD_GATEWAY)
