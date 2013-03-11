from time import sleep

__author__ = 'Alexey'

import pymongo
import stackpy
import sys
from datetime import datetime

from cluster_types import Task

class Node():
    site = stackpy.Site('stackoverflow')
    db = None
    node_id = None
    nodes = None
    tasks = None

    def get_curr_node(self):
        curr_node = self.nodes.find_one({'_id': self.node_id})
        return curr_node

    def update_curr_node_status(self, status, message = None):
        curr_node = self.get_curr_node()
        if message != None:
            curr_node['logs'].append('%s: %s' % (str(datetime.now()), message))
        curr_node['logs'].append('%s: change status %s -> %s' % (str(datetime.now()), curr_node['status'], status))
        curr_node['status'] = status
        self.nodes.save(curr_node)

    def run_task(self, task_id):
        # update node (status -> inprocess)
        self.update_curr_node_status('inprocess')

        # update task (node_id, status -> inprocess)
        task = self.tasks.find_one({'_id': task_id})
        task['status'] = Task.STATUS_INPROGRESS
        task['node_id'] = self.node_id
        self.tasks.save(task)

        # get task params
        task_params = task['params']

        # to do task
        output_collection = self.db[task_params['output_collection']]
        try:
            i = 0
            for question in self.site.search('advanced').pagesize(100).url(task_params['search_url_query']).filter('_bca'):
                i += 1
                question._data['module_id'] = task_params['module_id']
                output_collection.insert(question._data)
                # print '%d --- %s ---' % (i, question.title)
                # if i >= 100:
                #     break
                # print '.',
            # update task (status -> completed, results -> addresses)
            message = 'Got %d question' % i
            task['result'].append(message)
            task['status'] = Task.STATUS_COMPLETED
            self.tasks.save(task)
            # update node (status -> idle, task_id -> None)
            self.update_curr_node_status('idle', message)
        except stackpy.url.APIError as ex:
            # update task (status -> completed, results -> addresses)
            task['result'].append(ex._error_message)
            task['status'] = Task.STATUS_ERROR
            self.tasks.save(task)
            # update node (status -> idle, task_id -> None)
            self.update_curr_node_status('api_limit')

    def init(self, argv):
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
        # TODO gets from args
        db_ip = 'ec2-54-225-224-68.compute-1.amazonaws.com'
        # db_ip = 'localhost'
        db_name = 'openInclude'
        db_tasks_collection = 'module_so_tasks'
        db_nodes_collection = 'module_so_nodes'

        self.mongoConn = pymongo.MongoClient(db_ip, 27017)

        self.db = self.mongoConn[db_name]
        self.tasks = self.db[db_tasks_collection]
        self.nodes = self.db[db_nodes_collection]

        curr_node = {
            'task_id': None,
            'status': 'init',
            'logs': ['%s: create node' % str(datetime.now())]
        }
        self.node_id = self.nodes.insert(curr_node)

    def run(self):
        while True:
            curr_node = self.get_curr_node()
            status = curr_node['status']
            if status == 'assign':
                self.run_task(curr_node['task_id'])
                # if status in ['init', 'idle', 'api_limit']:
            elif status == 'stop':
                break
            sleep(5)

        self.update_curr_node_status('dead')
        self.mongoConn.close()

def main():
    node = Node()
    node.init(sys.argv)
    node.run()

if __name__ == "__main__":
    main()