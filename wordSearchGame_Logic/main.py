# -*- coding: UTF-8 -*-
from typing import List
from wordSearchGame_PythonDjango.models import Words
import bcolors as bc
import random

class Main:
    
    def getNewWord(self):
        try:
            wordList = []
            allWordsDB = Words.objects.all()
            for oneWordDB in allWordsDB:
                wordList.append(oneWordDB.description)
            answer = {
                'rc': True,
                'rv': random.choice(wordList)
            }
        except Exception as error:
            answer = {
                'rc': False,
                'rv': error
            }
        finally:
            return answer