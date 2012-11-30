#!/bin/sh
for name in "user" "member" "project" "tag" "tagproject" "snippet"
do
    echo "Generate fixture for $name"
    python gen_fixture.py $name > "$name"s.json
done
