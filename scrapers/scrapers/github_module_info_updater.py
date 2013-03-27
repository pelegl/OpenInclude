from datetime import datetime
from time import sleep
import pymongo
import requests
from retry import retry_on_exceptions
import simplejson
import config

__author__ = 'Alexey'


class RetryException(Exception):
    pass


class GitHubUpdater():
    git_hdr = {'User-Agent': config.GITHUB_API_USER_AGENT}
    id_template = '%(user)s/%(repo)s'

    def set_token(self, id):
        self.curr_token_id = id
        self.git_hdr['Authorization'] = 'token %s' % config.GITHUB_API_AUTH_TOKENS[id]

    def next_token(self):
        self.curr_token_id += 1
        if self.curr_token_id >= len(config.GITHUB_API_AUTH_TOKENS):
            self.curr_token_id = 0
        self.git_hdr['Authorization'] = 'token %s' % config.GITHUB_API_AUTH_TOKENS[self.curr_token_id]

    def __init__(self, modules_list, update_type):
        self.modules_list = modules_list
        self.update_type = update_type
        self.set_token(0)

        mongoConn = pymongo.MongoClient(config.DB_HOST, 27017)
        db = mongoConn[config.DB_NAME]
        self.updater_cache_collection = db['github_updater']
        self.updater_cache = self.updater_cache_collection.find({'type': update_type})
        self.cache = dict()
        for i in self.updater_cache:
            self.cache[i['id']] = i

    def find_in_cache(self, id):
        if id in self.cache:
            return self.cache[id]
        else:
            return None

    def save_to_cache(self, id, res, last_modified):
        cache_item = {
            'id': id,
            'result': res,
            'Last-Modified': last_modified,
            'type': self.update_type
        }
        cache_item['_id'] = self.updater_cache_collection.insert(cache_item)

        self.cache[id] = cache_item

    @retry_on_exceptions(types=[simplejson.decoder.JSONDecodeError, RetryException], tries=5, delay=5)
    def get_request(self, base_url, id, **kwargs):
        str_id = self.id_template % id
        cache_res = self.find_in_cache(str_id)
        headers = self.git_hdr.copy()
        if cache_res != None:
            headers['If-Modified-Since'] = cache_res['Last-Modified']
        url = base_url % id
        r = requests.get(url, headers=headers, **kwargs)
        res_code = r.status_code
        if 'x-ratelimit-remaining' in r.headers:
            limit_remaining = int(r.headers['x-ratelimit-remaining'])
        else:
            limit_remaining = 5000

        print res_code, limit_remaining
        if limit_remaining < 1000:
            print 'Warning limit remaining %d requets' % limit_remaining

        if res_code == 304:
            return cache_res['result']

        res = r.json()

        if res_code == 200:
            last_modified = r.headers['Last-Modified']
            if cache_res is not None:
                cache_res['result'] = res
                cache_res['Last-Modified'] = last_modified
                self.updater_cache_collection.save(cache_res)
            else:
                self.save_to_cache(str_id, res, last_modified)
        elif res_code == 404:
            print 'Not Found', id

        if limit_remaining == 0:
            self.next_token()
            # sleep(600)
            raise RetryException()

        if limit_remaining < 10:
            sleep(120)
        elif limit_remaining < 100:
            sleep(10)
        elif limit_remaining < 1000:
            sleep(1)

        if 'message' in res:
            print 'Warning api message: %s' % res['message']
            return []
        else:
            return res

