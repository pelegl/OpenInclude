from time import sleep

__author__ = 'Alexey'

import pymongo
from cluster_types import Task
import cluster_types

MONGODB_IP = 'ec2-54-225-224-68.compute-1.amazonaws.com'
DB_NAME = 'openInclude'
NODE_SCRIPTS = ['./node_run.py', './cluster_types.py']
SSH_INIT_COMMAND = 'sudo aptitude -y install python-setuptools; sudo easy_install pymongo stackpy'

NODE_SCRIPT_PARAMS = '--dbIp=%s --dbName=%s --dbTasks=%s --dbNodes=%s' % (MONGODB_IP, DB_NAME, 'module_so_tasks', 'module_so_nodes')

import sys
sys.path.append( 'D:/Projects/ec2_tools' )
import ec2

CLUSTER_NAME = "alpha"
CLUSTER_NODES_COUNT = 15

class MasterNode():
    def __init__(self, db_ip, db_name):
        self.mongoConn = pymongo.MongoClient(db_ip, 27017)
        self.db = self.mongoConn[db_name]

    def create_task(self, tasks_collection, task_params):
        task = {
            'params': task_params,
            'node_id': '',
            'status': Task.STATUS_NEW, # assign, inprocess, completed, error
            'result': []
        }
        tasks_collection.insert(task)

    def create_tasks(self, tasks_collection, modules_collection):
        # nodes_count = 2
        modules_count = 20 # TODO get_all_modules_count

        i = 0
        for module in modules_collection.find().sort('watchers', pymongo.DESCENDING):#.limit(modules_count):
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

    def run_cluster(self, create=True):
        if create:
            ec2.create(CLUSTER_NAME, CLUSTER_NODES_COUNT, 't1.micro')

            cluster = None
            while cluster == None:
                cluster = ec2.get_cluster(CLUSTER_NAME)
                if cluster == None:
                    print 'cluster is creating...'
                    sleep(5)

            while 1 == ec2.ssh(CLUSTER_NAME, CLUSTER_NODES_COUNT-1, 'uname'):
                print 'last node is starting...'
                sleep(5)

            ec2.ssh_all(CLUSTER_NAME, SSH_INIT_COMMAND, background=False)

        for f in NODE_SCRIPTS:
            ec2.scp_all(CLUSTER_NAME, f)

        ec2.ssh_all(CLUSTER_NAME, 'python ' + NODE_SCRIPTS[0] + ' ' + NODE_SCRIPT_PARAMS, background=True)
        print 'Ran cluster %s from %d nodes' % (CLUSTER_NAME, CLUSTER_NODES_COUNT)

    def stop_cluster(self):
        ec2.shutdown(CLUSTER_NAME)

    def make_final_result(self):
        pass

    def get_nodes(self, statuses):
        return self.nodes.find({
            'status': {
                '$in': statuses
            }
        })

    def get_tasks(self, statuses, limit = None):
        if limit != None:
            return self.tasks.find({
                'status': {
                    '$in': statuses
                }
            }).limit(limit)
        else:
            return self.tasks.find({
                'status': {
                    '$in': statuses
                }
            })

    def assign_task(self, node, task):
        node['task_id'] = task['_id']
        task['node_id']  = node['_id']
        node['status'] = cluster_types.Node.STATUS_ASSIGN
        task['status'] = cluster_types.Task.STATUS_ASSIGN
        self.tasks.save(task)
        self.nodes.save(node)
        print 'Assign task %s -> node %s' % (task['_id'], node['_id'])

    def run(self):
        # self.db.drop_collection('module_so_tasks')
        self.tasks = self.db['module_so_tasks']
        # modules = self.db['modules']

        # self.create_tasks(self.tasks, modules)

        # self.db.drop_collection('module_so_nodes')
        self.nodes = self.db['module_so_nodes']

        self.run_cluster()

        qus_count = self.get_tasks([Task.STATUS_COMPLETED]).count()
        while True:
            nodes_list = self.get_nodes([cluster_types.Node.STATUS_INIT, cluster_types.Node.STATUS_IDLE])
            count = nodes_list.count()
            if count > 0:
                tasks_list = self.get_tasks([Task.STATUS_NEW], count)
                if tasks_list.count() > 0:
                    i=0
                    for node in nodes_list:
                        self.assign_task(node, tasks_list[i])
                        qus_count+=1
                        print qus_count,
                        i += 1
                        if i >= tasks_list.count():
                            break
                else:
                    tasks_list = self.get_tasks([Task.STATUS_NEW, Task.STATUS_ASSIGN, Task.STATUS_INPROGRESS], 1)
                    nodes_list = self.get_nodes([cluster_types.Node.STATUS_ASSIGN, cluster_types.Node.STATUS_INPROGRESS])
                    if tasks_list.count() == 0 and nodes_list.count() == 0:
                        print 'all tasks completed'
                        break
                    else:
                        sleep(5)

                        # TODO kill nodes with status 'api_limit' and run new
            else:
                sleep(1)
        # self.stop_cluster()

        self.make_final_result()

        self.mongoConn.close()

def main():
    master = MasterNode(MONGODB_IP, DB_NAME)
    master.run()

if __name__ == "__main__":
    main()