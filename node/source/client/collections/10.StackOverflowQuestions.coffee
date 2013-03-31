collections.StackOverflowQuestions = Backbone.Collection.extend
  model: models.StackOverflowQuestion

  chartMap: (name)->
    return {
      name: name,
      values: this[name]
    }

  parse: (r)->
    {@statistics, questions} = r
    ###
      Add normalization
    ###
    items = []
    {asked, answered} = questions

    # counters
    ask = @statistics.total
    ans = @statistics.answered
    [askedKey, answeredKey] = @statistics.keys

    # mappings
    @[askedKey] = askedQs = _.map asked, (question)=>
      question.amount  = ++ask
      question.key     = askedKey
      return new @model question

    @[answeredKey] = answeredQs = _.map answered, (question)=>
      question.amount  = ++ans
      question.key     = answeredKey
      question._id    += "_answered"
      return new @model question

    # caching

    return askedQs.concat(answeredQs)

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
    return "/modules/#{encodeURIComponent(@language)}/#{@owner}|#{@repo}/stackoverflow/json"