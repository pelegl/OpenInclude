_ = require 'underscore'
BasicController = require('./basicController')
{get_models} = require("../conf")

[Project] = get_models ["Project"]

class DashboardController extends BasicController

  index: ->
    @context.title = 'Dashboard'
    @context.body = @_view 'dashboard/dashboard', @context
    @res.render 'base', @context

module.exports = (req, res)->
  new DashboardController req, res
