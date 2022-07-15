from django.urls import path

from . import views

urlpatterns = [
    path('', views.rplace, name='rplace'),
    path('get/', views.getRplaceTiles, name='getRplaceTiles'),
]