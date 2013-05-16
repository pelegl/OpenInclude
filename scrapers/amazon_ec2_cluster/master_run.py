if __name__ == "__main__" and __package__ is None:
    import os,sys
    parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sys.path.insert(0,parentdir)
    import config
else:
    from .. import config

from ec2_tools.master_base import MasterNodeBase

CLUSTER_NODES_COUNT = 2

class MasterNode(MasterNodeBase):
    AWS_ACCESS_KEY_ID = config.AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY = config.AWS_SECRET_ACCESS_KEY

    def init(self):
        self.SSH_INIT_COMMAND += ' stackpy'
        self.db_tasks_collection = 'module_so_tasks'
        self.db_nodes_collection = 'module_so_nodes'
        self.NODE_SCRIPTS.insert(0, './node_run.py')

    def add_tasks(self, tasks_collection):
        modules_collection = self.db[config.DB_MODULES_COLLECTION]
        modules_count = 10
        tasks_created = 0
        for module in modules_collection.find({}, {'module_name': 1}).limit(modules_count):
            task_params = {
                'module_id': module['_id'],
                'module_name': module['module_name'],
                'search_type': 'tag', # 'tag', 'url', 'title'
                'output_collection': 'module_so_results_test', # TODO change name
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
    master = MasterNode(config.DB_HOST, config.DB_NAME, CLUSTER_NODES_COUNT)
    master.create_tasks()
    master.run_cluster(True)
    master.run(15)
    master.stop_cluster()

if __name__ == "__main__":
    main()
