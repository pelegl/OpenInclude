import urllib2
import urllib
from django.conf import settings
import json


class OAuth:
    def __init__(self):
        self.token = None


class GithubOAuth(OAuth):

    def get_token(self, code):
        url = "https://github.com/login/oauth/access_token"
        params = {
            "client_id": settings.CLIENT_ID,
            "client_secret": settings.CLIENT_SECRET,
            "code": code,
        }
        hp = urllib2.urlopen(url, data=urllib.urlencode(params))
        resp = hp.read()
        hp.close()
        token, bearer = resp.split("&")
        self.token = token.split("=")[-1]

    def get_user_info(self):
        url = "https://api.github.com/user?access_token=%s" % self.token
        hp = urllib2.urlopen(url)
        resp = hp.read()
        hp.close()
        return self.decode_resp(resp)

    def decode_resp(self, resp):
        data = json.loads(resp)
        return data
