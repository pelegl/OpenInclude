#Stripe Plugin
StripePlugin = (schema, options) =>
  schema.add
  	project_id:Number
    hours_worked:Number
    project_started:Date
    project_tier:String
  	
  schema.pre "save", (next) ->
    @project_id = options.project_id if options.project_id
    @hours_worked = options.hours if options.hours
    @project_started = options.project_started if options.project_started
    @project_tier = options.project_tier if options.project_tier
    next()

module.exports = StripePlugin