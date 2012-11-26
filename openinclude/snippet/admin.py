from django.contrib import admin

from models import UserSnippet

class UserSnippetAdmin(admin.ModelAdmin):
    pass

admin.site.register(UserSnippet, UserSnippetAdmin)

