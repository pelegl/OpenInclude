'''
Add all url patterns needed in Snippet app
'''
from django.conf.urls.defaults import (patterns,
                                        url)

# Import our local imports here
from views import *

urlpatterns = patterns('',
                       url(r'^add_snippet/$',
                           add_snippet,
                           name='add_snippet'),
                       url(r'all_snippets/$',
                           all_snippets,
                           name='all_snippets'),
                       url(r'^view_snippet/(?P<snippet_id>\d+)/$',
                           view_snippet,
                           name='view_snippet'))
