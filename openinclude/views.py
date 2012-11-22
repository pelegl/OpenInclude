from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required

def index(request, template="index.html"):
    """home page
    """
    data = {
        "title" : "Home Page",
    }
    return render_to_response(template, data, context_instance=RequestContext(request))
