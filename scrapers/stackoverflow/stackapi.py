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
    i = 0
    for q in so.recent_questions():#unanswered():
        i += 1
        file.write(u'%d. %s\n\tTAGS: ' % (i, q.title))
        for tag in q.tags:
            file.write(tag + u', ')
        file.write(u'\n')
        print i, q.title
        if i >= 1000:
            break


so = stackexchange.Site(stackexchange.StackOverflow)

#mongoConn = pymongo.MongoClient(MONGODB_IP, 27017)
mongoConn = pymongo.MongoClient()

db = mongoConn['openIncludeCopy']
modules = db['modules']
# db.drop_collection('module_so')
module_so = db['module_so']

# without body
def insert_q_to_db(q, module_id):
    qd = dict()
    if module_id != None:
        qd['module_id'] = module_id
    for f in q.json_ob.__dict__:
        if f[-3:] != u'url' and f != u'_params_':
            qd[f] = getattr(q.json_ob, f)

    # myq = so.question(q.id, body=True, answes=True, comments=True)
    #
    # # q.answers.fetch()
    # if len(myq.answers) > 0:
    #     print len(q.answers)

    module_so.insert(qd)

# so.impose_throttling = True
so.throttle_stop = False

# file = codecs.open('questions_2.txt', "w", "utf-8")
# file = open('questions.txt', 'w')
i = 0
for q in so.questions(page=800):
    i += 1
    insert_q_to_db(q, None)
    print '.',
    if i % 100 == 0:
        print '\n', i,
exit()
for module in modules.find().sort('watchers', pymongo.DESCENDING).skip(100).limit(100):
    name = str(module['module_name']).lower()
    # for name in ['nokogiri', 'derby', 'cubism']:
    print name,
    i = 0
    # tag_search_res = so.search(tagged=name, body=True, answes=True, comments=True)
    # for q in tag_search_res:
    #     i+=1
    #     # if i>= 10:
    #     #     break
    # print i
    # if len(tag_search_res) == 0:
    #     i = 0
    for q in so.search(intitle=name):#, body=True, answes=True, comments=True):
        i += 1
        insert_q_to_db(q, module['_id'])
        if i >= 1000:
            break
        print '.',
    print '\n', i


# file.close()
# my_favourite_guy = so.user(41981)
# print my_favourite_guy.reputation.format()
# print len(my_favourite_guy.answers), 'answers'

print so.requests_used, so.requests_left
