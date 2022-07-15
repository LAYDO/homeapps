from datetime import datetime, timedelta
from django.shortcuts import render
from django.http.response import JsonResponse

from .models import RplaceTile

r_start = datetime(2022,4,1,12,44,10,315000)

# Create your views here.
def rplace(request):
    return render(request, 'rplace.html')

def getRplaceTiles(request):
    startTime = datetime.now()
    print('ENTER')
    r = 1
    for parm in request.GET:
        if (parm == 'r'):
            r = int(request.GET[parm])
            duration = timedelta(minutes=r)
            last_duration = timedelta(minutes=r-1)

    tiles = list(RplaceTile.objects.filter(timestamp__gte=r_start + last_duration,timestamp__lt=r_start + duration).all().values())
    print(datetime.now() - startTime)
    return JsonResponse(tiles, safe=False)