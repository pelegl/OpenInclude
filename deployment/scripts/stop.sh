ps -ef|grep python|grep runfcgi|grep 8080|awk '{print $2}'|xargs kill
echo "stop fastcgi successfully."

