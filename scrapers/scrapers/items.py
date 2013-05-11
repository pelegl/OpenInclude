# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/topics/items.html

from scrapy.item import Item, Field

# class ScrapersItem(Item):
    # define the fields for your item here like:
    # name = Field()
    # name = Field()
    # github_url = Field()
    # description = Field()
    # readme = Field()
    # languages = Field()
    # forks = Field()
    # stars = Field()

class LanguageItem(Item):
    name = Field()

class RecipeItem(Item):
    language = Field()
    name = Field()
    tags = Field()
    author = Field()
    code = Field()
    score = Field()
    views = Field()
    download_link = Field()



