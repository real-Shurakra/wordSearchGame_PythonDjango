# -*- coding: UTF-8 -*-
from wordSearchGame_PythonDjango.models import Words, Highscore
import random

class Main:
    
    def getWordDataList(self):
        try:
            dataListOptions = '<option id="{word}" value="{word}">{word}</option>'
            dataListOptionsString = ''
            dbControl = DatabaseFunctions()
            
            wordList = dbControl.getAllWords()
            for word in wordList:
                dataListOptionsString += dataListOptions.format(word=word)
            answer = {
                'rc': True,
                'rv': dataListOptionsString
            }
            
        except Exception as error:
            answer = {
                'rc': False,
                'rv': error
            }
        finally:
            return answer
    
    def getNewWord(self):
        try:
            dbControl = DatabaseFunctions()
            wordList = dbControl.getAllWords()
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
        
    def checkWord(self, word, searchWord):
        try:
            arrayAnswer = dict()
            htmlAnswer = """
                {letter1}
                {letter2}
                {letter3}
                {letter4}
                {letter5}
            """
            htmlTag = '<td class="{htmlClass}"><p>{letter}</p></td>'
            htmlAnswerList = [
                '',
                '',
                '',
                '',
                '',
            ]
            if Words.objects.filter(description=word).exists():
                counter = 0
                for letter in word:
                    if letter == searchWord[counter]:
                        htmlAnswerList[counter] = htmlTag.format(htmlClass = 'letterExect',
                                                                 letter = letter)
                    elif letter in searchWord:
                        htmlAnswerList[counter] = htmlTag.format(htmlClass = 'letterInside',
                                                                 letter = letter)
                    else:
                        htmlAnswerList[counter] = htmlTag.format(htmlClass = 'letterNot',
                                                                 letter = letter)
                    counter = counter + 1
                wordIsEqual = word == searchWord
                
                htmlAnswer = htmlAnswer.format(letter1 = htmlAnswerList[0],
                                               letter2 = htmlAnswerList[1],
                                               letter3 = htmlAnswerList[2],
                                               letter4 = htmlAnswerList[3],
                                               letter5 = htmlAnswerList[4],
                                               )
                
                arrayAnswer['htmlRow'] = htmlAnswer
                arrayAnswer['wordFound'] = wordIsEqual
                answer = {
                    'rc':True,
                    'rv':arrayAnswer
                }
            else:
                answer = {
                    'rc':True,
                    'rv':False
                }
        except Exception as error:
            answer = {
                'rc': False,
                'rv': error
            }
        finally:
            return answer
        
    def insertHighScore(self, neededRounds, userName, searchWord, deltaTime):
        print('userName:', userName)
        print('deltaTime:', deltaTime)
        print('neededRounds:', neededRounds)
        print('searchWord:', searchWord)
        
        wordObject = Words.objects.get(description=searchWord)
        
        newHighScore = Highscore(username = userName, time = deltaTime, rounds = neededRounds, word = wordObject)
        newHighScore.save()
        return {
            'rc':True,
            'rv':True
        }
        
    
class DatabaseFunctions():
    
    def getAllWords(self):
        wordList = []
        allWordsDB = Words.objects.all()
        for oneWordDB in allWordsDB:
            wordList.append(oneWordDB.description)
        return wordList
    

