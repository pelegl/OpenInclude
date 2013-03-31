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

    # normalize dates
    currentDate = new Date().getTime()/1000

    # caching
    normalizeSeries = (series, startDate)=>
      if series.length is 0
        # normalize start date -- so its nice
        startDate   = new Date()
        startDate.setFullYear(startDate.getFullYear()-1)
        startDate.setHours(0)
        startDate.setMinutes(0)
        startDate.setSeconds(0)
        startDate.setDate(1)
        #
        startDate   = startDate.getTime()/1000

        data =
          amount: ask
          key:    askedKey

        questionStart = new @model _.extend {}, data, {timestamp: startDate,  _id: "start"}
        questionStop  = new @model _.extend {}, data, {timestamp: currentDate, _id: "stop"}

      else
        first     = _.first series
        last      = _.last  series
        # qStart
        questionStart = first.clone()
        questionStart.set {_id: "#{questionStart.get('_id')}_start", timestamp: startDate }
        # qStop
        questionStop = last.clone()
        questionStop.set {_id: "#{questionStop.get('_id')}_stop", timestamp: currentDate }

      series.unshift questionStart
      series.push    questionStop

      series


    _.each [askedQs, answeredQs], (qSeries)=>
      args = [qSeries]
      args.push _.first(qSeries).get("timestamp") if qSeries.length > 0
      normalizeSeries.apply this, args


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