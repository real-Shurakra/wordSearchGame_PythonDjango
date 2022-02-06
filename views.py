import bcolors as bc
from django.http import HttpResponseServerError, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import time



import wordSearchGame_PythonDjango.wordSearchGame_Logic.main as engine

# Create your views here.

def index(request):
    tmpPath = r'./index.html'
    answer = render(request, template_name=tmpPath)
    return answer

@csrf_exempt
def getWordDataList(request):
    temp = engine.Main()
    data = temp.getWordDataList()
    if data['rc']:
        return JsonResponse(data)
    else:
        print(bc.ERRMSG, data['rv'], bc.END)
        return HttpResponseServerError()
    

@csrf_exempt
def getNewWord(request):
    temp = engine.Main()
    data = temp.getNewWord()
    if data['rc']:
        request.session['searchWord'] = data['rv']
        request.session['startTime'] = time.time()
        return JsonResponse(data)
    else:
        print(bc.ERRMSG, data['rv'], bc.END)
        return HttpResponseServerError()

@csrf_exempt
def checkWord(request):
    word = request.POST['word']
    temp = engine.Main()
    data = temp.checkWord(word, request.session['searchWord'])
    if data['rc']:
        return JsonResponse(data)
    else:
        print(bc.ERRMSG, data['rv'], bc.END)
        return HttpResponseServerError()
    
@csrf_exempt
def endGame(request):
    request.session['endTime'] = time.time()
    data = {
        'rc':True,
        'rv':True
    }
    return JsonResponse(data)
    
@csrf_exempt
def insertHighScore(request):
    neededRounds = request.POST['neededRounds']
    userName = request.POST['userName']
    deltaTime = request.session['endTime'] - request.session['startTime']
    seachWord = request.session['searchWord']
    temp = engine.Main()
    data = temp.insertHighScore(neededRounds, userName, seachWord, deltaTime)
    if data['rc']:
        return JsonResponse(data)
    else:
        print(bc.ERRMSG, data['rv'], bc.END)
        return HttpResponseServerError()

@csrf_exempt
def getHighScoreTopTenFromWord(request):
    pass