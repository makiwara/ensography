# -*- coding: utf-8 -*-
from utils.decorations import return_json, require_auth
from utils.decorations import tpls, HttpResponse
from bottle.models import Question, Answer

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
    return HttpResponse(tpls('bottle/iframe.html', dict(
        pk=pk,
        is_question=(pk > 0),
    ), request), content_type='text/html; charset=UTF-8')
