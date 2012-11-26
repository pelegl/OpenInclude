from django.contrib import admin

from models import Tag, ProjectTag

class TagAdmin(admin.ModelAdmin):
    pass

admin.site.register(Tag, TagAdmin)

class ProjectTagAdmin(admin.ModelAdmin):
    pass

admin.site.register(ProjectTag, ProjectTagAdmin)

