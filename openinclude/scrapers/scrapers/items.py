# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/topics/items.html

from scrapy.item import Item, Field

class ScrapersItem(Item):
    # define the fields for your item here like:
    # name = Field()
    name = Field()
    github_url = Field()
    description = Field()
    readme = Field()
    languages = Field()
    forks = Field()
    stars = Field()
