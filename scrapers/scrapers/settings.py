# Scrapy settings for scrapers project
#
# For simplicity, this file contains only the most important settings by
# default. All the other settings are documented here:
#
#     http://doc.scrapy.org/topics/settings.html
#

BOT_NAME = 'scrapers'

SPIDER_MODULES = ['scrapers.spiders']
NEWSPIDER_MODULE = 'scrapers.spiders'

# msql settings
# db_username = ""
# db_password = ""
# db_host = "localhost"
# db_name = ""

# mongodb settings
LANGUAGE_DB = 'github_languages'
LANGUAGE_COLLECTION = 'language_names'

# registering pipelines
ITEM_PIPELINES = [
    'scrapers.pipelines.ScrapersPipeline',
]

