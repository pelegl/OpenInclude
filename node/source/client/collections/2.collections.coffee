((exports, isServer) ->
  api = "/api/v.1"
  if isServer
    @Backbone = require 'backbone'
  
  class requestPager extends @Backbone.Paginator.requestPager 
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
  
  
  exports.Language = requestPager.extend
    
    comparator: (language)->
      return language.get("name")
    
    model: models.Language
    
    url: "/modules"
    
    parse: (response)->
      @cache[@currentPage] = languages = response.languages      
      @totalRecords = response.total_count
      languages    
  
  
  exports.Modules = requestPager.extend
    initialize: (models, options)->
      @language = options.language || ""
    
    comparator: (module)->
      return module.get("watchers")
    
    model: models.Repo
    
    url: ->
      return "/modules/#{@language}"
      
    parse: (response)->
      @cache[@currentPage] = modules = response.modules
      @totalRecords = response.total_count
      modules
    
    
  exports.Discovery = @Backbone.Collection.extend  
    parse:(r)->
      r.response ? []
    
    model: models.Discovery
    url: "/discover/search"
 
    maxRadius: ->
      return d3.max @models, (data)=>
        return data.radius()
    
    languageList: ->      
      languageNames = if @groupedModules then _.keys @groupedModules else []
      list = []
      _.each languageNames, (lang)=>
        list.push { name : lang, color: @groupedModules[lang][0].color }
      return list
         
    
    filters: {}
           
    fetch: ->
      [query, opts...] = Array::slice.apply arguments
      query = query ? ""
            
      collection = this
      $.getJSON "#{collection.url}?q=#{query}" , (r)->
        collection.maxScore = r.maxScore                
        collection.groupedModules = _.groupBy r.searchData, (module)=>
          return module._source.language               
        collection.reset r.searchData
        
  
  exports.DiscoveryComparison = @Backbone.Collection.extend
    model: models.Discovery      
                 
    sortBy: (key, direction) ->
      key = if key? then key.split(".") else "_id"
      @models = _.sortBy @models, (module)=>        
        value = if key.length is 2 then module.get(key[0])[key[1]] else module.get key[0]
        if key[1] is 'pushed_at'
          return new Date value
        else if key[0] is 'answered'
          asked = module.get("asked")          
          return if asked is 0 then 0 else value/asked
        else
          return value        
      
      @models.reverse() if direction is "DESC"
      @trigger "sort"

  exports.Projects = @Backbone.Collection.extend
    model: models.Project
    url: "/project"
    
  exports.Tasks = @Backbone.Collection.extend
    model: models.Task
    url: "/task"      

  exports.Bills = @Backbone.Collection.extend
    model: models.Bill
    url: "/profile/view_bills"

  exports.GithubEvents = @Backbone.Collection.extend
    model: models.GithubEvent
    
    initialize: (options={})->
      # init      
      {@language, @owner, @repo} = options
      # check
      @language ||= ""
      @repo     ||= ""
      @owner    ||= ""
    
    url: ->
      return "/modules/#{@language}/#{@owner}|#{@repo}/github_events/json"  
    
  
  exports.StackOverflowQuestions = @Backbone.Collection.extend
    model: models.StackOverflowQuestion
    
    chartMap: (name)->
      return {
        name: name,
        values: @where {key: name}
      }
    
    parse: (r)->
      {@statistics, questions} = r    
      
      return [] unless questions.length > 0       
      
      ###
        Add normalization
      ###
      items = []
      _.each @statistics.keys, (key)=>
        list = _.where questions, {key}        
        items.push _.last(list)  
      
      maxTS = _.max items, (item)=>
        return item.timestamp
      
      _.each items, (item)=>
        i = _.extend {}, item
        i.timestamp = maxTS.timestamp
        i._id += "_copy"
        questions.push i
      
      questions
    
    keys: ->
      return @statistics.keys || []
    
    initialize: (options={})->
      _.bindAll @, "chartMap"
      
      # init      
      {@language, @owner, @repo} = options
      # check
      @language ||= ""
      @repo     ||= ""
      @owner    ||= ""
    
    url: ->
      return "/modules/#{@language}/#{@owner}|#{@repo}/stackoverflow/json"    
      

).call(this, (if typeof exports is "undefined" then this["collections"] = {} else exports), (typeof exports isnt "undefined"))
