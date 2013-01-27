# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/topics/item-pipeline.html
import sys
# import MySQLdb
import hashlib
from scrapy.exceptions import DropItem
import settings
import pymongo
from scrapers.items import RecipeItem, LanguageItem

# pipeline for the screen scraped repos
# class ScrapersPipeline(object):
#    def __init__(self):
#        #setting to be configured in settings.py
#        self.conn = MySQLdb.connect(host=settings.db_host, user=settings.db_user, passwd=settings.db_password,
#        db=settings.db_name, charset='utf8', use_unicode=True)
#        self.cursor = self.conn.cursor()

#    def process_item(self, item, spider):
#        try:
#            self.cursor.execute("""INSERT INTO modules (name, github_url, description, readme, languages, stars,
#             forks) VALUES (%s, %s, %s, %s, %s, %s, %s)""",
#                                (item['name'], item['github_url'], item['description'], item['readme'], item['languages'],
#                                item['stars'], item['forks']))
#            self.conn.commit()
#        except MySQLdb.Error, e:
#            print "Error %d: %s" % (e.args[0], e.args[1])
#        return item

# pipeline for the api fetched languages.
class ScrapersPipeline(object):
    def __init__(self):
        # settings for mysql, we will use mongodb instead
        # self.conn = MySQLdb.connect(host=settings.db_host, user=settings.db_user, passwd=settings.db_password,
        # db=settings.db_name, charset='utf8', use_unicode=True)
        # self.cursor = self.conn.cursor()
        self.connection = pymongo.Connection()
        db = self.connection[settings.LANGUAGE_DB]
        self.collection = db[settings.LANGUAGE_COLLECTION]

    def process_item(self, item, spider):
        # saving languages into mysql
        # try:
            # self.cursor.execute("""INSERT INTO langs (language) VALUES ( %s)""", (item['name']))
            # self.conn.commit()
        # except MySQLdb.Error, e:
            # print "Error %d: %s" % (e.args[0], e.args[1])
        # return item

        # saving languages into mongodb
        if isinstance(item, LanguageItem):
            insert_language = self.collection.insert({'name': item['name']})
            return item

# class activestate_spiderPipeline(object):
#     def __init__(self):
        # settings for mysql, we will use mongodb instead
        # self.conn = MySQLdb.connect(host=settings.db_host, user=settings.db_user, passwd=settings.
        # db_password, db=settings.db_name, charset='utf8', use_unicode=True)
        # self.cursor = self.conn.cursor()
#        self.connection = pymongo.Connection()
#        db = self.connection[settings.ACTIVE_DB]
#        self.collection = db[settings.ACTIVE_COLLECTION]

#     def process_item(self, item, spider):
#        if spider == 'active_spider':
#            insert_recipe = self.collection.insert({'recipe_name': item['name'], 'download_link': item['download_link'], 'score': item['score'], 'views': item['views'],
#            'author': item['author'], 'code': item['code'], 'tags': item['tags']})
#            return item

