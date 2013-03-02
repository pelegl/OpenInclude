((exports, isServer) ->
  if isServer
    @Backbone = require 'backbone'        
  root = @
  
  String.prototype.capitalize = ->
    return @charAt(0).toUpperCase() + @slice(1)

  exports.qs = 
    stringify:(obj)->
      string = []
      for key, value of obj
        if value?
          if _.isArray(value)
            string.push "#{key}=#{v}" for v in value when v?
          else if _.isObject(value)
            continue
          else
            string.push "#{key}=#{value}"
      string.join('&')

    parse:(string)->
      s = string.split('?', 2)[-1..].pop()
      if s.length <= 1 then return {}
      result = {}
      for chunk in s.split('&')
        key = chunk.split('=',2)[0]
        value = chunk.split('=',2)[1]
        if _.indexOf((i for i of result),key) > -1
          if _.isArray(result[key])
            result[key].push value 
          else
            result[key] = [result[key],value]
        else result[key] = value
      result
      
      
      
).call(this, (if typeof exports is "undefined" then this["help"] = {} else exports), (typeof exports isnt "undefined"))