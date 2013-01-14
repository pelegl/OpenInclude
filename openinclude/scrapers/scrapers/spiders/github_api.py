import urllib2
import simplejson
import pymongo

connection = pymongo.Connection()
db = connection['list']
collection = db['names']

data_connection = pymongo.Connection()
database = data_connection['modules']
modules_collection = database['records']

lang_list = list(collection.find())
language_list = []

for lang in lang_list:
    lang_name = lang['name']
    language_list.append(lang_name)

print language_list
hdr = {'User-Agent': 'Mozilla/5.0', 'Authorization': 'token 983108819e9f8a7709d0029d66939e7f2b5122ab' }
#List of languages fetched by the scraper
for language in language_list:
    count = 1
    status = True
    while status:
        address = "https://api.github.com/legacy/repos/search/:language=" + language + "?start_page=" + str(count)
        print address
        request = urllib2.Request(address, headers=hdr)
        opener = urllib2.build_opener()
        response = opener.open(request)
        modules_json = simplejson.load(response)
        modules_list = modules_json['repositories']
        if modules_json['repositories'] == []:
            status = False
        else:
            for module in modules_list:
                print module['username'] + "\n"
                print address
                insert_module_details = modules_collection.insert({'module_name': module['name'], 'owner': module['owner'],
                                                                   'description': module['description'], 'language': language})
        count += 1

