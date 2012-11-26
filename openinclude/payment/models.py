'''
Create your models here.
'''
from django.db import models
from djangosphinx import SphinxSearch

# import our local imports here
from django.contrib.auth.models import User
from member.models import Member

class PaymentManager(models.Manager):
    pass

class Payment(models.Model):
    """Payment model
    """
    member = models.ForeignKey(Member, related_name="PaymentMember")
    amount = models.FloatField()
    pay_time = models.DateTimeField()

    objects = PaymentManager()
    
    def __unicode__(self):
        return self.member
