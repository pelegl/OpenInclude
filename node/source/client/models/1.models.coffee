((exports, isServer) ->
   if isServer
    @Backbone = require 'backbone'
   
   helpers = 
    oneDay: 1000*60*60*24
   
   exports.Session = @Backbone.Model.extend
     idAttribute: "_id"
     url: "/session"

   exports.Bill = @Backbone.Model.extend
     idAttribute: "_id"
     urlRoot:     "/profile/view_bills"

   exports.Tos        = @Backbone.Model.extend {}
   
   exports.CreditCard = @Backbone.Model.extend {}
   
   exports.User       = @Backbone.Model.extend
     idAttribute: "_id"
     url: "/session/profile"

   exports.Project    = @Backbone.Model.extend
     idAttribute: "_id"
     url: "/project"
     
   exports.Task       = @Backbone.Model.extend
     idAttribute: "_id"
     url: "/task"

   exports.TaskComment = @Backbone.Model.extend
     idAttribute: "_id"
   
   exports.Language = @Backbone.Model.extend
     idAttribute: "name"
     urlRoot: "/modules"
     
   exports.Repo     = @Backbone.Model.extend
     idAttribute: "_id"
     urlRoot: "/modules"
     url: ->
       return "#{@urlRoot}/#{@get('language')}/#{@get('owner')}|#{@get('module_name')}"
   
   exports.StackOverflowQuestion = @Backbone.Model.extend
     idAttribute: "_id"
     urlRoot: "/modules"
     url: ->
       return "#{@urlRoot}/all/all/stackoverflow/json/#{@get('_id')}"
      
     date: ->
       return new Date @get("timestamp")*1000
     
     x: ->
       return @get("timestamp")*1000
       
     y: ->
       return @get "amount"
   
   exports.GithubEvent = @Backbone.Model.extend
     idAttribute: "_id"
     urlRoot: "/modules"
     url: ->
       return "#{@urlRoot}/all/all/github_events/json/#{@get('_id')}"     
      
     x: ->       
       return new Date @get("created_at")     
     
         
    
   exports.Discovery = @Backbone.Model.extend
      ###        
          0.5 - super active - up to 7 days
          1.5 - up to 30 days
          2.5 - up to 180 days
          3.5 - more than 180
      ###
      idAttribute: "_id"
      
      x : -> # sets X coordinate on our graph
        # Getting initial values
        self = @get('_source')
        lastCommit = new Date(self.pushed_at).getTime()
        currentDate = new Date().getTime()
        difference_ms = currentDate - lastCommit # dates difference  
        datesDifference = Math.round(difference_ms/helpers.oneDay)
        
        lastCommitBucket = (difference)=>
          if difference > 180
            return 3.5
          else if difference <= 7
            return 0.5
          else if difference <= 30
            return 1.5
          else
            return 2.5

        lastCommitBucket datesDifference
        
      ###
        Sets y based on relevance, min: 0, max: 1
      ###
      y: (maxScore) ->
        score = @get('_score')
        return score/maxScore
      
      ###
        Sets radius of the circles
      ###
      radius: ->        
        {watchers} = @get('_source')
        return 10+watchers*5
      
      ###
        Color of the bubble
        TODO: make color persist in different searches
      ###
      color: ->
        return "#" + @get('color')
        
      ###
        Key
      ###
      key: ->
        return @id 
        
      ###
        last commit - human
      ###
      lastCommitHuman: ->
        return humanize.relativeTime(new Date(@get('_source').pushed_at).getTime()/1000)
      
      ###
        overwrite toJSON, so we can add attributes from functions for hbs
      ###
      toJSON: (options) ->
        attr = _.clone this.attributes
        attr.lastCommitHuman = @lastCommitHuman()
        attr 
    

).call(this, (if typeof exports is "undefined" then this["models"] = {} else exports), (typeof exports isnt "undefined"))