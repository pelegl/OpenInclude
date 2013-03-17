import pymongo

__author__ = 'Alexey'

MONGODB_IP = 'ec2-54-225-224-68.compute-1.amazonaws.com'
# MONGODB_IP = 'localhost'
DB_NAME = 'openInclude'

mongoConn = pymongo.MongoClient(MONGODB_IP, 27017)
db = mongoConn[DB_NAME]
questions = db['module_so_test']
for q in questions.find():
    if 'question_id' in q:
        questions.remove(q['_id'])
        q['_id'] = q.pop('question_id')
        id = q.pop('_id')
        module_id = q.pop('module_id')
        try:
            questions.update({'_id': id}, {'$set': q, '$addToSet': {'module_id': module_id}}, True)
        except pymongo.errors.OperationFailure:
            module_ids = [module_id]
            for qq in questions.find({'_id': id}):
                module_ids.append(qq['module_id'])
            q['module_id'] = module_ids
            questions.update({'_id': id}, {'$set': q})
