'''
Add all our functions here
'''
from django.contrib.auth.decorators import login_required
from django.shortcuts import (render_to_response,
                              get_object_or_404)
from django.template import RequestContext

# import our local imports here
from models import UserSnippet

@login_required
def add_snippet(request):
    template_name='add_snippet.html'
    context = RequestContext(request,
                             dict())
    return render_to_response(template_name,
                              context)

def all_snippets(request):
    template_name='all_snippets.html'
    snippets = UserSnippet.\
                    objects.\
                    filter(approved=True).\
                    order_by('-created_at')
    context_data = {'snippets': snippets}
    context = RequestContext(request,
                             dict())
    return render_to_response(template_name,
                              context)

def view_snippet(request,
                 snippet_id):
    template_name = 'view_snippet.html'
    snippet = get_object_or_404(UserSnippet,
                                id=snippet_id,
                                approved=True)
    context_data = {'snippet': snippet}
    context = RequestContext(request,
                             dict())
    return render_to_response(template_name,
                              context)    