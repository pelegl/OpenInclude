import os
from pprint import pprint
import sys
import time
import traceback
from bson import ObjectId
import git
import config
from updater_base import ModulesUpdaterBase
import git_tools

__author__ = 'Alexey'

class ModulesGitUpdater(ModulesUpdaterBase):
    name = 'ModulesGitUpdater'

    def init(self, new_ind):
        if new_ind:
            pass
            # self.db.drop_collection('module_updates')
        self.err_modules = open(os.path.join(config.LOG_PATH, 'not_cloned_modules.%d.txt' % self.start_time), 'w')

    def update_from_git(self, module_info):
        repo_dir_exist, path = self.check_repo_dir_exist(module_info)
        mod_path_id = dict(user=module_info['owner'], repo=module_info['module_name'])
        try:
            if repo_dir_exist and git_tools.check_git_repo_exist(path):
                def save_update_to_db(old_commit, new_commit):
                    module_id = module_info['_id']
                    updates = self.db['module_updates']
                    item = updates.find_one(module_id) # id update item equal module id
                    if not item:
                        item = dict(_id=module_id, old_commit=old_commit, new_commit=new_commit)
                    else:
                        item['new_commit'] = new_commit

                    updates.save(item)

                git_tools.git_pull(path, save_update_to_db)
            else:
                git_tools.git_clone(mod_path_id, path)
            sys.stdout.write("Done!\n")
            sys.stdout.flush()
        except git.exc.GitCommandError as ex:
            if ex.status == 128:
                sys.stdout.write("Repository not found.\n")
                sys.stdout.flush()
                git_tools.drop_dir(path)
            else:
                print 'Fail!'
            self.err_modules.write('%(user)s/%(repo)s\n' % mod_path_id)
            self.err_modules.write(traceback.format_exc())
            self.err_modules.flush()
        except Exception as ex:
            try:
                print '\ttry make clone repo again...'
                git_tools.drop_dir(path)
                git_tools.git_clone(mod_path_id, path)
                sys.stdout.write("Done!\n")
                sys.stdout.flush()
            except Exception as ex:
                print 'Fail!'
                self.err_modules.write('%(user)s/%(repo)s\n' % mod_path_id)
                self.err_modules.write(traceback.format_exc())
                self.err_modules.flush()


    def update_module(self, num, module_info):
        print '\tupdate from git'
        self.update_from_git(module_info)

    def final(self):
        self.err_modules.close()

if __name__ == "__main__":
    new_ind = 'new' in sys.argv
    new_ind = True
    LIMIT = None
    u = ModulesGitUpdater()
    u.main(new_ind, LIMIT)
    u.final()
