__author__ = 'Alexey'

# from stackpy import Site
#
# site = Site('stackoverflow')
# question = site.questions(1732348).filter('withbody')[0]
#
# print '--- %s ---' % question.title
# print question.body

import stackexchange
import codecs
import pymongo

MONGODB_IP = 'ec2-107-20-8-160.compute-1.amazonaws.com'

def get_all_question(file):
    i=0
    for q in so.recent_questions():#unanswered():
        i+=1
        file.write(u'%d. %s\n\tTAGS: ' % (i, q.title))
        for tag in q.tags:
            file.write( tag + u', ')
        file.write(u'\n')
        print i, q.title
        if i>= 1000:
            break

so = stackexchange.Site(stackexchange.StackOverflow)

#mongoConn = pymongo.MongoClient(MONGODB_IP, 27017)
mongoConn = pymongo.MongoClient()

db = mongoConn['openIncludeCopy']
modules = db['modules']
db.drop_collection('module_so')
module_so = db['module_so']

# without body
def insert_q_to_db(q, module_id):
    qd = dict()
    qd['module_id'] = module_id
    for f in q.json_ob.__dict__:
        if f[-3:] != u'url' and f != u'_params_':
            qd[f] = getattr(q.json_ob, f)
    module_so.insert(qd)

# file = codecs.open('questions_2.txt', "w", "utf-8")
# file = open('questions.txt', 'w')
for module in modules.find().sort('watchers', pymongo.DESCENDING).limit(30):
    name = str(module['module_name']).lower()
    print name,
    i = 0
    tag_search_res = so.search(**{'tagged': name})
    for q in tag_search_res:
        i+=1
        if i>= 10:
            break
    print i
    if len(tag_search_res) == 0:
        i = 0
        for q in so.search(**{'intitle': name}):
            i+=1
            insert_q_to_db(q, module['_id'])
            if i>= 10:
                break
        print i


# file.close()
# my_favourite_guy = so.user(41981)
# print my_favourite_guy.reputation.format()
# print len(my_favourite_guy.answers), 'answers'

print so.requests_used, so.requests_left
