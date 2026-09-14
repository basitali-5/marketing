from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health),
    path('jobs/', views.jobs),
    path('jobs/<int:pk>/', views.job_detail),
    path('stats/', views.stats),
    path('image/options/', views.image_options),
    path('images/', views.images),
    path('images/callback/', views.image_callback),
    path('videos/', views.videos),
    path('videos/callback/', views.video_callback),
    path('publish/', views.publish),
]
