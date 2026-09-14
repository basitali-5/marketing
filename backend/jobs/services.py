import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from django.conf import settings


def post_webhook(url, payload):
    headers = {'Content-Type': 'application/json'}
    if settings.N8N_WEBHOOK_HEADER_VALUE:
        headers[settings.N8N_WEBHOOK_HEADER_NAME] = settings.N8N_WEBHOOK_HEADER_VALUE

    session = requests.Session()
    retries = Retry(
        total=2,
        backoff_factor=0.5,
        status_forcelist=(429, 500, 502, 503, 504),
        allowed_methods=None,
        raise_on_status=False,
    )
    session.mount('http://', HTTPAdapter(max_retries=retries))
    session.mount('https://', HTTPAdapter(max_retries=retries))

    try:
        response = session.post(url, json=payload, headers=headers, timeout=settings.N8N_TIMEOUT_SECONDS)
        if response.status_code >= 400:
            raise requests.HTTPError(f'N8N webhook failed with status {response.status_code}: {response.text[:250]}')
        try:
            return response.json()
        except ValueError:
            return {'raw': response.text}
    except requests.RequestException as exc:
        return {
            'fallback': True,
            'error': str(exc),
            'url': url,
            'payload': payload,
        }


def extract_urls(value, extension=None):
    found = []
    if isinstance(value, dict):
        for nested in value.values():
            found.extend(extract_urls(nested, extension))
    elif isinstance(value, list):
        for nested in value:
            found.extend(extract_urls(nested, extension))
    elif isinstance(value, str) and value.startswith(('http://', 'https://')):
        if not extension or extension in value.lower():
            found.append(value)
    return list(dict.fromkeys(found))


def dispatch_to_n8n(job):
    payload = {
        'job_id': job.pk,
        'topic': job.title,
        'prompt': job.description,
        'description': job.description,
        'reference_text': job.reference_text,
        'referenceText': job.reference_text,
        'output_count': 2,
        'outputCount': 2,
        'aspectRatio': job.aspect_ratio,
        'aspect_ratio': job.aspect_ratio,
        'platform': job.platform,
        'scheduleAt': job.scheduled_at.isoformat() if job.scheduled_at else None,
        'schedule_at': job.scheduled_at.isoformat() if job.scheduled_at else None,
        'options': {
            'format': job.aspect_ratio,
            'quality': 'high',
            'duration': 5,
            'output_count': 2,
        },
    }
    return post_webhook(settings.N8N_VIDEO_WEBHOOK_URL, payload)


def generate_post_options(reference_text):
    payload = {
        'reference_text': reference_text,
        'referenceText': reference_text,
        'output_count': 2,
        'outputCount': 2,
    }
    return post_webhook(settings.N8N_POST_OPTIONS_WEBHOOK_URL, payload)


def generate_image(job):
    payload = {
        'job_id': job.pk,
        'prompt': job.description,
        'post_text': job.headline or job.description,
        'description': job.description,
        'reference_text': job.reference_text,
        'referenceText': job.reference_text,
        'output_count': 2,
        'outputCount': 2,
        'aspectRatio': job.aspect_ratio,
        'aspect_ratio': job.aspect_ratio,
        'platform': job.platform,
    }
    return post_webhook(settings.N8N_IMAGE_WEBHOOK_URL, payload)


def publish_content(job):
    workflow_context = job.workflow_response or {}
    payload = {
        'job_id': job.pk,
        'media_url': job.selected_url,
        'mediaUrl': job.selected_url,
        'content_type': job.content_kind,
        'platforms': job.target_platforms,
        'caption': job.caption,
        'hashtags': workflow_context.get('hashtags', ''),
        'schedule_plan': workflow_context.get('schedule_plan', []),
        'schedule_at': job.scheduled_at.isoformat() if job.scheduled_at else None,
        'scheduled_at': job.scheduled_at.isoformat() if job.scheduled_at else None,
    }
    return post_webhook(settings.N8N_PUBLISH_WEBHOOK_URL, payload)
