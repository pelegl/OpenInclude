cwd="$PWD/../../"
cd $cwd
python manage.py runfcgi method=threaded host=127.0.0.1 port=8080
echo "start fastcgi successfully."
