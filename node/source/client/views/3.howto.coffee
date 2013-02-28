((exports) ->  
  root = @  
  views = @hbt = Handlebars.partials
  
  class exports.HowTo extends View

    initialize:->
      console.log '[__HowToView__] Init'      
      @render()
      
    render:->  
      html = views['how-to'](@context)      
      @$el.html html
      @$el.attr 'view-id', 'how-to'
      @

#-----------------------------------------------------------------------------------------------------------------------#
).call(this, window.views)