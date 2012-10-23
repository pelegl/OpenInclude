'''
Create your models here.
'''
from django.db import models

# import our local imports here
from django.contrib.auth.models import User

class UserSnippet(models.Model):
    user = models.\
            ForeignKey(User)
    title = models.\
            CharField(max_length=100)
    profile_url = models.\
                    URLField(verbose_name='Profile Url',
                             help_text='(Please provide your LinedIn profile url or Github url. Example: https://github.com/XXXX)')
    code_block = models.\
                    TextField()
    license_url = models.\
                URLField(verbose_name='License Url')
    approved = models.\
                BooleanField(default=True)
    created_at = models.\
                    DateTimeField(auto_now_add=True)
    
    
    def __unicode__(self):
        return u'%s - %s' % (self.\
                                user.\
                                get_full_name(),
                                self.\
                                profile_url) 