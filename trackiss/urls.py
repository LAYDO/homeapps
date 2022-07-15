from django.urls import path

from . import views

urlpatterns = [
    path('', views.trackiss, name='trackiss'),
    path('iss', views.getISS, name='getISS'),
]