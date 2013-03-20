((exports) ->  
  root = @  
  views = @hbt = _.extend({}, dt, Handlebars.partials)
  col = root.collections

  class exports.NotFound extends @Backbone.View
    className: "error-404"

    render: ->
      @$el.html "Error 404 - not found"
      @

  class exports.MetaView extends @Backbone.View
    events: {}
    
    initialize: ->
      @Languages = new col.Language
      
      console.log '[__metaView__] Init'      

  class exports.Loader extends @Backbone.View
    tagName: 'img'
    attributes:
      src: "/static/images/loader.gif"
  
  class exports.Agreement extends @Backbone.View
    tagName  : 'div'
    className: 'row-fluid agreementContainer'
    
    events: 
      'submit form' : 'processSubmit'

    show: ->
      @$el.show()

    hide: ->
      @$el.hide()

    processSubmit: (e) ->
      e.preventDefault()
      ###
        Perform async form process
      ###
      isChecked = @$("[name=signed]").prop "checked"
      if isChecked
        @model.save { signed: "signed" }
      else
        ##TODO: handle error
               
      return false
    
    signed: ->
      app.navigate app.conf.profile_url, {trigger: true}
    
    initialize: ->
      @model = new models.Tos            
      if $(".agreementContainer").length > 0
        @setElement $(".agreementContainer") 
      else
        @render()
      
      {agreement, action} = @options      
      @listenTo @, "init", @niceScroll
      @listenTo @model, "sync", @signed
                  
      @setData agreement, action

    renderData: ->
      output = views['member/agreement'](@context)
      @$el.html $(output).unwrap().html()
      @trigger "init"
    
    setData: (agreement, action)->
      #TODO: too many renders - need to fix this
      console.log arguments
      @context = 
        agreement_text: agreement
        agreement_signup_action: action
      @model.url = @context.agreement_signup_action
      @renderData()
    
    niceScroll: ->
      if @$(".agreementText").is(":visible")
        @$(".agreementText").niceScroll()
      @delegateEvents()
      
    render: ->
      html = views['member/agreement'](@context || {})
      @$el = $ html
      @delegateEvents()
      @        
      
  
  root.View = class View extends @Backbone.View
    tagName:'section'
    className: 'contents'
    viewsPlaceholder: '#view-wrapper'
    
    constructor:(opts={})->
      @context = _.extend {}, app.conf
      
      unless opts.el?
        opts.el = $("<section class='contents' />")
        if app.meta.$('.contents').length > 0
          app.meta.$('.contents').replaceWith(opts.el)
        else
          app.meta.$el.append(opts.el)     
      else
        $(window).scrollTop 0      
      super opts

  class exports.Index extends View
    initialize:->
      console.log '[__indexView__] Init'
      @context.title = "Home Page" 
      @render()

    render:->  
      html = views['index'](@context, null, @context.partials)
      @$el.html html
      @$el.attr 'view-id', 'index'
      @

  class exports.ShareIdeas extends @Backbone.View
    events: 
      'click .share-ideas': 'toggleShow'
      'click .close': 'toggleShow'
      'click .submit': 'submit'
    
    initialize: ->
      console.log '[__ShareIdeasView__] Init'      

    toggleShow: ->
      $('.share-common').toggleClass('show')

    submit: ->
      $email = $ '#email'
      $ideas = $ '#ideas'
      $self = $ '.submit'

      $self.addClass 'disabled'
      $self.html "<img src=\"#{app.conf.STATIC_URL}images/loader.gif\" alt=\"Loading...\" class=\"loader\" />"

      $.post('/share-idea',
          {email: $email.val(), ideas: $ideas.val()},
          (data) ->
            if (data.status == 'success') 
              $self.html('Success')
            else
              $self.html('Error occured')

            setTimeout(() ->
              $('.share-common').toggleClass('show')
              setTimeout(() ->
                $self.removeClass('disabled').html('Submit')
                $email.val('')
                $ideas.val('')
              , 500)
            , 1000)

      )


#-----------------------------------------------------------------------------------------------------------------------#
).call(this, window.views = {})
