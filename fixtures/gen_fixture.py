items = \
"""    {
        "pk": %(id)s,
        "model": "snippet.usersnippet",
        "fields": {
            "code_block": "%(code)s",
            "title": "code sample %(id)s",
            "created_at": "2012-10-23T20:17:10.516",
            "license_url": "%(license_url)s",
            "user": 1,
            "approved": true,
            "profile_url": "http://github.com/%(username)s"
        }
    },
"""
out = ""
licenses = ["http://opensource.org/licenses/Apache-2.0", "http://opensource.org/licenses/gpl-license",
    "http://opensource.org/licenses/BSD-3-Clause", "http://opensource.org/licenses/lgpl-license",
    "http://opensource.org/licenses/MIT", "http://opensource.org/licenses/MPL-2.0", 
    "http://opensource.org/licenses/CDDL-1.0", "http://opensource.org/licenses/EPL-1.0"]
codes = [
    "This is javascript code sample",
    "This is python code sample",
    "This is ruby code sample",
    "This is php code sample",
    "This is java code sample",
    "This is C++ code sample",
    "This is C code sample",
    "This is objective c code sample",
    "This is c# code sample",
]
for i in range(1, 101):
    import random
    data = {
        "id" : str(i),
        "username" : "zhutao" + str(i),
        "license_url" : random.choice(licenses),
        "code" : random.choice(codes),
    }
    item = items % data
    out += item
ret = """[
%s
]"""
print ret % out[:-2]
    
