class views.NewPost extends InlineForm
  el: "#new-post-inline"
  view: "member/new_post"

  initialize: (context) ->
    unless context.model
      @model = new models.Post
    super context

  setModel: (model) ->
    unless model
      @model = new models.Post
    else
      @model = model

  render: ->
    @context.post = @model.toJSON()

    super

    opts =
      container: 'epiceditor'
      textarea: 'content'
      basePath: '/static/epiceditor'
      clientSideStorage: true
      localStorageName: 'epiceditor'
      useNativeFullsreen: true
      parser: marked
      file:
        name: 'epiceditor'
        defaultContent: ''
        autoSave: 100
      theme:
        base:'/themes/base/epiceditor.css'
        preview:'/themes/preview/github.css'
        editor:'/themes/editor/epic-light.css'
      focusOnLoad: false
      shortcut:
        modifier: 18
        fullscreen: 70
        preview: 80

    @editor = new EpicEditor(opts)
    #@editor.on "save", (content) =>
    #  @updateContent content

  updateContent: (content) ->
    @$("input[name=content]").val(content.content)

  show: ->
    super
    @editor.load()