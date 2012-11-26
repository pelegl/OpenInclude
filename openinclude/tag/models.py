'''
Create your models here.
'''
from django.db import models
from djangosphinx import SphinxSearch

# import our local imports here
from django.contrib.auth.models import User
from project.models import Project

class TagManager(models.Manager):
    pass

class Tag(models.Model):
    """Tag model
    """
    name = models.CharField(max_length=30)

    objects = TagManager()

    def __unicode__(self):
        return self.name

class ProjectTagManager(models.Manager):
    pass

class ProjectTag(models.Model):
    project = models.ForeignKey(Project, related_name="ProjectTagProject")
    tag = models.ForeignKey(Tag, related_name="ProjectTagTag")

    objects = ProjectTagManager()
        

    def __unicode__(self):
        return "%s-%s" % (self.project, self.tag)

