'''
Add all url patterns needed in Snippet app
'''
from django.conf.urls.defaults import (patterns,
                                        url)
from django.contrib.auth import views as auth_views

# Import our local imports here
from django.conf import settings

urlpatterns = patterns('project.views',
    url(r'^search/(.*)', "search", name="project-search"),
    url(r'^view_project/(?P<project_id>\d+)/$', "view_project", name='view_project'),
)

