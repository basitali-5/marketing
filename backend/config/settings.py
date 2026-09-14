import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'dev-only-change-me')
DEBUG = os.getenv('DJANGO_DEBUG', 'true').lower() == 'true'
ALLOWED_HOSTS = [host.strip() for host in os.getenv('DJANGO_ALLOWED_HOSTS', '*').split(',') if host.strip()]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'jobs',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'
TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [],
    'APP_DIRS': True,
    'OPTIONS': {'context_processors': [
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages',
    ]},
}]
WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {'default': {'ENGINE': 'django.db.backends.sqlite3', 'NAME': BASE_DIR / 'db.sqlite3'}}
AUTH_PASSWORD_VALIDATORS = []
LANGUAGE_CODE = 'en-us'
TIME_ZONE = os.getenv('DJANGO_TIME_ZONE', 'Asia/Karachi')
USE_I18N = True
USE_TZ = True
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOWED_ORIGINS = [origin.strip() for origin in os.getenv(
    'CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173'
).split(',') if origin.strip()]

N8N_WEBHOOK_BASE_URL = os.getenv(
    'N8N_WEBHOOK_BASE_URL',
    os.getenv('N8N_WEBHOOK_URL', 'http://localhost:5678/webhook'),
).strip().rstrip('/')

N8N_VIDEO_WEBHOOK_URL = os.getenv('N8N_VIDEO_WEBHOOK_URL', f'{N8N_WEBHOOK_BASE_URL}/product')
N8N_POST_OPTIONS_WEBHOOK_URL = os.getenv('N8N_POST_OPTIONS_WEBHOOK_URL', f'{N8N_WEBHOOK_BASE_URL}/generate-options')
N8N_IMAGE_WEBHOOK_URL = os.getenv('N8N_IMAGE_WEBHOOK_URL', f'{N8N_WEBHOOK_BASE_URL}/generate-image')
N8N_PUBLISH_WEBHOOK_URL = os.getenv('N8N_PUBLISH_WEBHOOK_URL', f'{N8N_WEBHOOK_BASE_URL}/publish')
N8N_WEBHOOK_HEADER_NAME = os.getenv('N8N_WEBHOOK_HEADER_NAME', 'X-N8N-API-KEY')
N8N_WEBHOOK_HEADER_VALUE = os.getenv('N8N_WEBHOOK_HEADER_VALUE', '')
N8N_TIMEOUT_SECONDS = int(os.getenv('N8N_TIMEOUT_SECONDS', '25'))
