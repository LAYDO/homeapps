from importlib.resources import path
from django.urls import path

from . import views

urlpatterns = [
    path('', views.allergies, name='allergies'),
    path('get', views.getAllergies, name='getAllergies'),
]