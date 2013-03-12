# -*- coding: utf-8 -*-
from datetime import datetime
from time import sleep

__author__ = 'Alexey'

import pymongo
from cluster_types import Task, NodeBase

import sys
sys.path.append( 'D:/Projects/ec2_tools' )
import ec2

class MasterNodeBase():
    db_ip = 'localhost'
    db_name = 'cluster_test'
    db_tasks_collection = 'cluster_tasks'
    db_nodes_collection = 'cluster_nodes'

    NODE_SCRIPTS = ['./node_run.py', './cluster_types.py']
    # NODE_SCRIPTS = ['./node_run_solid.py']
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

        ec2.ssh_all(self.CLUSTER_NAME, self.SSH_INIT_COMMAND, background=True)

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
