from django.urls import path

from . import views

urlpatterns = [
    path('',                            views.index,                        name='index'),
    path('getNewWord',                  views.getNewWord,                   name='getNewWord'),
    path('checkWord',                   views.checkWord,                    name='checkWord'),
    path('getWordDataList',             views.getWordDataList,              name='getWordDataList'),
    path('endGame',                     views.endGame,                      name='endGame'),
    path('insertHighScore',             views.insertHighScore,              name='insertHighScore'),
    path('getHighScoreTopTenFromWord',  views.getHighScoreTopTenFromWord,   name='getHighScoreTopTenFromWord'),
]
