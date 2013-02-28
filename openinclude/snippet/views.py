'''
Add all our functions here
'''
from django.contrib.auth.decorators import login_required
from django.shortcuts import (render_to_response,
                              HttpResponseRedirect,
                              get_object_or_404)
from django.core.urlresolvers import reverse
from django.template import RequestContext

# import our local imports here
from common.utils import in_stealth_mode
from models import UserSnippet
from forms import SnippetForm

@in_stealth_mode
@login_required
def add_snippet(request):
    template_name='snippet/add_snippet.html'
    form = SnippetForm
    if request.method == 'POST':
        form = form(request.POST)
        if form.is_valid():
            form = form.save(commit=False)
            form.user = request.user
            form.save()
            return HttpResponseRedirect(reverse('all_snippets'))
    context_data = {'form' : form}
    context = RequestContext(request,
                             context_data)
    return render_to_response(template_name,
                              context)

@in_stealth_mode
def all_snippets(request):
    template_name='snippet/all_snippets.html'
    snippets = UserSnippet.\
                    objects.\
                    filter(approved=True).\
                    order_by('-created_at')
    context_data = {'snippets': snippets}
    context = RequestContext(request,
                             context_data)
    return render_to_response(template_name,
                              context)

@in_stealth_mode
def view_snippet(request,
                 snippet_id):
    template_name = 'snippet/view_snippet.html'
    snippet = get_object_or_404(UserSnippet,
                                id=snippet_id,
                                approved=True)
    context_data = {'snippet': snippet}
    context = RequestContext(request,
                             context_data)
    return render_to_response(template_name,
                              context)    

@in_stealth_mode
def search(request, query, template="snippet/search.html"):
    try:
        if(query == ''):
            query = request.GET['query']
        results = UserSnippet.search.query(query)
        context = { 'snippets': list(results),'query': query, 'search_meta':results._sphinx }
    except Exception as e:
        context = { 'snippets': list() }
            
    return render_to_response(template, context, context_instance=RequestContext(request)) 
