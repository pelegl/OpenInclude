#!/usr/bin/env python

#RUN THIS SCRIPT INDEPENDENT OF SCRAPY
import urllib2
import simplejson
import pymongo
import time

#retry decorator
def retry(ExceptionToCheck, tries=10, delay=5, backoff=2, logger=None):
    """Retry calling the decorated function using an exponential backoff.

    http://www.saltycrane.com/blog/2009/11/trying-out-retry-decorator-python/
    original from: http://wiki.python.org/moin/PythonDecoratorLibrary#Retry

    :param ExceptionToCheck: the exception to check. may be a tuple of
        excpetions to check
    :type ExceptionToCheck: Exception or tuple
    :param tries: number of times to try (not retry) before giving up
    :type tries: int
    :param delay: initial delay between retries in seconds
    :type delay: int
    :param backoff: backoff multiplier e.g. value of 2 will double the delay
        each retry
    :type backoff: int
    :param logger: logger to use. If None, print
    :type logger: logging.Logger instance
    """
    def deco_retry(f):
        def f_retry(*args, **kwargs):
            mtries, mdelay = tries, delay
            try_one_last_time = True
            while mtries > 1:
                try:
                    return f(*args, **kwargs)
                    try_one_last_time = False
                    break
                except ExceptionToCheck, e:
                    msg = "%s, Retrying in %d seconds..." % (str(e), mdelay)
                    if logger:
                        logger.warning(msg)
                    else:
                        print msg
                    time.sleep(mdelay)
                    mtries -= 1
                    mdelay *= backoff
            if try_one_last_time:
                return f(*args, **kwargs)
            return
        return f_retry  # true decorator
    return deco_retry
#end of retry decorator

#user agent to aoid blacklisting
USER_AGENT = 'Mozilla/5.0'
#github command line token to allow 5000 fetches per hour...non auth requests
#allowd are only 60 per hour
AUTH_TOKEN = 'token 983108819e9f8a7709d0029d66939e7f2b5122ab'

#database with language list
connection = pymongo.Connection()
db = connection['github_languages']
collection = db['language_names']

#database to save module details
data_connection = pymongo.Connection()
database = data_connection['github_modules']
modules_collection = database['modules']

#fetching the language list
lang_list = list(collection.find())
language_list = []

for lang in lang_list:
    lang_name = lang['name']
    language_list.append(lang_name)

print language_list

#headers for the request
hdr = {'User-Agent': USER_AGENT, 'Authorization': AUTH_TOKEN }

@retry((urllib2.HTTPError, urllib2.URLError), tries=10, delay=10)
def url_open_with_retry(request, opener):
    return opener.open(request)
#For each language in the language list:
for language in language_list:
    count = 1
    status = True
    while status:
        #get its repos
        address = "https://api.github.com/legacy/repos/search/:language=" + language + "?start_page=" + str(count)
        print address
        request = urllib2.Request(address, headers=hdr)
        opener = urllib2.build_opener()
        response = url_open_with_retry(request, opener)
        modules_json = simplejson.load(response)
        modules_list = modules_json['repositories']
        if modules_json['repositories'] == []:
            #stop incrementing pages if it starts returning empty results
            status = False
        else:
            #for each repo
            for module in modules_list:
                print module['username'] + "\n"
                print address
                #save its repos' details
                insert_module_details = modules_collection.insert({'module_name': module['name'], 'owner': module['owner'],
                                                                   'description': module['description'], 'language': language, 'watchers': module['watchers'],
                                                                   'pushed_at': module['pushed_at'], 'forks': module['forks'], 'created': module['created'],
                                                                   'pushed': module['pushed'], 'created': module['created'], 'is_a_fork': module['fork'],
                                                                   'followers': module['followers'], 'username':module['username']})
        count += 1


