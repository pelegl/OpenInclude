class views.Blog extends View
  events:
    'click #new-post': "newPost"
    'click a[data-target=edit]': "editPost"
    'click .delete-post': "deletePost"

  deletePost: (e) ->
    e.preventDefault()
    e.stopPropagation()

    id = e.currentTarget.attributes['data-id'].value
    post = @collection.get(id)

    post.destroy(
      success: (model, response) =>
        if response.success
          @collection.remove(model)
        else
          alert response.error
    )

  editPost: (e) ->
    e.preventDefault()
    e.stopPropagation()

    id = e.currentTarget.attributes['data-id'].value
    post = @collection.get(id)

    @form.setModel(post)
    @form.show()

  newPost: (e) ->
    e.preventDefault()
    e.stopPropagation()

    @form.setModel()
    @form.show()

  updateData: ->
    @collection.fetch()

  initialize: (context) ->
    super context

    @listenTo @collection, "sync", @render
    @listenTo @collection, "remove", @render

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