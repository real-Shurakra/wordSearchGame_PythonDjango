from django.db import models

# Create your models here.
class Words(models.Model):
    description = models.CharField(max_length=5, unique=True)
    
class Highscore(models.Model):
    username = models.CharField(max_length=3)
    time = models.TimeField()
    rounds = models.SmallIntegerField()
    word = models.ForeignKey(Words, on_delete=models.CASCADE)