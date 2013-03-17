import re
import pymongo

__author__ = 'Alexey'

MONGODB_IP = 'ec2-54-225-224-68.compute-1.amazonaws.com'
# MONGODB_IP = 'localhost'
DB_NAME = 'openInclude'

mongoConn = pymongo.MongoClient(MONGODB_IP, 27017)
db = mongoConn[DB_NAME]
# questions = db['module_so_questions']
# count = 0
# max_modules = 0
# max_qid = 0
# for q in questions.find():
#     a = len(q['module_id'])
#     if a > max_modules:
#         max_modules  = a
#         max_qid = q['_id']
#     count += a
# print count, max_qid

tasks = db['module_so_tasks_update2']
total_sum = 0
count_sum = 0
total_max = 0
count_max = 0
mods=[]

for task in tasks.find({},{'params': 1, 'result': 1}):
    for res in task['result']:
        vals = re.findall(r'\'(\w+)\': (\d+)', res)
        total = 0
        count = 0
        for v in vals:
            if v[0] == 'count':
                count = int(v[1])
            elif v[0] == 'total':
                total = int(v[1])
            else:
                raise Exception()
        if total > 1000:
            mods.append(task['params']['search_url_query'])
        total_sum += total
        count_sum += count
        if total > total_max:
            total_max  = total
        if count > count_max:
            count_max  = count

print total_sum, total_max, count_sum, count_max
print mods