ps -ef|grep python|grep runfcgi|grep 8080|awk '{print $2}'|xargs kill
echo "stop fastcgi successfully."

python manage.py runfcgi method=threaded host=127.0.0.1 port=8080
echo "start fastcgi successfully."
