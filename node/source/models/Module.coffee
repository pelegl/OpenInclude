###
  Config
###
{ObjectId}   = require('mongoose').Schema.Types
{get_models, git} = require '../conf'
async        = require 'async'
_            = require 'underscore'

[StackOverflow , Stargazers] = get_models ["StackOverflow", "ModuleStargazers"]


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
  

statics =
  get_module: (name, callback)->
    @findOne {module_name: name}, callback 

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
  
  create_subscription: (callback) ->
    ###
      TODO: not working, only allowed on repositories you own?
    ###
    message =
      user: @username
      repo: @module_name
      name: "openinclude"
      config:
        url : "http://ec2-107-20-8-160.compute-1.amazonaws.com:8600/git/webhook"
        content_type: "json"
      events: ["push", "watch"]
    
    #console.log message
    
    #git.repos.createHook message, (err, response)=>
    #  console.log err, response
    
    callback "Not implemented"
  
    
 
  get_questions: (opts..., callback)->
    # params
    amount = opts[0] || 365
    
    # edge date
    stopDate  = new Date()
    stopDate.setDate -amount    
    # edge ts
    stopTS = stopDate.getTime() / 1000 # convert so seconds
    
    #async tasks
    Tasks = {} 
    
    #Questions before day X    
    Tasks.statistics = (statistics)=>
      StackOverflow.aggregate {
        $match:
          module_id: @_id
          last_activity_date:
            $lt: stopTS
      } , { 
        $project:                    
          accepted_answer_id : {$ifNull: ["$accepted_answer_id", -1]}                           
      } , {
        $project:
          accepted_asnwer_id :
            $cond: [{ $ne: ["$accepted_answer_id", -1] }, "Total questions asked", "Total questions answered"]
          count:
            $add: [1]
      } , {
        $group:
          _id: "$accepted_asnwer_id"
          num : 
            $sum: "$count"
      } , (err, data)=>
        response = {total: 0, answered: 0, keys: ["Total questions asked", "Total questions answered"]}
        async.forEach data, (item, call)=>
          response.total    += item.num
          response.answered += item.num if item._id is "true"         
          call null
        , =>
          statistics err, response
    
    #Questions after day X
    Tasks.questions = ["statistics", (questions, results)=>
      #copy object so we do not alter it
      statistics = _.extend {}, results.statistics
      #get new questions
      StackOverflow.find({module_id: @_id, last_activity_date: {$gte: stopTS}}, "question_id last_activity_date accepted_answer_id answers.is_accepted answers.last_activity_date").sort({last_activity_date:1}).exec (err, q)=>
        return questions err if err?
        output = []
        async.each q, (question, call_each)=>
          # add point to total series
          output.push {_id: question.question_id, amount : ++statistics.total, key: "Total questions asked", timestamp: question.last_activity_date }
                    
          # add point to answer series
          if question.accepted_answer_id?
            # detect answer            
            async.detect question.answers, (answer, call_detect)=>
              call_detect answer.is_accepted is true
            , (answer)=>              
              # add point
              output.push {_id: "#{question.question_id}_answered", amount : ++statistics.answered, key: "Total questions answered", timestamp: answer.last_activity_date }
              call_each null
          else          
            call_each null
        , =>
          questions null, output
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