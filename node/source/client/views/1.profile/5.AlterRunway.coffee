class views.AlterRunwayForm extends InlineForm
  el: "#alter-runway-inline"
  view: "member/alter_runway"

  initialize: (context) ->
    @model = context.model
    super context

  submit: (event) ->
    event.preventDefault()
    event.stopPropagation()

    data = Backbone.Syphon.serialize event.currentTarget
    if parseInt(data.data) + @context.current < @context.limit
      alert "Runway must be higher than or equal to #{@context.limit}"
      return false
    else
      data.data = parseInt(data.data) + @context.current
      super event, data