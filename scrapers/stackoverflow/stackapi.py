__author__ = 'Alexey'

import stackexchange
import pymongo

MONGODB_IP = 'ec2-107-20-8-160.compute-1.amazonaws.com'
DB_NAME = 'openIncludeCopy'

#mongoConn = pymongo.MongoClient(MONGODB_IP, 27017)
mongoConn = pymongo.MongoClient()

db = mongoConn[DB_NAME]
module_so = db['module_so']

so = stackexchange.Site(stackexchange.StackOverflow)
# so.impose_throttling = True
# so.throttle_stop = False

last_page = 0
last_question = None
def add_question(q, collection, additional_fields = dict()):
    qd = dict(additional_fields)
    for f in q.json_ob.__dict__:
        if f[-3:] != u'url' and f != u'_params_':
            qd[f] = getattr(q.json_ob, f)
    collection.insert(qd)
    global last_question
    last_question = q

i = 0

def get_question(page = 0):
    global i
    for q in so.questions(page=page):
        i += 1
        add_question(q, module_so)
        print '.',
        if i % 100 == 0:
            print '\n', i,

params = db['module_so_params']
last_res = params.find().sort('date', pymongo.DESCENDING).limit(1)

if last_res.count() > 0:
    res = last_res[0]
    last_page = res['start_page'] + ( res['add_count'] / 30 )
else:
    last_page = 3150
import urllib2
from datetime import datetime
try:
    print last_page
    get_question(last_page)
except urllib2.HTTPError as e:
    all_q_count = module_so.find().count()
    add_question(last_question, params, {'count': all_q_count, 'add_count': i, 'start_page': last_page, 'date': datetime.now(), 'exeption': str(e)})
    print all_q_count, i