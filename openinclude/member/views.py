from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response, HttpResponseRedirect, get_object_or_404
from django.core.urlresolvers import reverse
from django.template import RequestContext
from django.http import HttpResponse
from django.conf import settings
from member.oauth import GithubOAuth
import json
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from member.models import Member

# import our local imports here
def after_login(request, template="member/after_login.html"):
    error = request.GET.get("error")
    code = request.GET.get("code", None)
    if error or code is None:
        data = {
            "title" : "Login Failed",
            "error" : "Something error happened, please try again.",
        }
        return render_to_response(template, data, context_instance=RequestContext(request))
    auth = GithubOAuth()
    auth.get_token(code) 
    resp = auth.get_user_info()
    resp.update({"access_token" : auth.token})
    r = Member.objects.login_user(request, resp)
    return r

def signin(request):
    url = "https://github.com/login/oauth/authorize?client_id=%s&redirect_uri=%s" % \
        (settings.CLIENT_ID, settings.REDIRECT_URL)
    return HttpResponseRedirect(url)

@login_required
def signout(request):
    logout(request)
    return HttpResponseRedirect("/")

@login_required
def profile(request, template="member/profile.html"):
    member = Member.objects.get_member(request.user)
    if member is None:
        logout(request)
        return HttpResponseRedirect("/")
    data = {
        "title" : member.github_username,
        "member" : member,
    }
    return render_to_response(template, data, context_instance=RequestContext(request))
    
