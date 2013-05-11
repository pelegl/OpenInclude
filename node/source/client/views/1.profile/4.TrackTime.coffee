class views.TrackTimeForm extends InlineForm
  el: "#track-time-inline"
  view: "member/track_time"

  initialize: (context) ->
    @model = new models.Runway
    @model.url += "/#{context.suffix}"

    super context

  validate: (data) ->
    if !parseInt(data.worked) or parseInt(data.worked) < 0
      @validation =  "Only positive integers are accepted as amount"
      return false

    if parseInt(data.worked) > @context.limit
      @validation = "Time limit exceeded!"
      return false

    true