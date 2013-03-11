__author__ = 'Alexey'

class Task:
    STATUS_NEW = 'new'
    STATUS_ASSIGN = 'assign'
    STATUS_INPROGRESS = 'inprocess'
    STATUS_COMPLETED = 'completed'
    STATUS_ERROR = 'error'

class Node:
    STATUS_INIT = 'init'
    STATUS_IDLE = 'idle'
    STATUS_ASSIGN = 'assign'
    STATUS_INPROGRESS = 'inprocess'
    STATUS_STOP = 'stop'
    STATUS_DEAD = 'dead'
    STATUS_API_LIMIT = 'api_limit'