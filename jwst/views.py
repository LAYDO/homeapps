import this
from django.http.response import JsonResponse
from django.shortcuts import render
import requests
from bs4 import BeautifulSoup
import pandas as pd

baseURL = 'https://www.stsci.edu'
schedURL = "/jwst/science-execution/observing-schedules"
columns = ['VISIT ID       ',
            'PCS MODE    ',
            'VISIT TYPE                     ',
            'SCHEDULED START TIME  ','DURATION     ',
            'SCIENCE INSTRUMENT AND MODE                         ',
            'TARGET NAME                      ',
            'CATEGORY                        ',
            'KEYWORDS  '
        ]

# Create your views here.
def jwst(request):
    return render(request, 'jwst.html')

def getSchedules(request):
    schedule = {}
    lList = []
    response = requests.get(f'{baseURL}{schedURL}')
    page = BeautifulSoup(response.content, "html.parser")
    # https://stackoverflow.com/questions/69823218/how-to-extract-link-from-href-using-beautifulsoup
    results = page.find(id="tab_8b4634e7-3776-4d67-b685-d266991a2149_0_section")
    links = results.find_all('a', href=True)
    for link in links:
        comp = link['href']
        abs_url = f'{baseURL}{comp}'
        df = pd.read_csv(abs_url,
            header=1,
            sep='\s{2,}',
            skipinitialspace=True,
            error_bad_lines=False,
            engine='python',
        )
        # print(df)
        d = df.loc[df['CATEGORY'] != 'Calibration'].to_dict(orient='records')
        # print(d)
        for item in d:
            l = len(schedule.items())
            if item['VISIT ID'] == '-------------':
                print(item)
            elif item['VISIT ID'] == 'COORDINATED PARALLEL':
                schedule[f'item{str(l - 1).rjust(3,"0")}']["SCIENCE INSTRUMENT AND MODE"] = schedule[f'item{str(l - 1).rjust(3,"0")}']["SCIENCE INSTRUMENT AND MODE"] + f', {item["PCS MODE"]}'
                schedule[f'item{str(l - 1).rjust(3,"0")}']["VISIT TYPE"] = schedule[f'item{str(l - 1).rjust(3,"0")}']["VISIT TYPE"] + f', {item["VISIT ID"]}'
                lList[l - 1] = schedule[f'item{str(l - 1).rjust(3,"0")}']
            elif l > 0 and str(item['VISIT ID']).split("-")[0] == str(schedule[f'item{str(l - 1).rjust(3,"0")}']['TARGET NAME']).split("-")[0]:
                schedule[f'item{str(l - 1).rjust(3,"0")}']["TARGET NAME"] = schedule[f'item{str(l - 1).rjust(3,"0")}']["TARGET NAME"] + f', {item["VISIT ID"]}'
                schedule[f'item{str(l - 1).rjust(3,"0")}']["CATEGORY"] = schedule[f'item{str(l - 1).rjust(3,"0")}']["CATEGORY"] + f', {item["PCS MODE"]}'
                schedule[f'item{str(l - 1).rjust(3,"0")}']["KEYWORDS"] = schedule[f'item{str(l - 1).rjust(3,"0")}']["KEYWORDS"] + f', {item["VISIT TYPE"]}'
                lList[l - 1] = schedule[f'item{str(l - 1).rjust(3,"0")}']
            else:
                schedule.update({
                    f'item{str(l).rjust(3,"0")}': item
                })
                lList.append(item)
    lList.sort(key=lambda item: item.get("SCHEDULED START TIME"))
    return JsonResponse(lList, safe=False)
