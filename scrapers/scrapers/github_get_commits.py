# import urllib2
from datetime import datetime
from time import sleep
from pip.vcs import git
import pymongo
from retry import retry_on_exceptions
import requests
import simplejson

__author__ = 'Alexey'

import config

class GithubCommits():
    branches_temp = 'https://api.github.com/repos/%(user)s/%(repo)s/branches'
    commits_temp = 'https://api.github.com/repos/%(user)s/%(repo)s/commits'
    repo_info_temp = 'https://api.github.com/repos/%(user)s/%(repo)s'
    search_url = 'https://api.github.com/legacy/repos/search/:'#language=' # JavaScript?start_page=1&sort=stars&order=desc'

    # headers for the request
    git_hdr = {'User-Agent': config.GITHUB_API_USER_AGENT, 'Authorization': config.GITHUB_API_AUTH_TOKEN }

    def __init__(self, user='', repo='', module_id = 0):
        self.user = user
        self.repo = repo
        self.module_id = module_id
        self.branches_url = self.branches_temp % { 'user': user, 'repo': repo }
        self.commits_url = self.commits_temp % { 'user': user, 'repo': repo }
        self.repo_info_url = self.repo_info_temp % { 'user': user, 'repo': repo }

    @retry_on_exceptions(types=[simplejson.decoder.JSONDecodeError], tries=5, delay=5)
    def get_request(self, url, **kwargs):
        r = requests.get(url, headers = self.git_hdr, **kwargs)
        limit_remaining = r.headers['x-ratelimit-remaining']
        rj = r.json()
        if limit_remaining < 1000:
            print 'Warning limit remaining %d requets' % limit_remaining
        if limit_remaining < 1000:
            sleep(1)
        elif limit_remaining < 100:
            sleep(10)
        elif limit_remaining < 10:
            sleep(120)

        if 'message' in rj:
            print 'Warning api message: %s' % rj['message']
            return []
        else:
            return rj

    def get_modules(self, collection, lang, min_stars = 100):
        page = 1
        payload = {'sort': 'stars', 'order': 'desc'}
        url = self.search_url+lang
        while True:
            payload['start_page'] = page
            modules_list = self.get_request(url, params=payload)
            if u'repositories' in modules_list:
                modules_list = modules_list['repositories']
            else:
                break
            print 'Lang: %s, page: %d, count: %d,' % (lang, page, len(modules_list)),
            if len(modules_list) == 0:
                break
            last_watchers = modules_list[-1]['watchers']
            print 'count stars for last: %d' % last_watchers,
            if last_watchers < min_stars:
                last_n = -1
                for i in range(0, len(modules_list)):
                    if modules_list[i]['watchers'] >= min_stars:
                        last_n = i
                    else:
                        break
                if last_n < 0:
                    print 'no modules added'
                    break
                modules_list = modules_list[0:last_n + 1]
            for m in modules_list:
                m['_id'] = m['owner'] + '/' + m['name']
                collection.save(m)
            # collection.insert(modules_list)
            print 'modules added: %d' % len(modules_list)
            if last_watchers < min_stars:# or page >= 10: # "Only the first 1000 search results are available"
                break
            page += 1

    def get_all_modules(self, langs, modules):
        for lang in langs.find():
            # print lang['name']
            self.get_modules(modules, lang['name'])

    def get_branches(self):
        self.update_time = datetime.now()
        self.branches = self.get_request(self.branches_url)
        self.last_comits = dict()
        for b in self.branches:
            self.last_comits[b['name']] = b['commit']['sha']
        return self.branches

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

    def save_branches(self, collect):
        for b in self.branches:
            b['user'] = self.user
            b['repo'] = self.repo
            b['module_id'] = self.module_id
            b['update_time'] = self.update_time
            sha = b.pop('commit')['sha']
            b['last_commit'] = sha
            id = collect.insert(b)
            b['id'] = id

    def save_commits(self, collect, commits, branch_id):
        # commits_for_db = []
        last_date = ''
        for c in commits:
            commit = {
                'module_id': self.module_id,
                '_id': c['sha'],
                'committer': c['commit']['committer'],
                'date': c['commit']['committer']['date'],
                'branch_id': branch_id
            }
            last_date = commit['committer'].pop('date')
            if c['committer'] != None:
                commit['committer_id'] = c['committer']['id']
                commit['committer_login'] = c['committer']['login']
            collect.save(commit)
            # collect.update({'_id': c['sha']}, commit, True)
        #     commits_for_db.append(commit)
        # collect.save(commits_for_db)
        return last_date

    def save_modules_to_db(self):
        mongoConn = pymongo.MongoClient(config.DB_HOST, 27017)
        db = mongoConn[config.DB_NAME]
        coll_name = 'modules_2'
        modules = db[coll_name]
        langs = db['language_names']

        db.drop_collection(coll_name)
        # db.drop_collection('module_git_commits')

        self.get_all_modules(langs, modules)
        mongoConn.close()


    def save_to_db(self):
        mongoConn = pymongo.MongoClient(config.DB_HOST, 27017)
        db = mongoConn[config.DB_NAME]
        branches = db['module_git_branches']
        commits_collection = db['module_git_commits']

        # db.drop_collection('module_git_branches')
        # db.drop_collection('module_git_commits')

        self.save_branches(branches)

        self.all_count = 0
        for b in self.branches:
            branch_name = b['name']
            if branch_name != 'master':
                continue
            count = 0
            commits = self.get_commits(branch_name, True)
            while len(commits) != 0:
                last_date = self.save_commits(commits_collection, commits, b['id'])
                count += len(commits)
                print len(commits), last_date
                # if count > 200:
                #     break
                commits = self.get_commits(branch_name)
            b['count'] = count
            print branch_name, count
            self.all_count += count
        print  self.all_count
        mongoConn.close()

    def get_info(self):
        self.info = self.get_request(self.repo_info_url)
        return self.info

    def save_info_to_db(self, collection):
        self.get_info()
        db_info = dict()
        for f in self.info:
            if f.find('_count') >= 0 or f in ['full_name', 'updated_at', 'pushed_at']:
                db_info[f] = self.info[f]

        db_info['time'] = datetime.now()
        db_info['module_id'] = self.module_id
        collection.insert(db_info)

def main():
    # github = GithubCommits()
    # github.save_modules_to_db()


    mongoConn = pymongo.MongoClient(config.DB_HOST, 27017)
    db = mongoConn[config.DB_NAME]
    modules_collection = db['modules']
    info_collection = db['modules_info']

    # modules_count = 100
    for module in modules_collection.find():#.limit(modules_count):
        print module['owner'], module['module_name'], module['_id']
        github = GithubCommits(module['owner'], module['module_name'], module['_id'])
        github.save_info_to_db(info_collection)

    for module in modules_collection.find():#.limit(modules_count):
        print module['owner'], module['module_name'], module['_id']
        github = GithubCommits(module['owner'], module['module_name'], module['_id'])
        github.save_to_db()

    # all_count = 0
    # for b in branches:
    #     branch_name = b['name']
    #     count = 0
    #     while True:
    #         commits = github.get_commits(branch_name)
    #         count += len(commits)
    #         if len(commits) == 0:
    #             break
    #         print len(commits), commits[-1]['commit']['committer']['date']
    #     print branch_name, count
    #     all_count += count
    # print all_count

if __name__ == "__main__":
    main()
