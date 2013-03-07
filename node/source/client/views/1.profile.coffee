((exports) ->  
  agreement_text = "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains. On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains. On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains. "
  root = @  
  views = @hbt = Handlebars.partials
        
  
  class exports.SignIn extends View
    initialize: ->
      console.log '[_signInView__] Init'
      @context.title = "Authentication"      
      @render()
    
    render: ->
      html = views['registration/login'](@context)
      @$el.html html
      @$el.attr 'view-id', 'registration'
      @
  
  
  class exports.Profile extends View
    events:
      'click .accountType a' : "accountUpgrade"
    
    clearHref: (href)->
      return href.replace "/#{@context.profile_url}", ""
    
    accountUpgrade: (e) ->
      $this = $(e.currentTarget)
      href  = $this.attr "href"      
      @setAction @clearHref href                
      false
    
    setAction: (action)->
      dev   = @clearHref @context.developer_agreement
      merc  = @clearHref @context.merchant_agreement
      
      
      if action is dev and app.session.get("employee") is false
          ###
            show developer license agreement
          ###
          app.navigate @context.developer_agreement, {trigger: false}          
          @agreement.$el.show()
          @agreement.setData agreement_text, @context.developer_agreement                    
      else if action is merc and app.session.get("merchant") is false
          ###
            show client license agreement
          ### 
          app.navigate @context.merchant_agreement, {trigger: false}          
          @agreement.$el.show()
          @agreement.setData agreement_text, @context.merchant_agreement          
      else
          ###
            hide agreement and navigate back to profile
          ###
          @agreement.$el.hide()
          app.navigate @context.profile_url, {trigger: false}
             
    initialize: ->      
      console.log '[__profileView__] Init'      
      @context.title = "Personal Profile"                  
      @agreement = new exports.Agreement
      
      @listenTo @model, "all", @render
      @model.fetch()            
      
      @render()      
      
    
    render: ->
      @context.user = @model.toJSON()
      html = views['member/profile'](@context)
      @$el.html html
      @$el.attr 'view-id', 'profile'
      
      # Append agreement
      @$(".informationBox").append @agreement.$el      
      
      @setAction @options.action
      
      @
      
    
#-----------------------------------------------------------------------------------------------------------------------#
).call(this, window.views)