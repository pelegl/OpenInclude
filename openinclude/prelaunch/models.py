from datetime import datetime
from django.db import models


class Email(models.Model):
    """Email model
    """
    email = models.CharField(max_length=30)
    created_at = models.DateTimeField(default=datetime.utcnow())

    def __unicode__(self):
        return "%s" % self.email