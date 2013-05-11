collections.DiscoveryComparison = Backbone.Collection.extend
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