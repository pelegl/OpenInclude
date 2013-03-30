class View extends @Backbone.View
  tagName:'section'
  className: 'contents'
  viewsPlaceholder: '#view-wrapper'

  constructor:(opts={})->
    @context = _.extend {}, app.conf

    unless opts.el?
      opts.el = $("<section class='contents' />")
      if app.meta.$('.contents').length > 0
        app.meta.$('.contents').replaceWith(opts.el)
      else
        app.meta.$el.append(opts.el)
    else
      $(window).scrollTop 0
    super opts