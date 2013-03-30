views.ModuleList = View.extend
  events:
    'click .pagination a' : "changePage"

  initialize: (opts)->
    console.log '[__ModuleListView__] Init'
    @language = opts.language

    @context =
      modules_url : modules_url
      language    : @language.capitalize()

    {page, limit} = help.qs.parse window.location.search
    page  = if page   then parseInt(page)   else 0
    limit = if limit  then parseInt(limit)  else 30

    ###
      Init collection
    ###
    @collection = new collections.Modules null, {@language}
    @listenTo @collection, "sync", @render

    preloadedData = @$("[data-modules]")
    if preloadedData.length > 0
      data = preloadedData.data "modules"
      @collection.preload_data page, limit, data.modules, data.total_count
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

      view = @$("ul[data-modules]")
      view.height view.height()
      loader = new exports.Loader().$el
      view.html("").append $("<li />").append(loader)

      @collection.goTo page, {update: true, remove: false}

  render:->
    @context.modules = @collection.toJSON()
    {totalPages, currentPage} = @collection.info()

    if totalPages > 0
      @context.pages = []
      for i in [1..totalPages]
        @context.pages.push {text: i, link: i-1, isActive: currentPage+1 is i}

      @context.prev = (currentPage - 1).toString() if currentPage > 0
      @context.next = currentPage + 1 if totalPages-1 > currentPage
    else
      delete @context.pages

    html = tpl['module/modules'](@context)
    @$el.html html
    @$el.attr 'view-id', 'module-list'
    @