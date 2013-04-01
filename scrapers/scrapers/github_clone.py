import os
import errno
import pymongo
import config
import git

__author__ = 'Alexey'


def make_sure_path_exists(path):
    try:
        os.makedirs(path)
    except OSError as exception:
        if exception.errno != errno.EEXIST:
            raise

def get_path(id):
    path = config.GITHUB_REPOS_CLONE_PATH + ('/%(user)s/%(repo)s' % id)
    make_sure_path_exists(path)
    return path

def git_clone(id):
    remote_path = 'git://github.com/%(user)s/%(repo)s.git'
    path = get_path(id)
    repo = git.Repo.init(path, bare=False)
    # repo = Repo(path)
    # origin = repo.create_remote('origin', 'git@github.com:aleks1k/ec2_tools.git')
    origin_exist = False
    for r in repo.remotes:
        if r.name == 'origin':
            origin_exist = True
            origin = r
            break
    if not origin_exist:
        origin = repo.create_remote('origin', remote_path % id)

    origin.fetch()                       # fetch, pull and push from and to the remote
    origin.pull('refs/heads/master:refs/heads/origin')

def main():
    mongoConn = pymongo.MongoClient(config.DB_HOST, 27017)
    db = mongoConn[config.DB_NAME]
    modules_collection = db['modules']
    modules = modules_collection.find().limit(5)

    for module in modules:
        id = dict(user=module['owner'], repo=module['module_name'])
        try:
            git_clone(id)
        except git.exc.GitCommandError as ex:
            print id['repo'], ex.command

if __name__ == "__main__":
    main()
