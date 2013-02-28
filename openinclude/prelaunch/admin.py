from django.contrib import admin

from models import Email

class EmailAdmin(admin.ModelAdmin):
    pass

admin.site.register(Email, EmailAdmin)

