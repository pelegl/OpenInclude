'''
Add all url patterns needed in Snippet app
'''
from django.conf.urls.defaults import (patterns,
                                        url)
from django.contrib.auth import views as auth_views

# Import our local imports here
from django.conf import settings

from views import *

urlpatterns = patterns('member.views',
    url(r'^after_login/$', "after_login", name="member-after-login"),
    url(r'^signout/$', "signout", name="member-logout"),
    url(r'^signin/$', "signin", name="member-signin"),
    url(r'^profile/$', "profile", name="member-profile"),
)

