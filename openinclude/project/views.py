from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response, HttpResponseRedirect, get_object_or_404
from django.http import HttpResponse
from django.core.urlresolvers import reverse
from django.template import RequestContext

# import our local imports here
def index(request, template="project/index.html"):
    data = {
        "title" : "Project",
    }
    return render_to_response(template, data, context_instance=RequestContext(request))

def search(request, template="project/search.html"):
    data = {
        "title" : "Project Search",
    }
    try:
        if(query == ''):
            query = request.GET['query']
        results = Project.search.query(query)
        context = { 'projects': list(results),'query': query, 'search_meta':results._sphinx }
    except Exception as e:
        context = { 'projects': list() }
    context.update(data)
            
    return render_to_response(template, context, context_instance=RequestContext(request)) 
