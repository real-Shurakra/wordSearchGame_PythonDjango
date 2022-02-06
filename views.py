import bcolors as bc
from django.http import HttpResponseServerError, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

import wordSearchGame_PythonDjango.wordSearchGame_Logic.main as engine

# Create your views here.

def index(request):
    tmpPath = r'./index.html'
    answer = render(request, template_name=tmpPath)
    return answer

@csrf_exempt
def getNewWord(request):
    temp = engine.Main()
    data = temp.getNewWord()
    if data['rc']:
        return JsonResponse(data, safe=False)
    else:
        print(bc.ERRMSG, data['rv'], bc.END)
        return HttpResponseServerError()
