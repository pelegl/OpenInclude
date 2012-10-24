OpenInclude
===========

openinclude.com


# How To Run 

(Suppose you're using Ubuntu to run the app.)

1. install the needed softwares(lib, modules, etc.)
    * mysql-server(apt-get for ubuntu)
    * sphinxsearch(apt-get for ubuntu)
    * django-sphinx(pip/easy_install)
    * libmysqlclient-dev (apt-get for ubuntu)
    * python-dev (apt-get for ubuntu)
    * mysql-python (mysql python binding, pip/easy_install or apt-get install python-mysqldb)
2. Create database *openinclude* in mysql
3. copy local_settings.mysql.py to local_settings.py
4. in root path of the project, run *python manage.py syncdb*   # make sure you create the super user for django admin
5. load testing data by running *python manage.py loaddata fixtures/snippets.json*
6. Config the sphinx to support search
    * copy sphinx.conf to /etc/sphinxsearch/ if you're using ubuntu
    * create directory /var/data/ if this folder doesn't exist
    * copy stopwords.txt to /var/data/ folder by *sudo cp stopwords.txt /var/data/*
    * run *sudo indexer snippets*
    * run *sudo searchd*  to start the sphinx search daemon
7. start django dev server by running *python manage.py runserver*
8. if things go well, open browser and type *http://127.0.0.1:8000/search/* to test the fulltext search
9. type "code/java/python" etc. to make the testing
    
