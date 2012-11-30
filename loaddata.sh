#!/bin/sh
for name in "users.json" "members.json" "projects.json" "tags.json" "tagprojects.json" "snippets.json"
do
    fixture="fixtures/$name"
    echo "loading fixture $name starts ..."
    python manage.py loaddata $fixture
    echo "loading fixture $name done" 
    echo
done
