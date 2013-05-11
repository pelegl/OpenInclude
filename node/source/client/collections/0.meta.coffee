class collections.requestPager extends Backbone.Paginator.requestPager
  toJSON: (options)->
    return @cache[@currentPage] || []

  goTo: (page, options) ->
    if page isnt undefined
      @currentPage = parseInt page, 10
      if @cache[@currentPage]?
        @info()
        @trigger "sync"
        return
      else
        return @pager options
    else
      response = new $.Deferred()
      response.reject()
      return response.promise()

  cache: {}

  paginator_core:
    type: 'GET'
    dataType: 'json'
    url: ->
      return "#{@url}?" if typeof @url isnt 'function'
      return "#{@url()}?"


  paginator_ui:
    firstPage: 0
    currentPage: 0
    perPage: 30

  server_api:
    'page': ->
      return @currentPage
    'limit': ->
      return @perPage

  preload_data: (page, limit, data, total_count)->
    @cache[page] = data
    @reset data, {silent: true}
    @bootstrap
      totalRecords: parseInt(total_count)
      perPage: limit
      currentPage: page