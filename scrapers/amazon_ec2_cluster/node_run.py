__author__ = 'Alexey'

import stackpy
import sys
from cluster_types import NodeBase

class Node(NodeBase):
    site = stackpy.Site('stackoverflow')

    def work(self, params):
        output_collection = self.db[params['output_collection']]
        i = 0
        for question in self.site.search('advanced').pagesize(100).url(params['search_url_query']).filter('_bca'):
            i += 1
            question._data['module_id'] = params['module_id']
            output_collection.insert(question._data)
        message = 'M:%s-%d' % (params['module_id'], i)
        return message

def main():
    node = Node()
    node.getopt(sys.argv)
    node.run()

if __name__ == "__main__":
    main()