'''
Add all url patterns needed in Snippet app
'''
from django.conf.urls.defaults import (patterns,
                                        url)

# Import our local imports here
from snippet.views import *

urlpatterns = patterns('snippet.views',
                       url(r'^add/snippet/',
                           add_snippet,
                           name='add snippet'),
                       url(r'all_snippets',
                           'all_snippets',
                           name='all snippets'),
                       url(r'^view_snippet',
                           view_snippet,
                           name='view snippet'))
