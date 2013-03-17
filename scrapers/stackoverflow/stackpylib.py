import calendar

__author__ = 'Alexey'

import stackpy
import pymongo
from datetime import datetime, timedelta

MONGODB_IP = 'ec2-54-225-224-68.compute-1.amazonaws.com'
site = stackpy.Site('stackoverflow')

mongoConn = pymongo.MongoClient(MONGODB_IP, 27017)
# mongoConn = pymongo.MongoClient()

def totimestamp(dt, epoch=datetime(1970,1,1)):
    td = dt - epoch
    return int(td.total_seconds())
    # return (td.microseconds + (td.seconds + td.days * 24 * 3600) * 10**6) / 1e6

db = mongoConn['openInclude']
modules = db['modules']
# db.drop_collection('module_so2')
# module_so = db['module_so2']
# try:
min_date = totimestamp(datetime.utcnow() - timedelta(weeks = 1))
for module in modules.find().limit(10):
    name = str(module['module_name']).lower()
    print name,
    i = 0
    req = site.search('advanced').pagesize(100).min(min_date).url('*github.com/*/bootstrap*').filter('_bca')
    for question in req:
        i += 1
        question._data['module_id'] = module['_id']
        # module_so.insert(question._data)
        # print '%d --- %s ---' % (i, question.title)
        # if i >= 100:
        #     break
        # print '.',
    print i
# except stackpy.url.APIError as ex:
#     print ex._error_message

