((exports) ->  
  root = @  
  views = @hbt = Handlebars.partials
  

  class exports.MetaView extends @Backbone.View
    events: {}
    
    initialize: ->
      console.log '[__metaView__] Init'      


  root.View = class View extends @Backbone.View
    tagName:'section'
    className: 'contents'
    viewsPlaceholder: '#view-wrapper'
    
    constructor:(opts={})->
      @context =
        STATIC_URL : app.conf.STATIC_URL
        in_stealth_mode: false
      
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
      html = views['index'](@context)
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
