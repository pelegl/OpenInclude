import os
import errno
import shutil
import pymongo
import sys
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

class LogRemoteProgress(git.RemoteProgress):

    def __init__(self, name):
        git.RemoteProgress.__init__(self)
        self.procces_name = name

    def line_dropped(self, line):
        """Called whenever a line could not be understood and was therefore dropped."""
        pass

    def update(self, op_code, cur_count, max_count=None, message=''):
        """Called whenever the progress changes

        :param op_code:
            Integer allowing to be compared against Operation IDs and stage IDs.

            Stage IDs are BEGIN and END. BEGIN will only be set once for each Operation
            ID as well as END. It may be that BEGIN and END are set at once in case only
            one progress message was emitted due to the speed of the operation.
            Between BEGIN and END, none of these flags will be set

            Operation IDs are all held within the OP_MASK. Only one Operation ID will
            be active per call.
        :param cur_count: Current absolute count of items

        :param max_count:
            The maximum count of items we expect. It may be None in case there is
            no maximum number of items or if it is (yet) unknown.

        :param message:
            In case of the 'WRITING' operation, it contains the amount of bytes
            transferred. It may possibly be used for other purposes as well.

        You may read the contents of the current line in self._cur_line"""
        if max_count != None and max_count != '':
            try:
                progress = float(cur_count) / int(max_count) * 100
                sys.stdout.write("%s progress: %d%%   \r" % (self.procces_name, progress))
                sys.stdout.flush()
            except:
                pass
            # print persent_complete

def git_update(id):
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

    origin.fetch(progress=LogRemoteProgress('Fetch'))                       # fetch, pull and push from and to the remote
    origin.pull('refs/heads/master:refs/heads/origin', progress=LogRemoteProgress('Pull'))

def git_clone(id):
    remote_path = 'git://github.com/%(user)s/%(repo)s.git'
    path = get_path(id)
    git.Repo.clone_from(remote_path % id, path, progress=LogRemoteProgress('Clone'))

def check_git_repo_exist(path):
    return os.path.exists(path + '/.git')


def main():
    mongoConn = pymongo.MongoClient(config.DB_HOST, 27017)
    db = mongoConn[config.DB_NAME]
    modules_collection = db['modules']
    modules = modules_collection.find()

    count = modules.count()
    i = 0
    err_modules = open('not_cloned_modules.txt', 'w')
    for module in modules:
        id = dict(user=module['owner'], repo=module['module_name'])
        i += 1
        try:
            print '(%d/%d)' % (i, count), '%(user)s/%(repo)s' % id
            if check_git_repo_exist(get_path(id)):
                git_update(id)
            else:
                git_clone(id)
            sys.stdout.write("Done!\n")
            sys.stdout.flush()
        except git.exc.GitCommandError as ex:
            print ex.command
            err_modules.write('%(user)s/%(repo)s\n' % id)
            err_modules.flush()
            shutil.rmtree(get_path(id))
    err_modules.close()

if __name__ == "__main__":
    main()
