((exports) ->  
  agreement_text = "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains. On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains. On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains. "
  root = @  
  views = @hbt = _.extend({}, dt, Handlebars.partials)
        
  
  class exports.SignIn extends View
    events:
      'click .welcome-back .thats-not-me': 'switchUser'

    switchUser: ->
      app.session.unload()
      @render()
      false

    initialize: ->
      console.log '[_signInView__] Init'

      @context.title = "Authentication"
      @listenTo app.session, "sync", @render

      @render()
    
    render: ->
      @context.user  = app.session.user || null

      @$el.html views['registration/login'] @context
      @$el.attr 'view-id', 'registration'
      @

  class exports.Bill extends @Backbone.View
    className: "bill"

    initialize:  ->
      _.bindAll this, "initialize"


      {billId} = @options
      bill     = @collection.get billId
      if bill
        @model = bill
        @render()
      else
        @collection.once "sync", @initialize

    render: ->
      bill = @model.toJSON()
      html = views['member/bill'] {bill}

      help.exchange this, html

      @


  class exports.Bills extends @Backbone.View
    className: "bills"

    initialize: ->
      @collection = new collections.Bills

      @listenTo @collection, "sync", @render

      @collection.fetch()

    render: ->
      # bills
      {view_bills} = app.conf
      bills = @collection.toJSON()
      html  = views['member/bills'] {bills, view_bills}

      help.exchange this, html

      @


  class exports.CC extends @Backbone.View    
    className: "dropdown-menu"
    
    events:
      'click  form' : "stopPropagation"
      'submit form' : "updateCardData"
    
    stopPropagation: (e) ->
      console.log "prop"
      e.stopPropagation()
    
    updateCardData: (e) ->
      e.preventDefault()
      data = Backbone.Syphon.serialize e.currentTarget
      
      @$("[type=submit]").addClass("disabled").text("Updating information...")
      
      @model.set data
      @model.save null, {success: @processUpdate, error: @processUpdate}        
      
      return false
    
    processUpdate: (model, response, options) ->      
      if response.success is true        
        app.session.set {has_stripe: true}
      else
        #TODO: do error handling        
    
    initialize: ->
      @model     = new models.CreditCard
      @model.url = app.conf.update_credit_card
      
      _.bindAll @, "processUpdate"
      @context  = _.extend {}, app.conf
      
      $el  = $(".setupPayment .dropdown-menu")
      if $el.length > 0
        @setElement $el               
      else
        @render()                      
          
    render: ->
      html = views['member/credit_card'](@context)
      @$el.html $(html).html()                
      @

  
  class exports.Profile extends View
    events:
      'click a.backbone'             : "processAction"
      'click .setupPayment > button' : "update_cc_events"    
    
    update_cc_events: (e) ->    
      @cc.delegateEvents()                      
      $(e.currentTarget).dropdown 'toggle'      
    
    clearHref: (href)->
      return href.replace "/#{@context.profile_url}", ""

    processAction: (e) ->
      $this  = $(e.currentTarget)
      href   = @clearHref $this.attr "href"

      [action, @get...] = _.without href.split("/"), ""

      @setAction "/#{action}"
      false    

    empty: (opts...)->
      @informationBox.children().detach()
      if opts?
        @informationBox.append opts

    setAction: (action)->

      dev           = @clearHref @context.developer_agreement
      merc          = @clearHref @context.merchant_agreement
      trello		    = @clearHref @context.trello_auth_url
      bills         = @clearHref @context.view_bills


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

          @empty @agreement.$el

          @agreement.show()
          @agreement.setData agreement_text, @context.merchant_agreement
          
          @listenTo @agreement.model, "sync", @setupPayment

      else if action is trello
      	  ###
      	  	navigate to Trello authorization
		      ###
      	  app.navigate @context.trello_auth_url, {trigger: true}

      else if action is bills
          ###
            navigate to view bills
          ###

          console.log @get

          unless @get?.length > 0
            navigateTo = @context.view_bills
            # show bills
            @empty @bills.$el
          else
            navigateTo = "#{@context.view_bills}/#{@get.join("/")}"
            # show bill
            [billId] = @get
            if billId?
              billView = new exports.Bill {collection: @bills.collection, billId}
              @empty billView.$el
            else
              notFound = new exports.NotFound
              @empty notFound.$el


          app.navigate navigateTo, {trigger: false}
      else
          ###
            hide agreement and navigate back to profile
          ###
          @informationBox.children().detach()
          app.navigate @context.profile_url, {trigger: false}
             
    initialize: (options) ->      
      console.log '[__profileView__] Init'
      # get variables - we may use them for actions later on
      @get = options.opts || []

      if options.profile
          @model = new models.User
          @model.url = "/session/profile/#{options.profile}"
          @context.title = "Profile of #{@profile}"
          @context.private = false
      else
          @context.title = "Personal Profile"
          @context.private = true

          @agreement = new exports.Agreement
          @cc        = new exports.CC
          @bills     = new exports.Bills


      @listenTo @model, "change", @render
      @model.fetch()

      @render()

    
    render: ->
      console.log "Rendering profile view"
      console.log "action: ", @options.action, @get

      @context.user = @model.toJSON()
      html = views['member/profile'](@context)
      @$el.html html
      @$el.attr 'view-id', 'profile'

      @informationBox = @$ ".informationBox"

      # Append CC modal
      if @cc
          @cc.setElement @$(".setupPayment .dropdown-menu")      
          @cc.$el.prev().dropdown()

      if @context.private
          @setAction @options.action

      @
      
    
#-----------------------------------------------------------------------------------------------------------------------#
).call(this, window.views)