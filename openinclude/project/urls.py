'''
Add all url patterns needed in Snippet app
'''
from django.conf.urls.defaults import (patterns,
                                        url)
from django.contrib.auth import views as auth_views

# Import our local imports here
from django.conf import settings


urlpatterns = patterns('project',

    url(r'^$', 'views.index', name="project-index"),
    url(r'^search/$', 'views.search', name="project-search"),
)

