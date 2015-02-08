# -*- coding: utf-8 -*-

from django.db import models
from django.utils import timezone
from django.utils.http import urlquote
from django.utils.translation import ugettext_lazy as _
from django.core.mail import send_mail
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.models import BaseUserManager

from comments.models import User


# ==========================================================================================
# ==========================================================================================
# 
# COMMENTS MODELS
#
# ==========================================================================================
class Question(models.Model):
    user = models.ForeignKey(User)
    url  = models.CharField(max_length=254, blank=True)
    active = models.IntegerField(default=0)
    dt_created = models.DateTimeField(auto_now_add=True)

class Answer(models.Model):
    question = models.ForeignKey(Question)
    user = models.ForeignKey(User)
    url  = models.CharField(max_length=254, blank=True)
    active = models.IntegerField(default=0)
    dt_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "%i: %s" % (self.pk, self.url)

class ViewStat(models.Model):
    answer = models.ForeignKey(Answer)
    user = models.ForeignKey(User)
    dt_created = models.DateTimeField(auto_now_add=True)

