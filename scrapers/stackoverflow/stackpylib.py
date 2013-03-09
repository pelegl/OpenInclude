__author__ = 'Alexey'

from stackpy import Site

site = Site('stackoverflow')
i=0
# for question in site.questions.filter('withbody'):
for question in site.search('advanced').url('*github.com/twitter*').filter('withbody'):
    i += 1
    print '%d --- %s ---' % (i, question.title)
    print question.body