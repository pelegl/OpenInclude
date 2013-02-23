((exports, isServer) ->
  api = "/api/v.1"
  if isServer
    @Backbone = require 'backbone'
    
  exports.Discovery = @Backbone.Collection.extend  
    parse:(r)->
      r.response ? []
    
    model: models.Discovery
    url: "/discover/search"    
 
    maxRadius: ->
      return d3.max @models, (data)=>
        return data.radius()                
    
    languageList: ->
      return if @groupedModules then _.keys @groupedModules else [] 
    
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
        value = if $.isArray key then module.get(key[0])[key[1]] else module.get key
        if key[1] is 'pushed_at'
          return new Date value
        else
          return value        
      
      @models.reverse() if direction is "DESC"
      @trigger "sort"
      
      
      

).call(this, (if typeof exports is "undefined" then this["collections"] = {} else exports), (typeof exports isnt "undefined"))
