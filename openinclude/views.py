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
