'''
Add all our customize and model forms here
'''
from django import forms

#
from models import Email

class EmailForm(forms.ModelForm):
    '''
    Add email form fields by hiding createt_at fields.
    '''
    class Meta:
        '''
        Add *Email model as Meta class.
        '''
        model = Email
        exclude = ('created_at')