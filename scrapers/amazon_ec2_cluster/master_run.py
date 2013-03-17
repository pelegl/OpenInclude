import re

__author__ = 'Alexey'

import pymongo
from ec2_tools.cluster_types import Task
from ec2_tools.master_base import MasterNodeBase

MONGODB_IP = 'ec2-54-225-224-68.compute-1.amazonaws.com'
DB_NAME = 'openInclude'
CLUSTER_NODES_COUNT = 5

class MasterNode(MasterNodeBase):
    modules_collection_name = 'modules'

    def init(self):
        self.SSH_INIT_COMMAND += ' stackpy'
        self.db_tasks_collection = 'module_so_tasks_tag'
        self.db_nodes_collection = 'module_so_nodes'
        self.NODE_SCRIPTS.insert(0, './node_run.py')

    # def add_update_tasks(self, tasks_collection):
    #     i = 0
    #     for prev_task in self.db['module_so_tasks'].find({'status': Task.STATUS_COMPLETED}):
    #         prev_task_params = prev_task['params']
    #         result = prev_task['result'][-1]
    #         r = re.findall(r'\d+ question$', result)
    #         q_count = 0
    #         if len(r) != 0:
    #             q_count = int(re.findall(r'\d+', r[0])[0])
    #         else:
    #             q_count = int(re.findall('-\d+$', result)[0][1:])
    #         if q_count > 0:
    #             # page = 1
    #             # if 'page' in prev_task_params:
    #             #     page = prev_task_params['page']
    #             task_params = {
    #                 'type': 'new',
    #                 'search_url_query': prev_task_params['search_url_query'],
    #                 'module_id': prev_task_params['module_id'],
    #                 'output_collection': 'module_so_questions', # TODO change name
    #                 # 'page': page,
    #                 'prev_task': prev_task
    #                 #filter
    #                 #page_size
    #                 #results_count
    #             }
    #             self.create_task(tasks_collection, task_params)
    #             i += 1
    #     print '\nCreated %d tasks' % i

    def add_tasks(self, tasks_collection):
        # return self.add_update_tasks(tasks_collection)
        modules_collection = self.db[self.modules_collection_name]
        modules_count = 1000
        tasks_created = 0
        for module in modules_collection.find({}, {'module_name': 1}).limit(modules_count):
            # name = str(module['module_name']).lower()
            # print name,
            # search_url_query = '*github.com/*/%s*' % name
            task_params = {
                # 'search_url_query': search_url_query,
                'module_id': module['_id'],
                'module_name': module['module_name'],
                'search_type': 'tag', # 'url', 'title'
                'output_collection': 'module_so_tag', # TODO change name
                #filter
                #page_size
                #results_count
            }
            self.create_task(tasks_collection, task_params)
            tasks_created += 1
        print '\nCreated %d tasks' % tasks_created

def main():
    master = MasterNode(MONGODB_IP, DB_NAME, CLUSTER_NODES_COUNT)
    master.create_tasks()
    # master.run_cluster(True)
    master.run(5)
    # master.stop_cluster()

if __name__ == "__main__":
    main()
