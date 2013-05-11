#!/usr/bin/env python

# RUN THIS SCRIPT INDEPENDENT OF SCRAPY
import urllib2
import simplejson
import pymongo
import time
from retry import retry_on_exceptions

# user agent to aoid blacklisting
USER_AGENT = 'Mozilla/5.0'
# github command line token to allow 5000 fetches per hour...non auth requests
# allowd are only 60 per hour
AUTH_TOKEN = 'token f6eaceff9c2767553646f24b85306b7a2e136492'

# database with language list
connection = pymongo.Connection()
db = connection['github_languages']
collection = db['language_names']

# database to save module details
data_connection = pymongo.Connection()
database = data_connection['github_modules']
modules_collection = database['modules']

# fetching the language list
lang_list = list(collection.find())
language_list = []

for lang in lang_list:
    lang_name = lang['name']
    language_list.append(lang_name)

print language_list

# headers for the request
hdr = {'User-Agent': USER_AGENT, 'Authorization': AUTH_TOKEN }

@retry_on_exceptions(types=[urllib2.URLError, urllib2.HTTPError], tries=5, delay=5)
def fetch(opener, request):
    return opener.open(request)

# For each language in the language list:
for language in language_list:
    count = 1
    status = True
    while status:
        # get its repos
        address = "https://api.github.com/legacy/repos/search/:language=" + language + "?start_page=" + str(count)
        print address
        request = urllib2.Request(address, headers=hdr)
        opener = urllib2.build_opener()
        response = fetch(opener, request)
        modules_json = simplejson.load(response)
        modules_list = modules_json['repositories']
        modules = list(modules_collection.find())
        mod_list = []
        for mod in modules:
            mod_list.append(mod['module_name'])
        if modules_json['repositories'] == []:
            # stop incrementing pages if it starts returning empty results
            status = False
        else:
            # for each repo
            for module in modules_list:
                print module['username'] + "\n"
                print address
                # save its repos' details
                if module['fork'] == "true":
                    pass
                elif module['name'] in mod_list:
                    pass
                else:
                    insert_module_details = modules_collection.insert({'module_name': module['name'], 'owner': module['owner'],
                                                                   'description': module['description'], 'language': language, 'watchers': module['watchers'],
                                                                   'pushed_at': module['pushed_at'], 'forks': module['forks'], 'created': module['created'],
                                                                   'pushed': module['pushed'], 'created': module['created'], 'is_a_fork': module['fork'],
                                                                   'followers': module['followers'], 'username':module['username']})
        count += 1

