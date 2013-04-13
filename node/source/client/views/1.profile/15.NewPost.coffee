class views.NewPost extends InlineForm
  el: "#new-post-inline"
  view: "member/new_post"

  initialize: (context) ->
    @model = new models.Post
    super context