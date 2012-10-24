'''
Add all our customize and model forms here
'''
from django import forms

#
from models import UserSnippet

class SnippetForm(forms.ModelForm):
    '''
    Add snippet form fields by hiding user, approved and 
    createt_at fields.
    '''
    class Meta:
        '''
        Add *UserSnippet model as Meta class.
        '''
        model = UserSnippet
        exclude = ('user',
                   'approved',
                   'created_at')