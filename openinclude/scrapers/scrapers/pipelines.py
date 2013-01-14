# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/topics/item-pipeline.html
import sys
import MySQLdb
import hashlib
from scrapy.exceptions import DropItem
import settings
import pymongo


#class ScrapersPipeline(object):
#    def __init__(self):
#        #setting to be configured in settings.py
#        self.conn = MySQLdb.connect(host=settings.db_host, user=settings.db_user, passwd=settings.db_password, db=settings.db_name, charset='utf8', use_unicode=True)
#        self.cursor = self.conn.cursor()

#    def process_item(self, item, spider):
#        try:
#            self.cursor.execute("""INSERT INTO modules (name, github_url, description, readme, languages, stars, forks) VALUES (%s, %s, %s, %s, %s, %s, %s)""",
#                                (item['name'], item['github_url'], item['description'], item['readme'], item['languages'], item['stars'], item['forks']))
#            self.conn.commit()
#        except MySQLdb.Error, e:
#            print "Error %d: %s" % (e.args[0], e.args[1])
#        return item


class ScrapersPipeline(object):
     def __init__(self):
        #setting to be configured in settings.py
        #settings for mysql, we will use mongodb instead
        #self.conn = MySQLdb.connect(host=settings.db_host, user=settings.db_user, passwd=settings.db_password, db=settings.db_name, charset='utf8', use_unicode=True)
        #self.cursor = self.conn.cursor()
        self.connection = pymongo.Connection()
        db = self.connection['list']
        self.collection = db['names']

     def process_item(self, item, spider):
        #try:
            #self.cursor.execute("""INSERT INTO langs (language) VALUES ( %s)""", (item['name']))
            #self.conn.commit()
        #except MySQLdb.Error, e:
            #print "Error %d: %s" % (e.args[0], e.args[1])
        #return item
        insert_language = self.collection.insert({'name': item['name']})
        return item

