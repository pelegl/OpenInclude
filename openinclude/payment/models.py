'''
Create your models here.
'''
from django.db import models
from djangosphinx import SphinxSearch

# import our local imports here
from django.contrib.auth.models import User

class Member(models.Model):
    user = models.ForeignKey(User, related_name="MemberUser")
    github_username = models.CharField(max_length=20)
    
    def __unicode__(self):
        return self.github_username
