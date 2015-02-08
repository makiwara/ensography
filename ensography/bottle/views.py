# -*- coding: utf-8 -*-
from utils.decorations import return_json, require_auth
from utils.decorations import tpls, HttpResponse
from bottle.models import Question, Answer, ViewStat
from django.core.context_processors import csrf

from settings import STATICFILES_DIRS, STATIC_URL

@require_auth
@return_json
def next(request):
    pk = request.GET.get('pk', 0)
    next = Question.objects.filter(active=1, pk__gt=pk).order_by('pk')
    if next.count() > 0:
        next = next[0]
        return dict(
            pk = next.pk,
            html = tpls('bottle/one.html', dict(question = next), request),    
        )
    else:
        return dict(html = tpls('bottle/add.html', dict(), request))

@require_auth
def iframe(request):
    pk = request.GET.get('pk', 0)
    data = dict(
        pk=pk,
        is_question=(pk > 0),
    )
    data.update(csrf(request))
    return HttpResponse(tpls('bottle/iframe.html', data, request), content_type='text/html; charset=UTF-8')

@require_auth
def upload(request):
    pk = int(request.POST.get('pk', 0))
    image = request.FILES['photo']
    if (image.content_type in ['image/jpeg', 'image/jpg', 'image/png']):
        if pk==0:
            obj = Question()
        else:
            obj = Answer()
            obj.question = Question.objects.get(pk=pk)
        obj.user   = request.user
        obj.active = 1 # TODO set to 0 to enable premoderation after first wave
        obj.save() # to obtain key
        filename = '/data/bottle/%s-%s.jpg'%(pk,obj.pk)
        with open(STATICFILES_DIRS[0].rstrip("/") + filename, 'wb+') as destination:
            for chunk in image.chunks():
                destination.write(chunk)
        obj.url = STATIC_URL.rstrip("/") + filename
        obj.save()
        return HttpResponse(tpls('bottle/iframe_signal.html', dict(
            pk = pk,
            is_question=(pk == 0),
        ), request), content_type='text/html; charset=UTF-8')
    else:
        data = dict(
            pk=pk,
            is_question=(pk > 0),
        )
        data.update(csrf(request))
        return HttpResponse(tpls('bottle/iframe.html', data, request), content_type='text/html; charset=UTF-8')


@require_auth
@return_json
def results(request):
    pk = int(request.GET.get('pk', 0))
    question = Question.objects.get(pk=pk)
    answers = Answer.objects.filter(question=question)
    return dict( results=map(lambda x: dict(url=x.url, pk=x.pk), answers) )


@require_auth
@return_json
def stat(request):
    answer = Answer.objects.get(pk=int(request.GET.get('answer')))
    stat, is_created = ViewStat.objects.get_or_create(user=request.user, answer=answer)
    return dict()
