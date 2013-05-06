class views.AddSkills extends InlineForm
  el: "#add-skills-inline"
  view: "member/add_skills"

  events:
    "click .skill > i": "removeSkill"

    'submit form': "submit"
    'click button[type=submit]': "preventPropagation"
    'click .close-inline': "hideButton"

  removeSkill: (e) ->
    e.preventDefault()
    e.stopPropagation()

    skill = $(e.currentTarget).parent("span").attr("data-value")
    index = @skills.indexOf skill
    if index >= 0
      @skills.splice(index, 1)
      @updateSkillList()

  initialize: (context) ->
    @model = context.userModel
    @model.url = "/session/profile/#{@model.get('_id')}"

    super context

  setType: (type) ->
    @context.type = type

  updateSkillList: () ->
    list = @$("#skill-list")
    list.empty()
    for skill in @skills
      $skill = $("<span class='skill well well-small' data-value='#{skill}'>#{skill}<i>&times;</i></span>")
      list.append $skill
    @$("input[name=skill-list]").val @skills.join ","

  show: () ->
    super()

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