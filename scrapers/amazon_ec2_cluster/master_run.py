__author__ = 'Alexey'

import pymongo
from cluster_types import Task
from master_base import MasterNodeBase

MONGODB_IP = 'ec2-54-225-224-68.compute-1.amazonaws.com'
# MONGODB_IP = 'localhost'
DB_NAME = 'openInclude'
CLUSTER_NODES_COUNT = 13

class MasterNode(MasterNodeBase):
    modules_collection_name = 'modules'

    def init(self):
        self.SSH_INIT_COMMAND += ' stackpy'
        self.db_tasks_collection = 'module_so_tasks'
        self.db_nodes_collection = 'module_so_nodes'

    def add_tasks(self, tasks_collection):
        modules_collection = self.db[self.modules_collection_name]
        modules_count = 20
        i = 0
        for module in modules_collection.find().sort('watchers', pymongo.DESCENDING).limit(modules_count):
            name = str(module['module_name']).lower()
            print name,
            search_url_query = '*github.com/*/%s*' % name
            task_params = {
                'search_url_query': search_url_query,
                'module_id': module['_id'],
                'output_collection': 'module_so_test', # TODO change name
                #filter
                #page_size
                #results_count
            }
            self.create_task(tasks_collection, task_params)
            i+=1
        print '\nCreated %d tasks' % i

def main():
    master = MasterNode(MONGODB_IP, DB_NAME, CLUSTER_NODES_COUNT)
    # master.create_tasks()
    master.run_cluster(False)
    master.run()
    # master.stop_cluster()

if __name__ == "__main__":
    main()