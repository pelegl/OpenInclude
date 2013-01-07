from django.conf.urls.defaults import patterns, include, url
from django.conf import settings

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'openinclude.views.home', name='home'),
    # url(r'^openinclude/', include('openinclude.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^$', 'views.index', name="homepage"),
    url(r'^discover/$', 'views.discover', name="discover"),
    url(r'^demo/$', 'views.demo', name="demo"),
    url(r'^integrate/$', 'views.integrate', name="integrate"),
    url(r'^contribute/$', 'views.contribute', name="contribute"),
    url(r'^prelaunch/', include('prelaunch.urls')),
    url(r'^snippet/', include('snippet.urls')),
    url(r'^project/', include('project.urls')),
    url(r'^member/', include('member.urls')),
    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)

if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.MEDIA_ROOT,
            }),
        )
    urlpatterns += patterns('',
        url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.STATIC_ROOT,
            }),
        )
