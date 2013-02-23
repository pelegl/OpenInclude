((exports, isServer) ->
   if isServer
    @Backbone = require 'backbone'
   
   helpers = 
    oneDay: 1000*60*60*24
   
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
        return @get('_source').language
        
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