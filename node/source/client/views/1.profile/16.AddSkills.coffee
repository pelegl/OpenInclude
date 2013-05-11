class views.AddSkills extends InlineForm
  el: "#add-skills-inline"
  view: "member/add_skills"

  events:
    "click .tagit > i": "removeSkill"
    "click .link  > i": "removeLink"

    'submit form': "submit"
    'click  button[type=submit]': "preventPropagation"
    'click .close-inline': "hideButton"
    'click .skill-list' : "focus"
    'click .skill-list > li' : "preventPropagation"


  submit: (e) ->
    e.preventDefault()

    if @$(".link-new > input:focus").length > 0
      @addLink()
      return false

    ## skills ##
    skills = []
    @$(".skill-list .tagit").each (k,v)->
      skills.push $(this).data("value")
    @$("input[name=skill-list]").val JSON.stringify(skills)

    ## links ##
    links = []
    @$(".links-list .link").each (k,v)->
      links.push $(this).data("value")
    @$("input[name=link-list]").val JSON.stringify(links)

    super(e)

  success: (model, response, options) ->
    if response.success is true
      app.session.set response.user
    super

  removeLink: (e)->
    $this = $(e.currentTarget).closest("li")
    $this.remove()

  addLink: ->
    $input = @$(".links-list .link-new > input")
    val    = $input.val()

    unless /^https?/.test(val)
      val = "http://#{val}"

    unless val.length < 2083 && val.match(/^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i)
      return true

    ## clear input ##
    $input.val ""

    ## form new link ##
    tpl = @link_tpl val
    $(tpl).insertBefore $input.parent()

    false


  removeSkill: (e) ->
    e.stopPropagation()
    $(e.currentTarget).parent().remove()
    false

  initialize: (context) ->
    @model = context.userModel.clone()
    @model.url = "/session/profile/#{@model.get('_id')}"

    super context

  setType: (type) ->
    @context.type = type

  link_tpl: (link)->
    return "<li class='link' data-value='#{link}'><i>&times;</i><a href='#{link}'>#{link}</a></li>"

  skill_tpl: (skill)->
    return "<li class='tagit label label-info' data-value='#{skill}' >#{skill}<i>&times;</i></li>"

  focus: ->
    @$(".tagit-new input").focus()
    false

  show: () ->
    if @context.type == 'reader'
      @context.about_me = app.session.get("info_reader")
      @context.skills   = app.session.get("skills_reader")
      @context.links    = app.session.get("links_reader")
    else
      @context.about_me = app.session.get("info_writer")
      @context.skills   = app.session.get("skills_writer")
      @context.links    = app.session.get("links_writer")

    super

    skills = @$("#skills-autocomplete")

    skills.typeahead
      source: (query, process)->
        @map = {}
        users = []
        # get data
        @xhr.abort() if @xhr?
        @xhr = $.getJSON "/api/skills", {term: query}, (data)=>
          process data

      minLength: 1

      highlighter: (item)->
        regex = new RegExp('(' + @query + ')', 'gi')
        return item.replace(regex, "<strong>$1</strong>")

      updater: (item) =>
        $item = @$(".skill-list .tagit[data-value='#{item}']")
        unless $item.length > 0
          @$(".tagit-new").before @skill_tpl(item)
        ""