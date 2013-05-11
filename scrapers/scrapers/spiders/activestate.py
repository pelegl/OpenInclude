from scrapy.contrib.spiders import CrawlSpider, Rule
from scrapy.contrib.linkextractors.sgml import SgmlLinkExtractor
from scrapy.conf import settings
from scrapy.selector import HtmlXPathSelector
from scrapy.http import Request
from django.utils.encoding import smart_str
from scrapers.items import RecipeItem, LanguageItem
import re
import pymongo

header_vals = {'User-Agent': ['Mozilla/5.0']}

class activestate_spider(CrawlSpider):
    name = 'active_spider'
    allowed_domains = ['code.activestate.com']
    start_urls = ['http://code.activestate.com/recipes/langs/']
    # settings.overrides['ITEM_PIPELINES'] = ActivePipeline
    rules = [
             Rule(SgmlLinkExtractor(allow=(r'\w+/',), restrict_xpaths=('//div[@id="as_sidebar"]')), callback='parse_item', follow=False),
             ]

    def parse_item(self, response):
        hxs = HtmlXPathSelector(response)
        languages = hxs.select('/html/body/div/div[2]/div[2]/div/ul/li/a/text()').extract()
        recipe_links = []
        for language in languages:
            if language == "C++":
                url = "https://code.activestate.com/recipes/langs/cpp/"
            else:
                url = "https://code.activestate.com/recipes/langs/" + language.lower() + "/"
                recipe_links.append(url)
        for recipe_link in recipe_links:
            yield Request(recipe_link, callback=self.recipeDetails, headers=header_vals)

    def recipeDetails(self, response):
        hxs = HtmlXPathSelector(response)
        # fetching the doules from the recipes page
        language = response.url.split("/")[-2]
        more_recipes_links = hxs.select('/html/body/div/div[2]/div/div/div[2]/div[2]/div/div/a/text()').extract()
        more_recipe_pages = []
        for recipe_link in more_recipes_links:
            try:
                page = int(recipe_link)
                more_recipe_pages.append(page)
            except ValueError:
                pass
        try:
            maximum_page = more_recipe_pages[-1]
            links = []
            for i in range(maximum_page):
                if i == 1 or i == 0:
                    pass
                else:
                    address = response.url + "?page=" + str(i)
                    links.append(address)
            for link in links:
                yield Request(link, callback=self.moreRecipeDetails, headers=header_vals)
        except IndexError:
            pass
        recipes = hxs.select('/html/body/div/div[2]/div/div/div[2]/ul/li/div/span/a/@href').extract()
        items = []
        for recipe in recipes:
            item = RecipeItem()
            recipe_title_unrefined = recipe.replace("-", " ").split("/")[2]
            title = recipe_title_unrefined.split(" ")
            del title[0]
            item['name'] = " ".join(j for j in title)
            item['language'] = language
            url = "http://code.activestate.com" + recipe
            yield Request(url, callback=self.getDetails, meta={'item': item}, headers=header_vals)

    def moreRecipeDetails(self, response):
        hxs = HtmlXPathSelector(response)
        # fetching modules from language recipes page
        language = response.url.split("/")[-2]
        recipes = hxs.select('/html/body/div/div[2]/div/div/div[2]/ul/li/div/span/a/@href').extract()
        for recipe in recipes:
            item = RecipeItem()
            recipe_title_unrefined = recipe.replace("-", " ").split("/")[2]
            title = recipe_title_unrefined.split(" ")
            del title[0]
            item['name'] = " ".join(j for j in title)
            item['language'] = language
            url = "http://code.activestate.com" + recipe
            yield Request(url, callback=self.getDetails, meta={'item': item}, headers=header_vals)

    def getDetails(self, response):
        item = response.meta['item']
        hxs = HtmlXPathSelector(response)
        code = hxs.select('//*[@id="block-0"]/div[2]//text()').extract()
        item['code'] = " ".join(line for line in code)
        tags = hxs.select('/html/body/div/div[2]/div[2]/div/div/div/ul/li/a/text()').extract()
        item['tags'] = " ".join(line for line in tags)
        author = hxs.select('//*[@id="as_sidebar_dynamic"]/table[1]//text()').extract()[2]
        item['author'] = author
        link = hxs.select('//*[@id="block-0"]/div[1]/div[1]/a/@href').extract()
        download_link = "http://code.activestate.com" + link[0]
        item['download_link'] = download_link
        score = hxs.select('//*[@id="recipe_scorevote"]/div/text()').extract()
        item['score'] = score[0]
        view = hxs.select('//*[@id="otherinfo"]/ul/li[3]/text()').extract()
        views = re.findall('\d+', view[0])
        item['views'] = views[0]
        connection = pymongo.Connection()
        db = connection['active_recipes']
        collection = db['active_collection']
        insert_recipe = collection.insert({'recipe_name': item['name'], 'download_link': item['download_link'], 'score': item['score'], 'views': item['views'],
            'author': item['author'], 'code': item['code'], 'tags': item['tags']})

