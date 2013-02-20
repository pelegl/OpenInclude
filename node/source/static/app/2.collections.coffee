((exports, isServer) ->
  api = "/api/v.1"
  if isServer
    @Backbone = require 'backbone'
    
  exports.Discovery = @Backbone.Collection.extend  
    parse:(r)->
      r.response ? []
    
    model: models.Discovery
    url: "/discovery/search"    
    
    find: ->
      [query, opts...] = Array::slice.apply arguments
      query = query ? ""
            
      collection = this
      $.getJSON "#{instance.url}?q=#{query}" , (r)->        
        collection.add r

).call(this, (if typeof exports is "undefined" then this["collections"] = {} else exports), (typeof exports isnt "undefined"))
