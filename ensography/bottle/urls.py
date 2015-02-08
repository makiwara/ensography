# -*- coding: utf-8 -*-

from django.conf.urls import url
import bottle.views

urlpatterns = [
    url(r'^iframe/$',       bottle.views.iframe),
    url(r'^next/$',         bottle.views.next),
    url(r'^upload/$',       bottle.views.upload),
    url(r'^results/$',      bottle.views.results),
    url(r'^stat/$',         bottle.views.stat),
]