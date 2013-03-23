__author__ = 'Alexey'

from ec2_tools.master_base import MasterNodeBase

MONGODB_IP = 'ec2-54-225-224-68.compute-1.amazonaws.com'
DB_NAME = 'openInclude'
CLUSTER_NODES_COUNT = 20

class MasterNode(MasterNodeBase):
    modules_collection_name = 'modules'

    def init(self):
        self.SSH_INIT_COMMAND += ' stackpy'
        self.db_tasks_collection = 'module_so_tasks'
        self.db_nodes_collection = 'module_so_nodes'
        self.NODE_SCRIPTS.insert(0, './node_run.py')

    def add_tasks(self, tasks_collection):
        modules_collection = self.db[self.modules_collection_name]
        # modules_count = 100
        tasks_created = 0
        for module in modules_collection.find({}, {'module_name': 1}):#.limit(modules_count):
            task_params = {
                'module_id': module['_id'],
                'module_name': module['module_name'],
                'search_type': 'tag', # 'tag', 'url', 'title'
                'output_collection': 'module_so_results', # TODO change name
                #filter
                #page_size
                #results_count
            }
            self.create_task(tasks_collection, task_params)
            tasks_created += 1
            task_params['search_type'] = 'url'
            self.create_task(tasks_collection, task_params)
            tasks_created += 1
        print '\nCreated %d tasks' % tasks_created

def main():
    master = MasterNode(MONGODB_IP, DB_NAME, CLUSTER_NODES_COUNT)
    master.create_tasks()
    master.run_cluster(True)
    master.run(15)
    master.stop_cluster()

if __name__ == "__main__":
    main()