class Commits():
    def __init__(self, updater, branch_name, id):
        self.updater = updater
        self.branch_name = branch_name
        self.curr_id = id
        self.first = True
        self.last_commit = id['sha']

    def get_commits(self, branch_name, get_first = False):
        sha = self.last_comits[branch_name]
        if sha == 'END':
            return []
        payload = { 'per_page': 100, 'sha': sha }
        commits_list = self.get_request(self.commits_url, params=payload)
        last = commits_list[-1]['sha']
        if last == sha:
            last = 'END'
        self.last_comits[branch_name] = last
        if get_first:
            return commits_list
        else:
            return commits_list[1:]

    def __iter__(self):
        return self.next()

    def next(self):
        while True:
            sha = self.last_commit
            if sha == 'END':
                raise StopIteration()
            self.curr_id['sha'] = sha
            commits_list = self.updater.getbyid(self.curr_id)
            last = commits_list[-1]['sha']
            if last == sha:
                last = 'END'
            self.last_commit = last
            if self.first:
                self.first = False
            else:
                commits_list = commits_list[1:]

            for commit in commits_list:
                yield commit

class GitHubCommitsUpdater(GitHubUpdater):
    base_url = 'https://api.github.com/repos/%(user)s/%(repo)s/commits'
    id_template = '%(user)s/%(repo)s/%(sha)s'

    def __init__(self, modules_list):
        GitHubUpdater.__init__(self, modules_list, 'Commits')

    def getbyid(self, cid):
        payload = { 'per_page': 100, 'sha': cid['sha'] }
        return self.get_request(self.base_url, cid, params=payload)

    def get(self, user, repo, sha):
        id = dict(repo=repo, user=user, sha=sha)
        return self.getbyid(id)

    def get_all(self):
        res = dict()
        for module in self.modules_list:
            res[module['_id']] = self.get(module['owner'], module['module_name'])
        return res


class GitHubRepoInfoUpdater(GitHubUpdater):
    base_url = 'https://api.github.com/repos/%(user)s/%(repo)s'

    def __init__(self, modules_list):
        GitHubUpdater.__init__(self, modules_list, 'RepoInfo')

    def get(self, user, repo):
        id = dict(repo=repo, user=user)
        return self.get_request(self.base_url, id)

    def get_all(self):
        res = dict()
        for module in self.modules_list:
            res[module['_id']] = self.get(module['owner'], module['module_name'])
        return res

    def save_info_to_db(self, collection, info, module_id):
        db_info = dict()
        for f in info:
            if f.find('_count') >= 0 or f in ['full_name', 'updated_at', 'pushed_at']:
                db_info[f] = info[f]

        db_info['time'] = datetime.now()
        db_info['module_id'] = module_id
        collection.insert(db_info)

    def save_all(self, collection):
        for module in self.modules_list:
            self.save_info_to_db(collection, self.get(module['owner'], module['module_name']), module['_id'])


class GitHubBranchesInfoUpdater(GitHubUpdater):
    base_url = 'https://api.github.com/repos/%(user)s/%(repo)s/branches'

    def __init__(self, modules_list):
        GitHubUpdater.__init__(self, modules_list, 'BranchesInfo')

    def get(self, user, repo):
        id = {
            'repo': repo,
            'user': user
        }
        return self.get_request(self.base_url, id)

    def get_all(self):
        res = dict()
        for module in self.modules_list:
            res[module['_id']] = self.get(module['owner'], module['module_name'])
        return res

    def get_commits(self, user, repo, branch_name):
        branches = self.get(user, repo)
        for b in branches:
            if b['name'] == branch_name:
                updater = GitHubCommitsUpdater(self.modules_list)
                id_ = dict(repo=repo, user=user, sha=b['commit']['sha'])
                com_iter = Commits(updater, branch_name, id_)
                return com_iter

    def get_all_master(self):
        res = dict()
        for module in self.modules_list:
            res[module['module_name']] = self.get_commits(module['owner'], module['module_name'], 'master')
        return res

def main():
    mongoConn = pymongo.MongoClient(config.DB_HOST, 27017)
    db = mongoConn[config.DB_NAME]
    modules_collection = db['modules']
    info_collection = db['modules_info']
    modules = modules_collection.find().skip(7).limit(2)

    g = GitHubBranchesInfoUpdater(modules)
    res = g.get_all_master()
    for i in res:
        print i, len(list(res[i]))
        # for c in i:
        #     print c
    # res = g.save_all(info_collection)


if __name__ == "__main__":
    main()