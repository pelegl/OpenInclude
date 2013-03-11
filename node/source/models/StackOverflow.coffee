ObjectId = require('mongoose').Schema.Types.ObjectId

definition =  
  module_id : {type: ObjectId, ref: 'Module'}
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
  question_id: Number  
  accepted_answer_id: Number
  


exports.modelName  = "module_so2" 
exports.definition = definition

