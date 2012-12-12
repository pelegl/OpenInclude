import os
from django.conf import settings
DEBUG = True
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': os.path.join(settings.PROJECT_ROOT, 'oi.db'),                      # Or path to database file if using sqlite3.
        'USER': '',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}

# Github oauth settings
CLIENT_ID = "234786241ad0cd94fce3"
CLIENT_SECRET = "4fd8f415a013eb08691458bdc89be5d281cabd53"
REDIRECT_URL = "http://127.0.0.1:8000/member/after_login/"
CLIENT_ID = "f416583827e22efa2986"
CLIENT_SECRET = "a7ef060d3a669a568dd97f994eaa47ec27a993f3"
REDIRECT_URL = "http://ec2-184-73-51-98.compute-1.amazonaws.com/member/after_login/"
