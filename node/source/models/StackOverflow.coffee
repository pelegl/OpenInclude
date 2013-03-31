ObjectId = require('mongoose').Schema.Types.ObjectId

definition =  
  module_id : [{type: ObjectId, ref: 'Module'}]
  body: String
  view_count: Number
  title: String
  last_activity_date: Number
  answer_count: Number
  creation_date: Number
  score: Number
  link: String
  tags: []
  comments: []
  answers: []
  is_answered: Boolean
  last_edit_date  : Number
  owner: {}
  _id:
    type: Number
    unique: true
  accepted_answer_id: Number


statics =
  # get questions
  get_questions_for_module: (module_id, stopTS, callback) ->
    query  = {module_id, last_activity_date: {$gte: stopTS}}
    fields = "question_id creation_date accepted_answer_id answers.is_accepted answers.last_activity_date"
    @find query, fields,


  questionsStatistics: (module_ids, callback)->
    query =
      $match:
        module_id:
          $in: module_ids

    unwind =
      $unwind: "$module_id"

    project =
      $project:
        module_id: 1
        has_answer: {$cond:[{$ifNull: ["$accepted_answer_id", false]}, 1, 0]}

    group =
      $group:
        _id: "$module_id"
        asked: {$sum: 1}
        answered: {$sum: "$has_answer"}


    @aggregate query, unwind, query, project, group, callback


  questionsAskedDetailed: (module_id, stopTS, callback)->
    query =
      $match: {module_id, creation_date: {$gte: stopTS}}

    project =
      $project:
        timestamp: "$creation_date"

    sort =
      $sort:
        creation_date : 1

    @aggregate query, sort, project, callback

  questionsAnswered: (module_id, stopTS, callback)->
    match =
      $match: {module_id, creation_date: {$gte: stopTS}, accepted_answer_id: {$exists: true}}

    project =
      $project:
        answers: 1

    unwind =
      $unwind: "$answers"

    match_unwind =
      $match:
        "answers.is_accepted" : true

    project_unwind =
      $project:
        timestamp: "$answers.creation_date"

    sort =
      $sort :
        timestamp: 1

    @aggregate match, project, unwind, match_unwind, project_unwind, sort, callback


index = [
  [{module_id: 1, last_activity_date: 1, timestamp: 1}]
]


exports.statics = statics
exports.index = index
exports.modelName  = "module_so_results"
exports.definition = definition

