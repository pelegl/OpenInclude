__author__ = 'Alexey'
import getopt
import sys

def usage():
    print "-i", "--dbIp", "mongoDB ip address"
    print "-d", "--dbName", "database name"
    print "-t", "--dbTasks", "collection name for tasks"
    print "-n", "--dbNodes", "collection name for nodes"

def main():
    db_ip = 'localhost'
    db_name = 'cluster_test'
    db_tasks_collection = 'cluster_tasks'
    db_nodes_collection = 'cluster_nodes'

    try:
        opts, args = getopt.getopt(sys.argv[1:], "hi:d:t:n:v", ["help", "dbIp=", 'dbName=', 'dbTasks=', 'dbNodes='])
    except getopt.GetoptError as err:
        # print help information and exit:
        print str(err) # will print something like "option -a not recognized"
        usage()
        sys.exit(2)
    verbose = False
    for o, a in opts:
        if o == "-v":
            verbose = True
        elif o in ("-h", "--help"):
            usage()
            sys.exit()
        elif o in ("-i", "--dbIp"):
            db_ip = a
        elif o in ("-d", "--dbName"):
            db_name = a
        elif o in ("-t", "--dbTasks"):
            db_tasks_collection = a
        elif o in ("-n", "--dbNodes"):
            db_nodes_collection = a
        else:
            print "unhandled option", o

    print db_ip, db_name, db_tasks_collection, db_nodes_collection

if __name__ == "__main__":
    main()