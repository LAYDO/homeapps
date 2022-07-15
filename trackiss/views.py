from django.http.response import JsonResponse
from django.shortcuts import render
import requests

baseURL = 'https://api.wheretheiss.at/v1/satellites/25544'

# Create your views here.
def trackiss(request):
    return render(request, 'iss.html')

def getISS(request):
    units = ''
    timestamp = ''
    iss = {}
    issURL = baseURL + '?'
    for parm in request.GET:
        if (parm == 'units'):
            units = str(request.GET[parm])
            issURL += 'units=' + units + '&'
        elif (parm == 'timestamp'):
            timestamp = str(request.GET[parm])
            issURL += 'timestamp' + timestamp + '&'
    issURL = issURL[0:-1]
    # print(issURL)S
    # i = requests.get(issURL).json()
    i = requests.get(issURL).json()
    iss.update({
        'latitude': i['latitude'],
        'longitude': i['longitude'],
        'altitude': i['altitude'],
        'velocity': i['velocity'],
    })
    return JsonResponse(iss, safe=False)
