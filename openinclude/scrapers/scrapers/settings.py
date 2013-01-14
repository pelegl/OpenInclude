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

# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = 'scrapers (+http://www.yourdomain.com)'

#msql settings
#db_username = "root"
#db_password = "mago.mere"
#db_host = "localhost"
#db_name = "trial"
#db_user = "root"



ITEM_PIPELINES = [
    'scrapers.pipelines.ScrapersPipeline',
]

