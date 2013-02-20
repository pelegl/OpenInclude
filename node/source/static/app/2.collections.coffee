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
      [query, a..., next] = Array::slice.apply arguments
      query = query ? ""
      next = next ? (->)      
      instance = new @
      $.getJSON "#{instance.url}?q=#{query}" , (r)->
        console.error r.error if r.error?
        for i in r.response ? []
          instance.add i
        next r.error, instance
      instance

).call(this, (if typeof exports is "undefined" then this["collections"] = {} else exports), (typeof exports isnt "undefined"))
