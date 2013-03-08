__author__ = 'Alexey'

import stackexchange
import pymongo

MONGODB_IP = 'ec2-107-20-8-160.compute-1.amazonaws.com'
DB_NAME = 'openInclude'

quest_max_count = 300

#mongoConn = pymongo.MongoClient(MONGODB_IP, 27017)
mongoConn = pymongo.MongoClient()

db = mongoConn[DB_NAME]
module_so = db['module_so']

so = stackexchange.Site(stackexchange.StackOverflow)
# so.impose_throttling = True
# so.throttle_stop = False

start_page = 0
first_question = None
last_question = None

def add_question(q, collection, additional_fields = dict()):
    qd = dict(additional_fields)
    for f in q.json_ob.__dict__:
        if f[-3:] != u'url' and f != u'_params_':
            qd[f] = getattr(q.json_ob, f)
    collection.insert(qd)

    global first_question
    if first_question == None:
        first_question = qd
    global last_question
    last_question = qd

i = 0

def get_question(page = 0):
    global i
    for q in so.questions(page=page):
        i += 1
        add_question(q, module_so)
        if i % 100 == 0:
            print i
        if i >=quest_max_count:
            return

params = db['module_so_params']
last_res = params.find().sort('stop_date', pymongo.DESCENDING).limit(1)

if last_res.count() > 0:
    res = last_res[0]
    start_page = res['start_page'] + ( res['add_count'] / 30 )
else:
    start_page = 1
import urllib2
from datetime import datetime

start_date = datetime.now()
ex = None
try:
    print start_page
    get_question(start_page)
except Exception as e:
    ex = e
all_q_count = module_so.find().count()

result = {
    'count': all_q_count,
    'add_count': i,
    'start_page': start_page,
    'start_date': start_date,
    'stop_date': datetime.now(),
    'first_question': first_question,
    'last_question':last_question
}

if ex != None:
    result['exception'] = str(ex)

params.insert(result)
print all_q_count, i