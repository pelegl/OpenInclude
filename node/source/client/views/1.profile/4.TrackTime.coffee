class views.TrackTimeForm extends InlineForm
  el: "#track-time-inline"
  view: "member/track_time"

  initialize: (context) ->
    @model = new models.Runway
    @model.url += "/#{context.suffix}"

    super context

  submit: (event) ->
    event.preventDefault()
    event.stopPropagation()

    data = Backbone.Syphon.serialize event.currentTarget
    if parseInt(data.worked) > @context.limit
      alert "Time limit exceeded!"
      return false
    else
      super event