# -*- coding: utf-8 -*-
from utils.decorations import return_json, require_auth
from comments.models import User, Comment, Reply

@return_json
def load(request):
    comments = Comment.objects.filter(
        tag=request.GET.get('tag'),
        active=1,
    )
    return dict(comments = [prepare_comment(x) for x in comments])

def prepare_reply(reply):
    return dict(
        author = dict(
            name = reply.user.get_full_name(),
            userpic = reply.user.get_userpic(),
        ),
        text = x.text,
    )

def prepare_comment(comment):
    return dict(
        author = dict(
            name = comment.user.get_full_name(),
            userpic = comment.user.get_userpic(),
        ),
        text = x.text,
        replies = [prepare_reply(x) for x in comment.reply_set.filter(active=1)],
    )

@require_auth
@return_json
def send_comment(request):
    return dict()

@require_auth
@return_json
def send_reply(request):
    return dict()




