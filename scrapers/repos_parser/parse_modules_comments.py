import logging
import os
from pprint import pprint
import sys
import time
from pyes.exceptions import NoServerAvailable
from CommentStripper.parse_comments import ParseComments

if __name__ == "__main__" and __package__ is None:
    import os,sys
    parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sys.path.insert(0,parentdir)
    import config
else:
    from .. import config

import traceback
from updater_base import ModulesUpdaterBase
from elastic_search import ESIndex

__author__ = 'Alexey'

class ParseModuleComments(ModulesUpdaterBase):
    name = 'ParseComments'

    def init(self, new_ind):
        self.parser = ParseComments()
        self.es = ESIndex()
        if new_ind: self.clear_index()

    def clear_index(self):
        print 'Create Index'
        # self.es.create_index()

    def update_module(self, num, module_info):
        repo_dir_exist, path = self.check_repo_dir_exist(module_info)
        if repo_dir_exist:
            self.es.add_module(module_info)
            self.indexed_size = 0
            def index_comments(comments, comments_size):
                if not comments_size:
                    return True
                print '+',
                while True:
                    try:
                        self.es.update_part(module_info, comments)
                        self.indexed_size += comments_size
                        print self.indexed_size
                        break
                    except NoServerAvailable:
                        print 'Elastic Search Server Not Available'
                        logging.error('Elastic Search Server Not Available')
                        time.sleep(5)
                        self.es.connect()
                if self.indexed_size > config.COMMENTS_PARSE_MAXCOMMENTS_SIZE:
                    print 'Size Limit, indexing stop'
                    return False
                return True
            self.parser.parse_dir_partly(path, index_comments, config.COMMENTS_PARSE_MAXFILES, config.COMMENTS_PARSE_MAXCOMMENTS_SIZE / 10)
            print '\n\tDone!'
        else:
            logging.error('Repo not found: %s/%s' % (module_info['owner'], module_info['module_name']))
            print 'Repo not found'

    def final(self):
        self.parser.print_statistics()

if __name__ == "__main__":
    new_ind = 'new' in sys.argv
    # new_ind = True
    LIMIT = None
    u = ParseModuleComments()
    logging.basicConfig(filename=os.path.join(config.LOG_PATH, '%s.%d.log' % (u.name, int(time.time()))), filemode='w', level=logging.INFO)
    u.main(new_ind, LIMIT)
    u.final()
