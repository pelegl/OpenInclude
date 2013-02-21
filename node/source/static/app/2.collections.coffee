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
    
    fetch: ->
      [query, opts...] = Array::slice.apply arguments
      query = query ? ""
            
      collection = this
      $.getJSON "#{collection.url}?q=#{query}" , (r)->
        collection.maxScore = r.maxScore        
        collection.reset r.searchData
  
  exports.DiscoveryComparison = @Backbone.Collection.extend
    model: models.Discovery

).call(this, (if typeof exports is "undefined" then this["collections"] = {} else exports), (typeof exports isnt "undefined"))
