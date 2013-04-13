class views.Blog extends View
  events:
    'click #new-post': "newPost"

  newPost: (e) ->
    e.preventDefault()
    e.stopPropagation()

    @form.show()

  updateData: ->
    @collection.fetch()

  initialize: (context) ->
    super context

    @listenTo @collection, "sync", @render

  render: ->
    @context.posts = @collection.toJSON()
    html = tpl['member/blog'](@context)
    @$el.html html

    if @form
      @stopListening @form
      delete @form

    @form = new views.NewPost @context
    @listenTo @form, "success", @updateData

    @