from django.conf import settings
def context(request):
    return {
        'CLIENT_ID': settings.CLIENT_ID, 
        'CLIENT_SECRET' : settings.CLIENT_SECRET,
        'REDIRECT_URL' : settings.REDIRECT_URL,
    }
