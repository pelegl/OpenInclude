__author__ = 'Alexey'

import stackpy
import pymongo

MONGODB_IP = 'ec2-107-20-8-160.compute-1.amazonaws.com'
site = stackpy.Site('stackoverflow')

#mongoConn = pymongo.MongoClient(MONGODB_IP, 27017)
mongoConn = pymongo.MongoClient()

db = mongoConn['openIncludeCopy']
modules = db['modules']
db.drop_collection('module_so2')
module_so = db['module_so2']
try:
    for module in modules.find().sort('watchers', pymongo.DESCENDING).limit(100):
        name = str(module['module_name']).lower()
        print name,
        i = 0
        for question in site.search('advanced').pagesize(100).url('*github.com/*/%s*' % name).filter('_bca'):
            i += 1
            question._data['module_id'] = module['_id']
            module_so.insert(question._data)
            # print '%d --- %s ---' % (i, question.title)
            # if i >= 100:
            #     break
            # print '.',
        print i
except stackpy.url.APIError as ex:
    print ex.message

