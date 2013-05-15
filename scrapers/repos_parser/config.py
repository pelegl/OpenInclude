__author__ = 'Alexey'

DB_HOST = '54.235.108.134'
DB_NAME = 'openInclude'
DB_MODULES_COLLECTION = 'modules'
DB_COMMENTS_COLLECTION = 'module_comments_tmp2'

# user agent to aoid blacklisting
GITHUB_API_USER_AGENT = 'Mozilla/5.0'
# github command line token to allow 5000 fetches per hour...non auth requests
# allowd are only 60 per hour
GITHUB_API_AUTH_TOKENS = ['f6eaceff9c2767553646f24b85306b7a2e136492',
                          'af359bdb760bb4d912a8e1acb6cc70517c4c3ede',
                          'b94d9aaf73e2914a598d9b7a491b05ea1e077b88']

GITHUB_API_CLIENT_ID = '56d000c71b063d2ab474'
GITHUB_API_CLIENT_SECRET = '13b05edae1a5bbfa3714c333160e90cd7e3a97c3'

# try to fing repo in those dirs, new repo create in last dir
GITHUB_REPOS_CLONE_PATH = ['/repo/github', '/repo/github2']

LOG_PATH = '/repo/logs'

COMMENTS_PARSE_MAXCOMMENTS_SIZE = 50*1024*1024

COMMENTS_PARSE_MAXFILES = -1

# ES_HOST = 'ec2-54-225-224-68.compute-1.amazonaws.com:9200'
ES_HOST = '127.0.0.1:9200'
