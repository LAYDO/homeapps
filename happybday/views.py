from django.shortcuts import render

# Create your views here.
def happybday(request):
    return render(request, 'happybday.html')