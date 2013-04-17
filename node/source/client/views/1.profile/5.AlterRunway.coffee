class views.AlterRunwayForm extends InlineForm
  el: "#alter-runway-inline"
  view: "member/alter_runway"

  initialize: (context) ->
    @model = context.model
    super context

  validate: (data) ->
    if !parseInt(data.data)
      @validation = "Only positive integers are accepted"
      return false

    if parseInt(data.data) < 0 or parseInt(data.data) < @context.limit
      @validation =  "Runway must be higher than or equal to #{@context.limit}"
      return false

    true