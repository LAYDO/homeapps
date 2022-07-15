from __future__ import with_statement
import string
from django.shortcuts import render
from django.http.response import JsonResponse

from .models import Allergies
# from django.conf import settings

# import tabula as tb
# import pandas as pd
# import numpy as np

# Create your views here.
def allergies(request):
    return render(request, 'allergies.html')

# Retrieving allergies from PDF - shout out this tutorial https://aegis4048.github.io/parse-pdf-files-while-retaining-structure-with-tabula-py
# Converting to CSV
def getAllergies(request):
    # file = str(settings.BASE_DIR) + '/allergies/test.csv' 
    # settings.STATIC_ROOT + '/allergies/img/Apollo-Robinson_2022-05-04.pdf'
    # data = pd.read_csv(file, skipinitialspace=True)
    # print(data)
    # dataL = tb.read_pdf(file, lattice=True, pages='2')
    # dataS = tb.read_pdf(file, stream=True, guess=False, pages='2')
    # print("STREAM2:\n" + str(dataS))
    # json = tb.read_pdf(file, output_format='json', stream=True, pages='2-8')
    # print("LATTICE:\n" + str(dataL))
    # tb.convert_into(file, "test.csv", output_format="csv", stream=True, pages='2-8')
    # df = pd.DataFrame(np.concatenate(data))
    # print(df)
    level = -1
    for parm in request.GET:
        if (parm == 'level'):
            level = int(request.GET[parm])
        else:
            level = -1
    if level >= 0:
        allergies = list(Allergies.objects.filter(level=level).all().values())
    else:
        allergies = list(Allergies.objects.all().values())
    return JsonResponse(allergies, safe=False)
