__author__ = 'Alexey'

from time import sleep
import pymongo
import sys
from datetime import datetime
import getopt

class Task:
    STATUS_NEW = 'new'
    STATUS_ASSIGN = 'assign'
    STATUS_INPROGRESS = 'inprocess'
    STATUS_COMPLETED = 'completed'
    STATUS_ERROR = 'error'

class NodeBase:
    STATUS_INIT = 'init'
    STATUS_IDLE = 'idle'
    STATUS_ASSIGN = 'assign'
    STATUS_INPROGRESS = 'inprocess'
    STATUS_STOP = 'stop'
    STATUS_DEAD = 'dead'
    STATUS_API_LIMIT = 'api_limit'

    db_ip = 'localhost'
    db_name = 'cluster_test'
    db_tasks_collection = 'cluster_tasks'
    db_nodes_collection = 'cluster_nodes'

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
            curr_node['logs'].append('%s:%s' % (datetime.now().strftime("%H:%M:%S"), message))
        curr_node['logs'].append('%s:%s->%s' % (datetime.now().strftime("%H:%M:%S"), curr_node['status'], status))
        curr_node['status'] = status
        self.nodes.save(curr_node)

    def work(self, params):
        pass

    def run_task(self, task_id):
        # update node (status -> inprocess)
        self.update_curr_node_status(NodeBase.STATUS_INPROGRESS)

        # update task (node_id, status -> inprocess)
        task = self.tasks.find_one({'_id': task_id})
        task['status'] = Task.STATUS_INPROGRESS
        task['node_id'] = self.node_id
        self.tasks.save(task)

        # get task params
        task_params = task['params']
        # to do task
        try:
            res_str = self.work(task_params)
            message = 'T:%s;%s' % (task['_id'], res_str)
            task['result'].append(message)
            task['status'] = Task.STATUS_COMPLETED
            self.tasks.save(task)
            # update node (status -> idle, task_id -> None)
            self.update_curr_node_status(NodeBase.STATUS_IDLE, message)
        except Exception as ex:
            # update task (status -> completed, results -> addresses)
            task['result'].append(str(ex))
            task['status'] = Task.STATUS_ERROR
            self.tasks.save(task)
            # update node (status -> idle, task_id -> None)
            self.update_curr_node_status(NodeBase.STATUS_API_LIMIT, str(ex))

    def usage(self):
        print "-i", "--dbIp", "mongoDB ip address"
        print "-d", "--dbName", "database name"
        print "-t", "--dbTasks", "collection name for tasks"
        print "-n", "--dbNodes", "collection name for nodes"

    def getopt(self, argv):
        try:
            opts, args = getopt.getopt(argv[1:], "hi:d:t:n:v", ["help", "dbIp=", 'dbName=', 'dbTasks=', 'dbNodes='])
        except getopt.GetoptError as err:
            # print help information and exit:
            print str(err) # will print something like "option -a not recognized"
            self.usage()
            sys.exit(2)
        verbose = False
        for o, a in opts:
            if o == "-v":
                verbose = True
            elif o in ("-h", "--help"):
                self.usage()
                sys.exit()
            elif o in ("-i", "--dbIp"):
                self.db_ip = a
            elif o in ("-d", "--dbName"):
                self.db_name = a
            elif o in ("-t", "--dbTasks"):
                self.db_tasks_collection = a
            elif o in ("-n", "--dbNodes"):
                self.db_nodes_collection = a
            else:
                print "unhandled option", o

        print self.db_ip, self.db_name, self.db_tasks_collection, self.db_nodes_collection

    def init(self):
        self.mongoConn = pymongo.MongoClient(self.db_ip, 27017)

        self.db = self.mongoConn[self.db_name]
        self.tasks = self.db[self.db_tasks_collection]
        self.nodes = self.db[self.db_nodes_collection]

        curr_node = {
            'task_id': None,
            'status': NodeBase.STATUS_INIT,
            'logs': ['%s: create node' % str(datetime.now())]
        }
        self.node_id = self.nodes.insert(curr_node)

    def run(self):
        self.init()
        while True:
            curr_node = self.get_curr_node()
            status = curr_node['status']
            if status == NodeBase.STATUS_ASSIGN:
                self.run_task(curr_node['task_id'])
            elif status == NodeBase.STATUS_STOP:
                break
            elif status == NodeBase.STATUS_INIT:
                self.update_curr_node_status(NodeBase.STATUS_IDLE)
            sleep(0.1)

        self.update_curr_node_status(NodeBase.STATUS_DEAD)
        self.mongoConn.close()

import sys
sys.path.append( 'D:/Projects/ec2_tools' )
import ec2

