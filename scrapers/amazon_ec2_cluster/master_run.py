from time import sleep

__author__ = 'Alexey'

import pymongo

MONGODB_IP = 'ec2-54-225-224-68.compute-1.amazonaws.com'
DB_NAME = 'openInclude'
NODE_SCRIPTS = ['./node_run.py']

def create_task(tasks_collection, task_params):
    task = {
        'params': task_params,
        'node_id': '',
        'status': 'new', # assign, inprocess, completed, error
        'result': []
    }
    tasks_collection.insert(task)

def create_tasks(tasks_collection, modules_collection):
    # nodes_count = 2
    modules_count = 10 # TODO get_all_modules_count

    for module in modules_collection.find().sort('watchers', pymongo.DESCENDING).limit(modules_count):
        name = str(module['module_name']).lower()
        print name,
        i = 0
        search_url_query = '*github.com/*/%s*' % name
        task_params = {
            'search_url_query': search_url_query,
            'module_id': module['_id'],
            'output_collection': 'module_so_test', # TODO change name
            #filter
            #page_size
            #results_count
        }
        create_task(tasks_collection, task_params)

def run_cluster():
    pass

def stop_cluster():
    pass

def make_final_result():
    pass

def get_nodes(statuses):
    pass

def get_tasks(statuses):
    pass

def assign_task(node, task):
    pass

def main():
    mongoConn = pymongo.MongoClient(MONGODB_IP, 27017)

    db = mongoConn[DB_NAME]
    db.drop_collection('module_so_tasks')
    tasks = db['module_so_tasks']
    modules = db['modules']

    create_tasks(tasks, modules)

    db.drop_collection('module_so_nodes')
    nodes = db['module_so_nodes']

    run_cluster()

    while True:
        nodes_list = get_nodes(['init', 'idle']) # assign, inprocess, api_limit
        tasks_list = get_tasks(['new'])
        if len(nodes_list)>0 and len(tasks_list)>0:
            i=0
            for node in nodes_list:
                assign_task(node, tasks_list[i])
                i += 1
        elif len(tasks_list) > 0:
            sleep(5)
        else:
            t = get_tasks(['new', 'assign', 'inprocess'])
            n = get_nodes(['assign', 'inprocess'])
            if len(t) == 0 and len(n) == 0:
                # all tasks completed
                break
            else:
                sleep(5)

        # TODO kill nodes with status 'api_limit' and run new

    stop_cluster()

    make_final_result()

    mongoConn.close()

if __name__ == "__main__":
    main()