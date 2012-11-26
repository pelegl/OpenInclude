'''
Create your models here.
'''
from django.db import models
from djangosphinx import SphinxSearch

# import our local imports here
from django.contrib.auth.models import User

class MemberManager(models.Manager):
    pass

class Member(models.Model):
    """Member model
    """
    user = models.ForeignKey(User, related_name="MemberUser")
    github_username = models.CharField(max_length=20)
    github_profile = models.URLField(blank=True, null=True)

    objects = MemberManager()
    
    def __unicode__(self):
        return self.github_username
