views.DateRangeObject =
    ranges:
      'All time': ['tomorrow', 'today']
      'This week': ['monday', 'today']
      #'Last week': [Date.parse('monday').addWeeks(-1), Date.parse('monday').addDays(-1)]
      #'Last month': [Date.parse('last month').addDays(-Date.parse('last month').getDate() + 1), Date.parse('today').addDays(-Date.parse('today').getDate())]

views.DateRangeFunction = (start, end) ->
  unless start and end
    return
  if start > end
    @$('.daterange .value').html("All time");
    @$('.daterange .from').html("none");
    @$('.daterange .to').html("none");
  else
    @$('.daterange .value').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
    @$('.daterange .from').html(start.toString('yyyy-MM-dd'));
    @$('.daterange .to').html(end.toString('yyyy-MM-dd'));

  @filter()