class MasterNodeBase():
    db_ip = 'localhost'
    db_name = 'cluster_test'
    db_tasks_collection = 'cluster_tasks'
    db_nodes_collection = 'cluster_nodes'

    NODE_SCRIPTS = ['./node_run.py', './cluster_types.py']
    SSH_INIT_COMMAND = 'sudo aptitude -y install python-setuptools; sudo easy_install pymongo'

    CLUSTER_NAME = "alpha"
    db = None
    nodes = None
    tasks = None

    def init(self):
        pass

    def __init__(self, db_ip, db_name, nodes_count):
        self.db_ip = db_ip
        self.db_name = db_name

        self.init()

        self.NODE_SCRIPT_PARAMS = '--dbIp=%s --dbName=%s --dbTasks=%s --dbNodes=%s' % \
                                  (self.db_ip, self.db_name, self.db_tasks_collection, self.db_nodes_collection)

        self.CLUSTER_NODES_COUNT = nodes_count

        self.mongoConn = pymongo.MongoClient(self.db_ip, 27017)
        self.db = self.mongoConn[self.db_name]
        self.tasks = self.db[self.db_tasks_collection]
        self.nodes = self.db[self.db_nodes_collection]

    def create_task(self, tasks_collection, task_params):
        task = {
            'params': task_params,
            'node_id': '',
            'status': Task.STATUS_NEW, # assign, inprocess, completed, error
            'result': []
        }
        tasks_collection.insert(task)

    def add_tasks(self, tasks_collection):
        pass

    def create_tasks(self):
        self.db.drop_collection(self.db_tasks_collection)
        self.tasks = self.db[self.db_tasks_collection]
        self.add_tasks(self.tasks)

    def run_cluster(self, create=True):
        if create:
            self.db.drop_collection(self.db_nodes_collection)
            self.nodes = self.db[self.db_nodes_collection]

            ec2.create(self.CLUSTER_NAME, self.CLUSTER_NODES_COUNT, 't1.micro')

            cluster = None
            while cluster == None:
                cluster = ec2.get_cluster(self.CLUSTER_NAME)
                if cluster == None:
                    print 'cluster is creating...'
                    sleep(5)

            while 1 == ec2.ssh(self.CLUSTER_NAME, self.CLUSTER_NODES_COUNT-1, 'uname'):
                print 'last node is starting...'
                sleep(5)

            ec2.ssh_all(self.CLUSTER_NAME, self.SSH_INIT_COMMAND, background=False)

        for f in self.NODE_SCRIPTS:
            ec2.scp_all(self.CLUSTER_NAME, f)

        ec2.ssh_all(self.CLUSTER_NAME, 'python ' + self.NODE_SCRIPTS[0] + ' ' + self.NODE_SCRIPT_PARAMS, background=True)
        print 'Ran cluster %s from %d nodes' % (self.CLUSTER_NAME, self.CLUSTER_NODES_COUNT)

    def stop_cluster(self):
        ec2.shutdown(self.CLUSTER_NAME)

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
        node['status'] = NodeBase.STATUS_ASSIGN
        task['status'] = Task.STATUS_ASSIGN
        self.tasks.save(task)
        self.nodes.save(node)
        print 'Assign task %s -> node %s' % (task['_id'], node['_id']),

    def init_all_nodes(self):
        self.nodes.update({
            'status': {
                '$in': [NodeBase.STATUS_IDLE,
                        NodeBase.STATUS_ASSIGN, NodeBase.STATUS_INPROGRESS]
            }}, {
            '$set': {
                'status': NodeBase.STATUS_INIT}})

    def run(self):
        self.init_all_nodes()
        qus_count = self.get_tasks([Task.STATUS_COMPLETED]).count()
        while True:
            nodes_list = self.get_nodes([NodeBase.STATUS_IDLE])
            count = nodes_list.count()
            if count > 0:
                tasks_list = self.get_tasks([Task.STATUS_NEW], count)
                if tasks_list.count() > 0:
                    i=0
                    for node in nodes_list:
                        print '\n', qus_count,
                        self.assign_task(node, tasks_list[i])
                        qus_count+=1
                        i += 1
                        if i >= tasks_list.count():
                            break
                else:
                    tasks_list = self.get_tasks([Task.STATUS_NEW, Task.STATUS_ASSIGN, Task.STATUS_INPROGRESS], 1)
                    nodes_list = self.get_nodes([NodeBase.STATUS_ASSIGN, NodeBase.STATUS_INPROGRESS])
                    if tasks_list.count() == 0 and nodes_list.count() == 0:
                        print '\nall tasks completed'
                        break
            else:
                nodes_list = self.get_nodes([NodeBase.STATUS_IDLE,
                                             NodeBase.STATUS_ASSIGN, NodeBase.STATUS_INPROGRESS])
                if nodes_list.count() == 0:
                    print '----'
                    sleep(5)
                    nodes_list = self.get_nodes([NodeBase.STATUS_IDLE,
                                                 NodeBase.STATUS_ASSIGN, NodeBase.STATUS_INPROGRESS])
                    if nodes_list.count() == 0:
                        print '\nall nodes died'
                        break
                        # TODO kill nodes with status 'api_limit' and run new
            print '.',
            sleep(0.1)

        self.make_final_result()

        self.mongoConn.close()

