DEBUG = False
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
REDIRECT_URL = "http://127.0.0.1:8000/member/after_login/"
CLIENT_ID = "f416583827e22efa2986"
CLIENT_SECRET = "a7ef060d3a669a568dd97f994eaa47ec27a993f3"
REDIRECT_URL = "http://openinclude.com/member/after_login/"
