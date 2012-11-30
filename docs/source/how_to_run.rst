How To Run
===========

Before the start, get the latest code from github.

::

    git clone https://github.com/skier31415/OpenInclude.git

After getting the codes, install the dependencies in requirements.txt.

::

    pip install -r requirements.txt

How To Set Up Sphinx
------------------------

(Suppose you're using Ubuntu to run the app.)

#. install the needed softwares(lib, modules, etc.)
    * mysql-server(apt-get for ubuntu)
    * sphinxsearch(apt-get for ubuntu)
    * django-sphinx(pip/easy_install)
    * libmysqlclient-dev (apt-get for ubuntu)
    * python-dev (apt-get for ubuntu)
    * mysql-python (mysql python binding, pip/easy_install or apt-get install python-mysqldb)
#. Create database *openinclude* in mysql
#. copy local_settings.mysql.py to local_settings.py
#. in root path of the project, run *python manage.py syncdb*   # make sure you create the super user for django admin
#. run *python manage.py migrate*  to migrate the schemas
#. load testing data by running *./loaddata.sh*
#. Config the sphinx to support search
    * copy sphinx.conf to /etc/sphinxsearch/ if you're using ubuntu
    * create directory /var/data/ if this folder doesn't exist
    * copy stopwords.txt to /var/data/ folder by *sudo cp stopwords.txt /var/data/*
    * run *sudo indexer snippets*
    * run *sudo indexer projects*
    * run *sudo searchd*  to start the sphinx search daemon
#. start django dev server by running *python manage.py runserver*
#. if things go well, open browser and type *http://127.0.0.1:8000/project/search/* to test the fulltext search for projects
#. if things go well, open browser and type *http://127.0.0.1:8000/snippet/search/* to test the fulltext search for snippets
#. type "askbot" etc. to make the testing
    
How To Run 
------------------------

1. *python manage.py syncdb*
2. *python manage.py runserver*

Then the site can be accessed in http://localhost:8000
