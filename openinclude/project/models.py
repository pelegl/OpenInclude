'''
Create your models here.
'''
from django.db import models
from djangosphinx import SphinxSearch

# import our local imports here
from django.contrib.auth.models import User
from member.models import Member
from const.choices import ProjectTypeChoices, ProjectLanguageChoices, ProjectLicenseChoices
from const.choices import ProjectSizeChoices

class ProjectManager(models.Manager):
    def new_project(self, member, type, lang, license, intro, desc, size, link):
        m = self.model(member, type, lang, license, intro, desc, size, link)
        m.save()
    

class Project(models.Model):
    """Project model
    """
    member = models.ForeignKey(Member, related_name="ProjectMember")
    type = models.IntegerField(choices=ProjectTypeChoices.CHOICES, default=ProjectTypeChoices.library)
    language = models.IntegerField(choices=ProjectLanguageChoices.CHOICES)
    license = models.IntegerField(choices=ProjectLicenseChoices.CHOICES)
    intro = models.TextField()
    fulldesc = models.TextField()
    size = models.IntegerField(choices=ProjectSizeChoices.CHOICES)
    link = models.URLField()

    objects = ProjectManager()
    
    def __unicode__(self):
        return "%s" % self.link
