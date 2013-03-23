__author__ = 'Alexey'

import stackpy
import sys
# from ec2_tools.cluster_types import NodeBase
from cluster_types import NodeBase
from datetime import datetime,timedelta

def totimestamp(dt, epoch = datetime(1970, 1, 1)):
    td = dt - epoch
    return int(td.total_seconds())

class Node(NodeBase):
    site = stackpy.Site('stackoverflow')
    pagesize = 100
    max_loaded = 1000
    modules_collection_name = 'modules'

    def get_module_url(self, task_params):
        id = task_params['module_id']
        modules_collection = self.db[self.modules_collection_name]
        module = modules_collection.find_one({'_id': id}, {'module_name': 1, 'owner': 1})
        url = '*github.com/%s/%s*' % (module['owner'], module['module_name'])
        return url

    def get_module_tag(self, task_params):
        name = str(task_params['module_name']).lower()
        return name

    def search_query(self, task_params):
        req = self.site.search('advanced').pagesize(self.pagesize).filter('_bca')
        if task_params['search_type'] == 'url':
            search_url_query = self.get_module_url(task_params)
            req = req.url(search_url_query)
        elif task_params['search_type'] == 'tag':
            req = req.tagged(self.get_module_tag(task_params))
        elif task_params['search_type'] == 'title':
            req = req.title(task_params['module_name'])
        # TODO only last week
        # min_date = totimestamp(datetime.utcnow() - timedelta(weeks = 1))
        # req = req.min(min_date)
        return req

    def save_question(self, question, task_params):
        output_collection = self.db[task_params['output_collection']]
        id = question._data.pop('question_id')
        output_collection.update({'_id': id},
                                 {'$set': question._data, '$addToSet': {'module_id': task_params['module_id']}}, True)
        output_collection_stat = self.db[task_params['output_collection']+'_stat']
        output_collection_stat.insert({'question_id': id, 'module_id': task_params['module_id'], 'search_type': task_params['search_type'], 'time': totimestamp(datetime.utcnow())})


    # if params contains page number, loads only this page
    # else loads all available results
    def work(self, params):
        total = 0
        loaded = 0
        # error = ''
        # try:
        req = self.search_query(params)
        total = req['total']
        page_count = total / self.pagesize
        if total % self.pagesize != 0:
            page_count += 1
        pages = range(1, page_count + 1)
        for page in pages:
            for question in req.page(page):
                self.save_question(question, params)
                loaded += 1
            if loaded >= self.max_loaded:
                break
        # except stackpy.url.APIError as ex:
        #     error = ex._error_message

        result = {
            'module_id': params['module_id'],
            'count': loaded,
            'total': total,
            'search_type': params['search_type'],
            'date': datetime.now(),
            # 'error': error
        }
        return result


def main():
    node = Node()
    node.getopt(sys.argv)
    node.run()


if __name__ == "__main__":
    main()