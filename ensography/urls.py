# -*- coding: utf-8 -*-
from django.conf.urls import *
from django.contrib import admin

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()
from django.conf import settings

def static(request, url):
    from utils.decorations import tpls, HttpResponse
    return HttpResponse(tpls('%s.html'%url, dict(), request), content_type='text/html; charset=UTF-8')

urlpatterns = patterns('',
    #(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.HOST["STATIC_ROOT"]}),
    (r'^(temp)', 'urls.static'),
    (r'^stat/([^/]*)/report/([^/]*)', 'booklets.views.stat_report'),
    (r'^stat/([^/]*)/booklet/([^/]*)', 'booklets.views.stat_booklet'),
    (r'^stat/([^/]*)/positive/([^/]*)/([^/]*)', 'booklets.views.stat_positive'),
    (r'^stat/([^/]*)/negative/([^/]*)/([^/]*)', 'booklets.views.stat_negative'),
    (r'^stat/([^/]*)/page/([^/]*)/([^/]*)', 'booklets.views.stat_page'),

    (r'^test/([^/]*)', 'booklets.views.test'),

    (r'^zen/([^/]*)', 'booklets.views.show'),
    (r'^one/([^/]*)', 'booklets.views.one'),


    (r'^enso/([^/]*)', 'booklets.views.show2'),
    (r'^two/([^/]*)',  'booklets.views.one2'),

    (r'^setup1', 'booklets.views.setup1'),
    (r'^setup2', 'booklets.views.setup2'),
    (r'^setup3', 'booklets.views.setup3'),
    (r'^setup_students2', 'booklets.views.setup1_students2'),
    (r'^setup_students', 'booklets.views.setup1_students'),

    url(r'^admin/', include(admin.site.urls)),

    (r'^', 'booklets.views.homepage'),    
)


    