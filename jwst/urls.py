from django.urls import path

from . import views

urlpatterns = [
    path('', views.jwst, name='jwst'),
    path('fetch', views.getSchedules, name='getSchedules'),
]