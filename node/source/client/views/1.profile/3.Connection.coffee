class views.ConnectionForm extends InlineForm
  el: "#new-connection-inline"
  view: "member/new_connection"

  validate: (data) ->
    if data.reader == data.writer
      @validation = "Reader can not be same as writer"
      return false

    true

  initialize: (context) ->
    @model = new models.Connection
    super context

  show: ->
    super

    $reader = @$("input[name=reader]")
    $writer = @$("input[name=writer]")
    $ids = {}
    $ids['reader'] = @$("input[name=reader_id]")
    $ids['writer'] = @$("input[name=writer_id]")


    $reader.add($writer).typeahead
      source: (query, process)->
        @map = {}
        users = []
        # get data
        @xhr.abort() if @xhr?
        @xhr = $.getJSON "/session/list", {term: query}, (data)=>
          _.each data, (user)=>
            @map[user.label] = user
            users.push user.label
          process users

      minLength: 1

      updater: (item)->
        $ids[$(@.$element).attr("name")].val(@map[item].value)
        return item

      matcher: (item)->
        return true if item.toLowerCase().indexOf(@query.trim().toLowerCase()) != -1

      sorter: (items)->
        return items.sort()

      highlighter: (item)->
        regex = new RegExp('(' + @query + ')', 'gi')
        return item.replace(regex, "<strong>$1</strong>")