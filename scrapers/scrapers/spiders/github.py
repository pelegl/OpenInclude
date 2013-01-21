from scrapy.spider import BaseSpider
from scrapy.contrib.spiders import CrawlSpider, Rule
from scrapy.contrib.linkextractors.sgml import SgmlLinkExtractor
from scrapy.conf import settings
from scrapy.selector import HtmlXPathSelector
from scrapy.http import Request
# from scrapers.items import ScrapersItem
from scrapers.items import LanguageItem
from django.utils.encoding import smart_str
from scrapers.items import RecipeItem

class github_spider(CrawlSpider):
    name = 'github_spider'
    allowed_domains = ['github.com']
    # we took the languages approach
    start_urls = ['https://github.com/languages/', ]
    # the languages are listed on a div whose class is 'right'
    rules = [
             Rule(SgmlLinkExtractor(allow=(r'\w+/',), restrict_xpaths=('//div[@class="right"]')), callback='getLanguages', follow=False),
             ]


    def getLanguages(self, response):
        urls = []
        hxs = HtmlXPathSelector(response)
        languages = hxs.select('//html/body/div/div[2]/div/div[2]/div/div/div/div[@class="right"]/ul/li/a/text()').extract()
        for language in languages:
            url = 'https://github.com/languages/' + language + '/most_watched'
            urls.append(url)
        for url in urls:
            yield Request(url, callback=self.parseModules)
            print url


    def parseModules(self, response):
        hxs = HtmlXPathSelector(response)
        # fetching the doules from the modules list page
        modules = hxs.select('/html/body/div/div[2]/div/div[2]/div/div/ul/li/h3/a/@href').extract()
        # fetching the paginated modules
        more = hxs.select('/html/body/div/div[2]/div/div[2]/div/div/div/a/@href').extract()
        list(set(more))
        urls = []
        for i in more:
            url = 'https://github.com' + i
            urls.append(url)
        for url in urls:
            yield Request(url, callback=self.parseMore)
        filename = 'github'
        module_links = []
        for module in modules:
            url = "https://github.com" + module
            module_links.append(url)
        for module_link in module_links:
            yield Request(module_link, callback=self.moduleDetails)


    def parseMore(self, response):
        hxs = HtmlXPathSelector(response)
        modules = hxs.select('/html/body/div/div[2]/div/div[2]/div/div/ul/li/h3/a/@href').extract()
        filename = 'github'
        module_links = []
        for module in modules:
            url = "https://github.com" + module
            module_links.append(url)
        for module_link in module_links:
            yield Request(module_link, callback=self.moduleDetails)

    def moduleDetails(self, response):
        hxs = HtmlXPathSelector(response)
        # module name and url
        module_url = response.url
        # name is the last word in the url
        name = module_url.split("/")[-1]
        # module details from the details page
        unformatted_description = hxs.select('/html/body/div/div[2]/div/div/div/div[2]/div[2]/div[2]/p/text()').extract()
        stars = hxs.select('/html/body/div/div[2]/div/div/div/div/ul/li/span/a[2]/text()').extract()
        forks = hxs.select('/html/body/div/div[2]/div/div/div/div/ul/li[2]/a[2]/text()').extract()
        languages = hxs.select('/html/body/div/div[2]/div/div/div/div[2]/div[2]/div/div/span/text()').extract()
        language_percentages = hxs.select('/html/body/div/div[2]/div/div/div/div[2]/div[2]/div/ol/li/a/span[3]/text()').extract()
        description = " ".join(x for x in unformatted_description)
        unformatted_readme = hxs.select('//*[@id="readme"]').select('string()').extract()
        readme = smart_str(" ".join(i for i in unformatted_readme))
        # adding the modules and their details to items
        items = []
        item = ScrapersItem()
        item['name'] = name
        item['github_url'] = module_url
        item['description'] = description
        item['readme'] = readme
        item['stars'] = "".join(star for star in stars)
        item['forks'] = "".join(fork for fork in forks)
        language_list = []
        count = 0
        for language in languages:
            entry = language + "-" + language_percentages[count]
            language_list.append(entry)
            count += 1
        item['languages'] = ",".join(j for j in language_list)
        items.append(item)
        return items

class language_spider(BaseSpider):
    name = 'language_spider'
    allowed_domains = ['github.com']
    # languages page
    start_urls = ['https://github.com/languages/', ]

    def parse(self, response):
        urls = []
        hxs = HtmlXPathSelector(response)
        languages = hxs.select('//html/body/div/div[2]/div/div[2]/div/div/div/div[@class="right"]/ul/li/a/text()').extract()
        items = []
        print languages
        for language in languages:
            # create a new item object at every loop to avoid looping
            # of the first round only
            item = LanguageItem()
            item['name'] = language
            items.append(item)
        return items

class activestate_spider(CrawlSpider):
    name = 'active_spider'
    allowed_domains = ['code.activestate.com']
    start_urls = ['http://code.activestate.com/recipes/langs/']
    # rules = [
    #         Rule(SgmlLinkExtractor(allow=(r'recipes/langs/\w+'), callback='parse_item', follow=False),
    #         ]
    rules = [
             Rule(SgmlLinkExtractor(allow=(r'\w+/',), restrict_xpaths=('//div[@id="as_sidebar"]')), callback='parse_item', follow=False),
             ]

    def parse_item(self, response):
        hxs = HtmlXPathSelector(response)
        languages = hxs.select('/html/body/div/div[2]/div[2]/div/ul/li/a/text()').extract()
        recipe_links = []
        for language in languages:
            url = "https://code.activestate.com/recipes/langs/" + language.lower() + "/"
            recipe_links.append(url)
        for recipe_link in recipe_links:
            yield Request(recipe_link, callback=self.recipeDetails)

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
                yield Request(link, callback=self.moreRecipeDetails)
        except IndexError:
            pass
        recipes = hxs.select('/html/body/div/div[2]/div/div/div[2]/ul/li/div/span/a/@href').extract()
        for recipe in recipes:
            item = RecipeItem()
            recipe_title_unrefined = recipe.replace("-", " ").split("/")[2]
            title = recipe_title_unrefined.split(" ")
            del title[0]
            item['name'] = " ".join(j for j in title)
            item['language'] = language
            url = "http://code.activestate.com" + recipe
            request = Request(url, callback=self.getCode)
            request.meta['item'] = item
            yield request
            request = Request(url, callback=self.getAuthor)
            request.meta['item'] = item
            yield request
            request = Request(url, callback=self.getTags)
            request.meta['item'] = item
            yield request

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
            request = Request(url, callback=self.getTags)
            request.meta['item'] = item
            yield request
            request = Request(url, callback=self.getCode)
            request.meta['item'] = item
            yield request
            request = Request(url, callback=self.getAuthor)
            request.meta['item'] = item
            yield request



    def getCode(self, response):
        item = response.meta['item']
        hxs = HtmlXPathSelector(response)
        code = hxs.select('//*[@id="block-0"]/div[2]//text()').extract()
        item['code'] = " ".join(line for line in code)
        return item

    def getTags(self, response):
        item = response.meta['item']
        hxs = HtmlXPathSelector(response)
        tags = hxs.select('/html/body/div/div[2]/div[2]/div/div/div/ul/li/a/text()').extract()
        print tags
        item['tags'] = " ".join(line for line in tags)
        return item

    def getAuthor(self, response):
        item = response.meta['item']
        hxs = HtmlXPathSelector(response)
        author = hxs.select('//*[@id="as_sidebar_dynamic"]/table[1]//text()').extract()[2]
        item['author'] = author
        return item





