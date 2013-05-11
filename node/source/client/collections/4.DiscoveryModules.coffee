collections.Discovery = Backbone.Collection.extend
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

  getBestMatch: ->
    return @findWhere {_score : @maxScore }

  filters: {}

  fetch2: ->
    [query, opts...] = Array::slice.apply arguments
    query = query ? ""

    collection = this
    $.getJSON "#{collection.url}?q=#{query}" , (r)->
      collection.maxScore = r.maxScore
      collection.groupedModules = _.groupBy r.searchData, (module)=>
        return module.fields.language
      collection.reset r.searchData