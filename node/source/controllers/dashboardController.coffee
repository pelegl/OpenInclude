_ = require 'underscore'
BasicController = require('./basicController')
{get_models} = require("../conf")

[Project] = get_models ["Project"]

class DashboardController extends BasicController

  index: ->
    @context.title = 'Dashboard'
    @context.body = @_view 'dashboard/dashboard', @context
    @res.render 'base', @context

  project: ->
    project = Project.findById(@get[0], (result, project) =>
      if result
        @res.status 404
        @res.end "Project not found"
        return

      Project.find()
        .or([
          {"client.id": @req.user._id},
          {"read.id": @req.user._id},
          {"write.id": @req.user._id},
          {"grant.id": @req.user._id},
          {"resources.id": @req.user._id}
        ])
        .select()
        .sort({path: "asc"})
        .exec((result, projects) =>
          if result
            res.json({success: false, error: result})
          else
            @context.title = project.get('name')
            @context.project = project.toJSON()
            @context.projects = projects
            @context.canEdit = (user, project) ->
              if user._id is project.client.id then return true
              for _user in project.write
                if _user.id is user._id then return true
              false
            @context.body = @_view 'dashboard/dashboard', @context
            @res.render 'base', @context
        )
    )

module.exports = (req, res)->
  new DashboardController req, res
