models.Discovery = Backbone.Model.extend
  ###
      0.5 - super active - up to 7 days
      1.5 - up to 30 days
      2.5 - up to 180 days
      3.5 - more than 180
  ###
  idAttribute: "_id"

  x : -> # sets X coordinate on our graph
    # Getting initial values
    self = @get('_source')
    ####
    lastCommit = new Date(self.pushed_at).getTime()
    currentDate = new Date().getTime()
    difference_ms = currentDate - lastCommit # dates difference
    datesDifference = Math.round(difference_ms/help.oneDay)

    ###
      We interpolate data in the buckets, so that
        0.25 to 1 is the 1st bucket,
        1 to 1.75 is the second,
        1.75 to 3 is the 3rd,
        3 to 5 is the last one
    ###
    interpolate = (min, max, minDifference, maxDifference, value)->
      diff  = max-min
      pnt   = diff/(maxDifference-minDifference) # value per point
      curPoint = pnt*(value-minDifference)+min
      return if curPoint < max then curPoint else max

    if datesDifference > 180      then min = 3;    max = 5;    minDifference = 180;  maxDifference = 720
    else if datesDifference <= 7  then min = 0.25; max = 1;    minDifference = 0;    maxDifference = 7
    else if datesDifference <= 30 then min = 1;    max = 1.75; minDifference = 7;    maxDifference = 30
    else                               min = 1.75; max = 3;    minDifference = 30;   maxDifference = 180

    return interpolate(min,max,minDifference,maxDifference, datesDifference)
    ###
    return new Date(self.pushed_at)
    ###


  ###
    Sets y based on relevance, min: 0, max: 1
  ###
  y: (maxScore) ->
    score = @get('_score')
    return score/maxScore

  ###
    Sets radius of the circles
  ###
  radius: ->
    {watchers} = @get('_source')
    return watchers

  ###
    Color of the bubble
    TODO: make color persist in different searches
  ###
  color: ->
    return "#" + @get('color')

  ###
    Key
  ###
  key: ->
    return @id

  ###
    last commit - human
  ###
  lastCommitHuman: ->
    return humanize.relativeTime(new Date(@get('_source').pushed_at).getTime()/1000)

  ###
    overwrite toJSON, so we can add attributes from functions for hbs
  ###
  toJSON: (options) ->
    attr = _.clone this.attributes
    attr.lastCommitHuman = @lastCommitHuman()
    attr