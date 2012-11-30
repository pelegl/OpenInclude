'''
Create your models here.
'''
from django.db import models
from djangosphinx import SphinxSearch

# import our local imports here
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render_to_response, HttpResponseRedirect, get_object_or_404
from django.core.urlresolvers import reverse
from django.conf import settings

class MemberManager(models.Manager):
    def login_user(self, request, data):
        """create a new member
        """
        try:
            member = self.get(github_profile=data.get("html_url"))
            member.token = data.get("access_token")
            member.save()
            password = "%s:%s" % (member.user.username, settings.SECRET_KEY)
            user = authenticate(username=member.user.username, password=password)
            if user and user.is_active:
                login(request, user)
                return HttpResponseRedirect("/")
            else:
                return HttpResponseRedirect(reverse("error-page")+"?msg=Something error happened")
        except:
            username = data.get("login")
            password = "%s:%s" % (username, settings.SECRET_KEY)
            github_name = data.get("name")
            github_profile = data.get("html_url")
            avatar = data.get("avatar_url")
            user = User.objects.create_user(username=username, password=password)
            token = data.get("access_token")
            member = self.model(user=user, github_username=github_name, avatar=avatar, \
                        github_profile=github_profile, token=token)
            member.save()
            user = authenticate(username=username, password=password)
            login(request, user)
            return HttpResponseRedirect("/")
            

    def get_member(self, user):
        try:
            member = self.get(user=user)
            return member
        except:
            return None

class Member(models.Model):
    """Member model
    """
    user = models.ForeignKey(User, related_name="MemberUser")
    github_username = models.CharField(max_length=120)
    avatar = models.CharField(max_length=250, null=True)
    github_profile = models.URLField(blank=True, null=True)
    token = models.CharField(max_length=200, default="")
    

    objects = MemberManager()
    
    def __unicode__(self):
        return self.github_username
