from time import sleep

__author__ = 'Alexey'

import pymongo
import stackpy

site = stackpy.Site('stackoverflow')

def run_task(db, task_id):
    # update node (status -> inprocess)
    # update task (node_id, status -> inprocess)

    # get task params
    task_params = dict() # TODO get from db
    # to do task
    module_so = db[task_params['output_collection']]
    try:
        i = 0
        for question in site.search('advanced').pagesize(100).url(task_params['search_url_query']).filter('_bca'):
            i += 1
            question._data['module_id'] = task_params['module_id']
            module_so.insert(question._data)
            # print '%d --- %s ---' % (i, question.title)
            # if i >= 100:
            #     break
            # print '.',
        print i
    except stackpy.url.APIError as ex:
        print ex._error_message
    # update task (status -> completed, results -> addresses)
    # update node (status -> idle, task_id -> None)
    pass

import getopt, sys
def main():
    # try:
    #     opts, args = getopt.getopt(sys.argv[1:], "ho:v", ["help", "dbIp=", 'dbName='])
    # except getopt.GetoptError as err:
    #     # print help information and exit:
    #     print str(err) # will print something like "option -a not recognized"
    #     # usage()
    #     sys.exit(2)
    # output = None
    # verbose = False
    # for o, a in opts:
    #     if o == "-v":
    #         verbose = True
    #     elif o in ("-h", "--help"):
    #         # usage()
    #         sys.exit()
    #     elif o in ("-o", "--output"):
    #         output = a
    #     else:
    #         assert False, "unhandled option"
    #     # ...
    # gets from args
    db_ip = ''
    db_name = ''

    mongoConn = pymongo.MongoClient(db_ip, 27017)

    db = mongoConn[db_name]
    tasks = db['tasks']
    nodes = db['nodes']

    curr_node = {
        'task_id': None,
        'status': 'init'
    }
    node_id = nodes.insert(curr_node)

    while True:
        curr_node = nodes.find_one({'_id': node_id})

        status = curr_node['status']
        if status in ['init', 'idle']:
            sleep(5)
        elif status == 'assign':
            run_task(db, curr_node['task_id'])

    mongoConn.close()

if __name__ == "__main__":
    main()