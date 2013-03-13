###
  Config
###
{ObjectId}   = require('mongoose').Schema.Types
{get_models, git} = require '../conf'
async        = require 'async'
_            = require 'underscore'

[StackOverflow , Stargazers, Events] = get_models ["StackOverflow", "ModuleStargazers", "ModuleEvents"]


###
  Definition
###

definition =
  username: String
  description: String
  pushed: Date
  owner: String
  is_a_fork: Boolean
  watchers: Number
  stars: Number
  language: String
  created: Date
  pushed_at: Date
  followers: Number
  module_name : String  
  openinclude_followers: [{type: ObjectId, ref: 'User'}]
  github_subscriptions: [{
    url : String
    updated_at : Date
    created_at : Date
    name       : String
    events     : []
    active     : Boolean
    config     : {}
    id         : Number
  }]

ts_ago = (days, toSeconds=true)->
  # edge date
  stopDate = new Date()
  stopDate.setDate -days    
  # edge ts
  if toSeconds
    stopTS = Math.round(stopDate.getTime() / 1000) # convert so seconds
  else
    stopTS = stopDate.getTime()    
  stopTS

statics =
  get_module: (name, callback)->
    console.log "Started looking for the module"    
    try
      [owner, module_name] = name.split "|"
      if !owner or !module_name
        throw "incorrect module path" 
    catch e      
      return callback "incorrect module name"
            
    @findOne {module_name, owner}, callback 

methods =
  repo: ->
    return git.repo "#{@username}/#{@module_name}"

  list_stargazers: (params..., callback)->    
    @repo().stargazers params..., callback
  
  make_stargazers_snapshot: (stargazers, snaphost_date, callback) ->    
    snapshot_date = snapshot_date || new Date()
    async.forEach stargazers, (stargazer, async_call)=>
      Stargazers.create @_id, snapshot_date, stargazer, async_call
    ,callback
  
  ###
    @function
    Pulls all events for the given repo for the given time
  ###
  get_events: (opts..., callback)->
    stopTS = ts_ago (opts[0] || 365), false
    Events.pull_for_module stopTS, @_id, callback 
    
  ###  
    @function
    Functions pulls questions associated with the module for that past 365 days or opts[0], 
    sorts them by timestamp, creates additional series for answered questions,
    after that adds cummulative {@param amount - number} which indicates how many answers/questions been asked/answered at given timestamp 
  ###
  get_questions: (opts..., callback)->
    # params
    stopTS = ts_ago (opts[0] || 365)
    
    #async tasks
    Tasks = {} 
    
    #Questions before day X    
    Tasks.statistics = (statistics)=>
      match = { $match: {module_id: @_id, last_activity_date: {$lt: stopTS}} }
      project_one = { $project: {accepted_answer_id : {$ifNull: ["$accepted_answer_id", -1] } } }
      project_two =
        $project:
          accepted_asnwer_id :
            $cond: [{ $ne: ["$accepted_answer_id", -1] }, "Total questions asked", "Total questions answered"]
          count:
            $add: [1]
      group = { $group: {_id: "$accepted_asnwer_id", num : {$sum: "$count"}} }
            
      StackOverflow.aggregate match, project_one, project_two, group, (err, data)=>
        response = {total: 0, answered: 0, keys: ["Total questions asked", "Total questions answered"]}
        async.forEach data, (item, call)=>
          response.total    += item.num
          response.answered += item.num if item._id is "true"         
          call null
        , =>
          statistics err, response
    
    # Questions after day X
    Tasks.questions = ["statistics", (questions_callback, results)=>
      #copy object so we do not alter it      
      # set workflow
      workflow = {}
      # Query for questions      
      workflow.questions = (questions)=>
        # get new questions
        query  = {module_id: @_id, last_activity_date: {$gte: stopTS}}
        fields = "question_id creation_date accepted_answer_id answers.is_accepted answers.last_activity_date"        
        StackOverflow.find query, fields, questions
      
      # Push answered questions
      workflow.answered = ['questions', (return_questions, data)=>
        output = []
        async.each data.questions, (question, async_callback_each)=>
          # add point to total series
          output.push {_id: question.question_id, key: "Total questions asked", timestamp: question.creation_date }
          # detect if this question has an answer
          if question.accepted_answer_id?
            # get answer
            async.detect question.answers, (answer, call_detect)=>
              call_detect answer.is_accepted is true
            , (answer)=>
              # add answer
              output.push {_id: "#{question.question_id}_answered", key: "Total questions answered", timestamp: answer.last_activity_date, answer: true }
              async_callback_each null
          # return
          else 
            async_callback_each null
        ,(err) =>
          return_questions err, output           
      ]  
      
      # Sort data      
      workflow.sorted = ['answered', (questions, data)=>        
        async.sortBy data.answered, (question, async_callback)=>
          async_callback null, question.timestamp
        ,questions
      ]
      
      # Iterate over to add amount of questions
      workflow.final = ['sorted', (questions, data)=>
        # statistics
        # -- total
        # -- answered
        statistics = _.extend {}, results.statistics
        {sorted}   = data
        async.eachSeries sorted, (question, async_call)=>
          if question.answer is true            
            question.amount = ++statistics.answered
          else  
            question.amount = ++statistics.total
          
          async_call null
        , =>
          questions null, sorted  
      ]        
      
      async.auto workflow, (err, data)=>
        return questions_callback err if err?
        # else we've succeeded        
        questions_callback null, data.final
    ]
                    
    async.auto Tasks, callback        
      
virtuals = 
  get:
    url: -> return "https://github.com/#{@owner}/#{@module_name}"
  set: {}


options =
  toObject:
    virtuals: true
  toJSON: 
    virtuals: true

index = [ 
  [{stars : -1}]
]

exports.index      = index
exports.options  = options
exports.virtuals = virtuals
exports.definition = definition
exports.statics = statics
exports.methods = methods