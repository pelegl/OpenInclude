#!/bin/sh
cwd="`pwd`/../"
echo $cwd
cd $cwd

# pull codes
git pull origin master -v
echo "Code is updated to latest."

$PWD/deployment/scripts/reload.sh
