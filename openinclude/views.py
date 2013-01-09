from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext
from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required

import settings
from common.utils import in_stealth_mode

def index(request, template="index.html"):
    """home page
    """
    data = {
        "title": "Home Page",
        "in_stealth_mode": _in_stealth_mode(request),
    }
    return render_to_response(template, data, context_instance=RequestContext(request))

def _in_stealth_mode(request):
    # STEALTH_MODE, check token
    if settings.STEALTH_MODE:
        if not "in_stealth_mode" in request.session or request.session["in_stealth_mode"]:
            return True
        else:
            return False
    else:
        # not STEALTH_MODE, always open
        return True

@in_stealth_mode
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

@in_stealth_mode
def integrate(request, template="integrate.html"):
    """home page
    """
    data = {
        "title" : "Integrate",
    }
    return render_to_response(template, data, context_instance=RequestContext(request))

@in_stealth_mode
def contribute(request, template="contribute.html"):
    """home page
    """
    data = {
        "title" : "Contribute",
    }
    return render_to_response(template, data, context_instance=RequestContext(request))

