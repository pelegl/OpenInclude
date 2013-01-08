from scrapy.spider import BaseSpider
from scrapy.contrib.spiders import CrawlSpider, Rule
from scrapy.contrib.linkextractors.sgml import SgmlLinkExtractor
from scrapy.conf import settings
from scrapy.selector import HtmlXPathSelector
from scrapy.http import Request

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
        modules = hxs.select('/html/body/div/div[2]/div/div[2]/div/div/ul/li/h3/a/text()').extract()
        filename = 'github'
        for module in modules:
            open(filename, 'a').write(module + "\n")


