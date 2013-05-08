class views.AddSkills extends InlineForm
  el: "#add-skills-inline"
  view: "member/add_skills"

  events:
    "click .tagit > i": "removeSkill"

    'submit form': "submit"
    'click  button[type=submit]': "preventPropagation"
    'click .close-inline': "hideButton"
    'click .skill-list' : "focus"
    'click .skill-list > li' : "preventPropagation"

  removeSkill: (e) ->
    e.stopPropagation()

    skill = $(e.currentTarget).parent("li").attr("data-value")
    index = @skills.indexOf skill
    if index >= 0
      @skills.splice(index, 1)
      @updateSkillList()

    false

  initialize: (context) ->
    @model = context.userModel.clone()
    @model.url = "/session/profile/#{@model.get('_id')}"

    super context

  setType: (type) ->
    @context.type = type

  skill_tpl: (skill)->
    return "<li class='tagit label label-info' data-value='#{skill}' >#{skill}<i>&times;</i></li>"

  focus: ->
    @$(".tagit-new input").focus()
    false

  updateSkillList: () ->
    list = @$("#skill-list")
    list.children(".tagit").remove()
    input = list.find(".tagit-new")
    for skill in @skills
      $skill = $ @skill_tpl(skill)
      input.before $skill

    @$("input[name=skill-list]").val @skills.join ","

  show: () ->
    super

    skills = @$("#skills-autocomplete")
    @skills = []

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
        unless @skills.indexOf(item) >= 0
          @skills.push item
        @updateSkillList()
        ""