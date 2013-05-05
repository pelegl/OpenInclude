# -*- coding: utf8 -*-
import cStringIO as StringIO
from pprint import pprint
import re
import math

from twisted.internet import reactor, task
from twisted.internet.task import LoopingCall
from twisted.web.client import getPage
from twisted.python.util import println
from lxml import etree
import time
from twisted.web.error import Error
import txmongo
from twisted.internet import defer


@defer.inlineCallbacks
def save_to_mongo(repo):
    mongo = yield txmongo.MongoConnection()

    foo = mongo.foo  # `foo` database
    modules = foo.modules  # `test` collection

    for r in repo:
        yield modules.insert(r)

def parse_module_info(element):
    full_name = unicode(element.xpath('h3/a/text()')[0])
    name = full_name.split('/')
    lang = 'Text'
    lang_el = element.xpath('ul/li[1]')[0]
    if 'class' not in lang_el.attrib:
        lang = lang_el.text
    description = ''
    desc = element.xpath('div/p[@class="description"]/text()')
    if len(desc):
        description = unicode(desc[0]).strip()
    repo = {
        'module_name': name[1],
        'owner': name[0],
        'is_a_fork': False,
        'username': name[0],
        'language': lang,
        'watchers': int(unicode(element.xpath('ul/li[@class="stargazers"]/a/text()')[1]).strip().replace(',', '')),
        'forks': int(unicode(element.xpath('ul/li[@class="forks"]/a/text()')[1]).strip().replace(',', '')),
        'description': description,
        'pushed_at': element.xpath('div/p[@class="updated-at"]/time/@datetime')[0],
    }
    # pprint(repo)
    return repo

def gotErr(failure):
    print failure

class scraper():
    stars_limit = 25
    stars_max = 1500
    stars_interval = stars_max / 2
    star_op = '>'
    max_results = 1000
    results_per_page = 10
    pages_limit = 1#max_results / results_per_page


    url_tmp = 'https://github.com/search?p=%(page)d&q=stars%%3A%(stars)s&s=updated&type=Repositories'
    headers = {
        "accept"         : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "user-agent"     : 'GitHub Scraper',
        "accept-language": "ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3",
        "cache-control"  : "max-age=0",
        "connection"     : "keep-alive",
        "accept-charset" : "utf-8,windows-1251;q=0.7,*;q=0.3",
        'Cookie': '''_gauges_unique_year=1; _gauges_unique=1; tracker=direct; _gauges_unique_day=1; _gauges_unique_month=1; spy_repo=fiorix%2Fmongo-async-python-driver; spy_repo_at=Sat%20May%2004%202013%2020%3A19%3A40%20GMT%2B0400%20(%D0%9C%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%B5%20%D0%B2%D1%80%D0%B5%D0%BC%D1%8F%20(%D0%B7%D0%B8%D0%BC%D0%B0)); spy_user=aleks1k; logged_in=yes; _gh_sess=BAh7DjoJdXNlcmkDXsgyOhBmaW5nZXJwcmludCIlZDdmMzhiMTdjZTI3YjMxYmJhNTdmMjI2NjQ4ZjA4MGM6D3Nlc3Npb25faWQiJTVmNjdiMjM2MGI1MDJjY2YxY2RmNzIyODM0N2FhOTQyOgxjb250ZXh0SSIGLwY6BkVGOhBfY3NyZl90b2tlbkkiMXRCUExJVDJ6c1l4bUJZdW5GWUJFODE5N1BIUk0zbjRrYVRZL1VVWVp5c289BjsJRkkiCmZsYXNoBjsJRklDOidBY3Rpb25Db250cm9sbGVyOjpGbGFzaDo6Rmxhc2hIYXNoewAGOgpAdXNlZHsAOg5yZXR1cm5fdG8iLC9zZXR0aW5ncy9lbWFpbHM%2FX3BqYXg9JTIzcGFnZS1zZXR0aW5nczoQbGFzdF9hY3RpdmVsKwd5mIVROhhsYXN0X3Zpc2l0ZWRfb3JnX2lkaQMg0SU%3D--377fdaea3e0fd9b2ecedf1785e47f9b63ce86f25; __utma=1.936171927.1361824282.1367687428.1367709820.111; __utmb=1.1.10.1367709820; __utmc=1; __utmz=1.1367683713.109.37.utmcsr=stackoverflow.com|utmccn=(referral)|utmcmd=referral|utmcct=/questions/9550748/asyncmongo-and-twisted; _gauges_unique_hour=1'''
        }

    def __init__(self):
        self.curr_star = self.stars_max
        self.curr_page = 1

    def get_stars_interval(self):
        if self.stars_interval != 0:
            if self.results_count > 0.5 * self.max_results:
                self.stars_interval *= 0.5
            elif self.results_count < 0.25 * self.max_results:
                self.stars_interval *= 1.25
            self.stars_interval = int(self.stars_interval)
        if self.stars_interval == 0:
            self.star_op = '' # equal
        else:
            self.star_op = '..'

    def next_page(self, last_result=None):
        last_page = int(math.ceil(float(self.results_count) / self.results_per_page))
        if last_page > self.pages_limit and self.curr_page >= self.pages_limit:
            print 'Can\'t load %d repos, results more %d' % (self.results_count - self.max_results, self.max_results)
            last_page = self.pages_limit
        if self.curr_page >= last_page and self.curr_star <= self.stars_limit:
            print 'Stop'
            reactor.stop()
        else:
            if self.curr_page >= last_page:
                self.get_stars_interval()
                self.curr_star -= self.stars_interval + 1
                self.curr_page = 1
                self.results_count = self.max_results
            else:
                self.curr_page += 1


    def make_url(self, last_result=None):
        if self.star_op == '..':
            star_filter = '%d..%d' % (self.curr_star, self.curr_star + self.stars_interval)
        else:
            star_filter = self.star_op + str(self.curr_star)
        params = {'page': self.curr_page, 'stars': star_filter}
        url = self.url_tmp % params
        print 'page %(page)d for stars %(stars)s' % params,
        return url

    def parseHtml(self, html):
        parser = etree.HTMLParser(encoding='utf8')
        tree = etree.parse(StringIO.StringIO(html), parser)
        repos = []
        result_count_str = tree.xpath('//*[@id="container"]/div[2]/div[2]/div[1]/h3/text()')
        self.results_count = 0
        if len(result_count_str):
            res_num_re = re.compile(r'([\d,]+)')
            self.results_count = int(res_num_re.findall(result_count_str[0])[0].replace(',',''))
        for r in tree.xpath('//*[@id="container"]/div[2]/div[2]/ul/li'):
            module_info = parse_module_info(r)
            repos.append(module_info)
        print 'all results %d' % self.results_count
        return repos

    def task_(self):
        d = getPage(self.make_url(), headers=self.headers)
        d.addCallback(self.parseHtml)
        d.addCallback(save_to_mongo)
        d.addCallback(self.next_page)
        d.addErrback(self.limit_sleep)
        return d

    def limit_sleep(self, err):
        if err.type == Error and err.value.status == '420':
            print 'Limit, wait one minute'
            self.lc.stop()
            # d = task.deferLater(reactor, 5, self.make_url())
            reactor.callLater(60, self.start)
        else:
            gotErr(err)

    def start(self):
        self.lc = LoopingCall(self.task_)
        self.lc.start(0)

def main():
    s = scraper()
    s.start()
    reactor.run()

if __name__ == '__main__':
    main()
