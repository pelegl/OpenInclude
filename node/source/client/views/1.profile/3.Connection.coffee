class views.ConnectionForm extends InlineForm
  el: "#new-connection-inline"
  view: "member/new_connection"

  initialize: (context) ->
    @model = new models.Connection
    super context

    @$el.find("input[name=reader]").autocomplete(
      source: "/session/list",
      minLength: 2,
      select: (e, ui) ->
        $(@).val(ui.item.label)
        $(@).parent().find("input[name=reader_id]").val(ui.item.value)
        false
    )

    @$el.find("input[name=writer]").autocomplete(
      source: "/session/list",
      minLength: 2,
      select: (e, ui) ->
        $(@).val(ui.item.label)
        $(@).parent().find("input[name=writer_id]").val(ui.item.value)
        false
    )