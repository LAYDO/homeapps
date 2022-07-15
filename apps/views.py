from django.shortcuts import render

# Create your views here.
def apps(request):
    return render(request, 'apps.html', {})