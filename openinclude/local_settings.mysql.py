DEBUG = True
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': "openinclude",                      # Or path to database file if using sqlite3.
        'USER': 'root',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}


# Github oauth settings
CLIENT_ID = "234786241ad0cd94fce3"
CLIENT_SECRET = "4fd8f415a013eb08691458bdc89be5d281cabd53"
REDIRECT_URL = "http://127.0.0.1:8000/member/after_login/"
