#!/usr/bin/env python
import os, sys
import random
class Generator(object):
    def __init__(self):
        self.record_num = 100
        self.do_init()
        self.skeleton = None
        self.load_skeleton()

    def do_init(self):
        self.skeleton_path = None    # skeleton file name to load

    def load_skeleton(self):
        if self.skeleton_path is None:
            print "Need to specify skeleton path in child class"
            sys.exit(0)
        fh = open(self.skeleton_path)
        self.skeleton = fh.read()
        fh.close()

    def gen_each_item(self, index):
        return {
            "id" : str(index),
        }

    def output(self):
        out = ""
        for i in range(1, self.record_num):
            item = self.gen_each_item(i)
            out += self.skeleton % item
        return """[
%s
]""" % out[:-2]
            
class UserGenerator(Generator):
    def do_init(self):
        self.skeleton_path = "skeletons/user.json"
        
class MemberGenerator(Generator):
    def do_init(self):
        self.skeleton_path = "skeletons/member.json"

class ProjectGenerator(Generator):
    def do_init(self):
        self.skeleton_path = "skeletons/project.json"
        self.record_num = 999

    def gen_each_item(self, index):
        return {
            "id" : index,
            "lang" : random.randint(0, 5),
            "license" : random.randint(0, 7),
            "member" : random.randint(1, 99),
            "type" : random.randint(0, 1),
            "size" : random.randint(0, 5),
        }

class TagGenerator(Generator):
    def do_init(self):
        self.skeleton_path = "skeletons/tag.json"
        self.record_num = 999

class TagProjectGenerator(Generator):
    def do_init(self):
        self.skeleton_path = "skeletons/tagproject.json"
        self.record_num = 2000
        
    def gen_each_item(self, index):
        return {
            "id" : index,
            "proj" : random.randint(1, 999),
            "tag" : random.randint(1, 2000),
        }

class SnippetGenerator(Generator):
    def do_init(self):
        self.skeleton_path = "skeletons/snippet.json"
        self.record_num = 2000
    def gen_each_item(self,index):
        licenses = ["http://opensource.org/licenses/Apache-2.0", "http://opensource.org/licenses/gpl-license",
            "http://opensource.org/licenses/BSD-3-Clause", "http://opensource.org/licenses/lgpl-license",
            "http://opensource.org/licenses/MIT", "http://opensource.org/licenses/MPL-2.0", 
            "http://opensource.org/licenses/CDDL-1.0", "http://opensource.org/licenses/EPL-1.0"]
        return {
            "id" : index,
            "license" : random.choice(licenses),
            "member" : random.randint(1, 99),
        }

def error_msg():
    print "Please specify the valid model name to continue"
    print "valid model name: %s" % ",".join(valid_args)
    sys.exit(0)
    

if __name__ == "__main__":
    valid_args = ["user", "member", "project", "tag", "tagproject", "snippet"]
    if len(sys.argv) != 2 or sys.argv[1] not in valid_args:
        error_msg()
    arg = sys.argv[1]
    cls = Generator
    if arg == "user": cls = UserGenerator
    elif arg == "member": cls = MemberGenerator
    elif arg == "project": cls = ProjectGenerator
    elif arg == "tag": cls = TagGenerator
    elif arg == "tagproject": cls = TagProjectGenerator
    elif arg == "snippet": cls = SnippetGenerator
    else: error_msg()
    gen = cls()
    print gen.output()
        
