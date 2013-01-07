from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext
from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required

import settings


def index(request, template="index.html"):
    """home page
    """
    data = {
        "title": "Home Page",
        "is_open": _is_open(request),
    }
    return render_to_response(template, data, context_instance=RequestContext(request))

def _is_open(request):
    # STEALTH_MODE, check token
    if settings.STEALTH_MODE:
        if "is_open" in request.session and request.session["is_open"]:
            return True
        else:
            return False
    else:
        # not STEALTH_MODE, always open
        return True


def discover(request, template="discover.html"):
    """home page
    """
    data = {
        "title" : "Discover",
    }
    return render_to_response(template, data, context_instance=RequestContext(request))

def demo(request, template="demo.html"):
    """home page
    """
    data = {
        "title" : "Demo",
    }
    return render_to_response(template, data, context_instance=RequestContext(request))

def integrate(request, template="integrate.html"):
    """home page
    """
    data = {
        "title" : "Integrate",
    }
    return render_to_response(template, data, context_instance=RequestContext(request))

def contribute(request, template="contribute.html"):
    """home page
    """
    data = {
        "title" : "Contribute",
    }
    return render_to_response(template, data, context_instance=RequestContext(request))

