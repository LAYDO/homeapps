from django.urls import path

from apps import views

urlpatterns = [
    path('', views.apps, name='apps')
]