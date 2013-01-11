from scrapy.spider import BaseSpider
from scrapy.contrib.spiders import CrawlSpider, Rule
from scrapy.contrib.linkextractors.sgml import SgmlLinkExtractor
from scrapy.conf import settings
from scrapy.selector import HtmlXPathSelector
from scrapy.http import Request
from scrapers.items import ScrapersItem
from django.utils.encoding import smart_str

class github_spider(CrawlSpider):
    name = 'github_spider'
    allowed_domains = ['github.com']
    start_urls = ['https://github.com/languages/', ]
    rules = [
             Rule(SgmlLinkExtractor(allow=(r'\w+/',), restrict_xpaths=('//div[@class="right"]')), callback='getLanguages', follow=False),
             ]


    def getLanguages(self, response):
        urls = []
        hxs = HtmlXPathSelector(response)
        languages = hxs.select('//html/body/div/div[2]/div/div[2]/div/div/div/div[@class="right"]/ul/li/a/text()').extract()
        for language in languages:
            url = 'https://github.com/languages/' + language + '/most_watched'
            #del start_urls[:]
            urls.append(url)
        for url in urls:
            yield Request(url, callback=self.parseModules)
            print url


    def parseModules(self, response):
        hxs = HtmlXPathSelector(response)
        modules = hxs.select('/html/body/div/div[2]/div/div[2]/div/div/ul/li/h3/a/@href').extract()
        more = hxs.select('/html/body/div/div[2]/div/div[2]/div/div/div/a/@href').extract()
        list(set(more))
        urls = []
        for i in more:
            url = 'https://github.com' + i
            print url
            urls.append(url)
        for url in urls:
            yield Request(url, callback=self.parseMore)
        filename = 'github'
        module_links = []
        for module in modules:
            #open(filename, 'a').write("https://github.com" + module + "\n")
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
            #open(filename, 'a').write("https://github.com" + module + "\n")
            url = "https://github.com" + module
            module_links.append(url)
        for module_link in module_links:
            yield Request(module_link, callback=self.moduleDetails)

    def moduleDetails(self, response):
        hxs = HtmlXPathSelector(response)
        module_url = response.url
        name = module_url.split("/")[-1]
        unformatted_description = hxs.select('/html/body/div/div[2]/div/div/div/div[2]/div[2]/div[2]/p/text()').extract()
        description = " ".join(x for x in unformatted_description)
        unformatted_readme = hxs.select('//*[@id="readme"]').select('string()').extract()
        readme = smart_str(" ".join(i for i in unformatted_readme))
        #filename = 'github'
        #open(filename, 'a').write(name + "  " + readme + "\n")
        items = []
        item = ScrapersItem()
        item['name'] = name
        item['github_url'] = module_url
        item['description'] = description
        item['readme'] = readme
        items.append(item)
        return items
