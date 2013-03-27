collections.StackOverflowQuestions = Backbone.Collection.extend
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