class views.NewPost extends InlineForm
  el: "#new-post-inline"
  view: "member/new_post"

  initialize: (context) ->
    @model = new models.Post
    super context

  render: ->
    super

    opts =
      container: 'epiceditor'
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
    @editor.on "save", (content) =>
      @updateContent content

  updateContent: (content) ->
    @$("input[name=content]").val(content.content)

  show: ->
    super
    @editor.load()