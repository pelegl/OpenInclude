views.DiscoverChartPopup = Backbone.View.extend
  tagName: "div"
  className: "popover"

  initialize: ->
    @moduleName = $("<h4 />").addClass("moduleName")
    @moduleLanguage = $("<h5 />").addClass("moduleLanguage")
      .append("<span class='color' />")
      .append("<span class='name' />")
    @moduleDescription = $("<p />").addClass("moduleDescription")
    @moduleStars = $("<div />").addClass("moduleStars")

    @render()

  render: ->
    @$el.appendTo @options.scope
    @$el.hide().append @moduleName, @moduleLanguage, @moduleDescription, @moduleStars
    @

  show: ->
    @$el.show()
    @

  hide: ->
    @$el.hide()
    @

  setData: (datum, $this, scope) ->

    width = height = datum.radius*2
    {x,y,color,source} = datum

    stars = source.watchers
    lastContribution = humanize.relativeTime new Date(source.pushed_at).getTime()/1000

    activity = $("<p class='activity' />").html("<i class='icon-star'></i>Last checking <strong>#{lastContribution}</strong>")
    activityStars = $("<p class='stars' />").html("<i class='icon-star'></i><strong>#{stars} stars</strong> on GitHub")

    @moduleName.text "#{source.owner}/#{source.module_name}"
    @moduleLanguage
      .find(".name").text(source.language).end()
      .find(".color").css({background: color})
    @moduleDescription.text source.description
    @moduleStars.html("").append activity, activityStars

    @show()

    @$el.css
      bottom: (@options.scope.outerHeight()-y-(@$el.outerHeight()/2)-15)+'px'
      left: x+@options.margin.left+(width/2)+15+'px'