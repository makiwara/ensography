from django.contrib import admin
from bottle.models import Question, Answer, ViewStat

admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(ViewStat)