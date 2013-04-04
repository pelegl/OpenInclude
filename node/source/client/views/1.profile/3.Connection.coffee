class views.ConnectionForm extends InlineForm
  el: "#new-connection-inline"
  view: "member/new_connection"

  initialize: (context) ->
    @model = new models.Connection
    super context

    ###
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
    ###

    $reader = @$("input[name=reader]")
    $writer = @$("input[name=writer]")

    $reader.add($writer).typeahead
      source: (query, process)->
        @map = {}
        users   = []
        # get data
        @xhr.abort() if @xhr?
        @xhr = $.getJSON "/session/list", {term: query}, (data)=>
          _.each data, (user)=>
            @map[user.label] = user
            users.push user.label
          process users


      minLength: 1

      updater: (item)->
        selectedState = @map[item].value
        return item

      matcher: (item)->
        return true if item.toLowerCase().indexOf(@query.trim().toLowerCase()) != -1

      sorter: (items)->
        return items.sort()

      highlighter: (item)->
        regex = new RegExp( '(' + @query + ')', 'gi' )
        return item.replace( regex, "<strong>$1</strong>" )


