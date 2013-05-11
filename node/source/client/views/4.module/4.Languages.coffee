views.Languages = View.extend
  events:
    'click .pagination a' : "changePage"

  initialize:->
    console.log '[__ModuleViewInit__] Init'
    ###
      Context
    ###
    @context.modules_url = modules_url
    ###
      QS limits
    ###
    {page, limit} = help.qs.parse window.location.search
    page  = if page   then parseInt(page)   else 0
    limit = if limit  then parseInt(limit)  else 30

    @collection = app.meta.Languages
    @listenTo @collection, "sync", @render

    ###
      Pager setup
    ###
    preloadedData = @$("[data-languages]")
    if preloadedData.length > 0
      data = preloadedData.data "languages"
      @collection.preload_data page, limit, data.languages, data.total_count
      @render()
    else
      @$el.append new exports.Loader
      @collection.pager()

  changePage: (e)->
    href = $(e.currentTarget).attr "href"
    if href
      page = href.replace /.*page=([0-9]+).*/, "$1"
      page = if page then parseInt(page) else 0

      delete @context.prev
      delete @context.next

      view = @$("ul[data-languages]")
      view.height view.height()
      loader = new exports.Loader().$el
      view.html("").append $("<li />").append(loader)

      @collection.goTo page, {update: true, remove: false}


  render:->
    @context.languages = @collection.toJSON()
    {totalPages, currentPage} = @collection.info()

    if totalPages > 0
      @context.pages = []
      for i in [1..totalPages]
        @context.pages.push {text: i, link: i-1, isActive: currentPage+1 is i}

      @context.prev = (currentPage - 1).toString() if currentPage > 0
      @context.next = currentPage + 1 if totalPages-1 > currentPage
    else
      delete @context.pages

    html = tpl['module/index'](@context)
    @$el.html html
    @$el.attr 'view-id', 'language-list'
    @