_ = require "underscore"
async = require "async"

{get_models} = require '../conf'

[Project, Task, User] = get_models ["Project", "Task", "User"]

parser = (str, callback) ->
  rTasks = /\#(\w+)\W*?/g
  rUsers = /\@(\w+)\W*?/g
  rProjects = /\+(\w+)\W*?/g

  parse = (r) ->
    (c) ->
      result = []
      while match = r.exec(str)
        result.push(match[1])
      c(null, result)

  async.parallel(
    tasks: parse(rTasks)
    users: parse(rUsers)
    projects: parse(rProjects)
    (error, result) ->
      callback(error, result)
  )

module.exports =
  list: (req, res) ->
    Project.find()
      .or([
        {"client.id": req.user._id},
        {"read.id": req.user._id},
        {"write.id": req.user._id},
        {"grant.id": req.user._id},
        {"resources.id": req.user._id}
      ])
      .select()
      .sort({path: "asc"})
      .exec((result, data) ->
        if result
          res.json({success: false, error: result})
        else
          res.json(data)
      )

  create: (req, res) ->
    req.body.project.client =
      {id: req.user._id, name: req.user.github_username}

    project = new Project(req.body.project)

    project.save((result, project) ->
      if result
        res.json({success: false, error: result})
      else
        # parse description and create tasks
        # also append resources
        async.series([
          (callback) ->
            if req.body.project.parent
              # need to create same read, write, grant, resources
              Project.findById(req.body.project.parent, (result, parent) ->
                project.read = parent.read
                project.write = parent.write
                project.grant = parent.grant
                project.resources = parent.resources
                callback(null, "done")
              )
            callback(null, "done")

          (callback) ->
            parser(project.description, (error, result) ->
              _.each(result.tasks, (task) ->
                t = new Task({name: task, project: project._id})
                t.save()
              )

              User.find({github_username: {$in: result.users}}, (result, data) ->
                if result then return res.json({success: true, error: result})

                ids = _.map(data, (user) ->
                  return {id: user._id, name: user.github_username}
                )

                project.resources = _.union([], project.resources, ids)
                project.resources = _.uniq(project.resources, (a, b) ->
                  return a.id == b.id
                )

                project.read = _.union([], project.read, ids)
                project.read = _.uniq(project.read, (a, b) ->
                  return a.id == b.id
                )

                project.save((result, project) ->
                  res.json success: true, id: project.get('_id')
                )
              )

              callback(null, "done")
            )
        ])
    )

  update: (req, res) ->
    id = req.params.id
    project = req.body.project

    resourcesReg = /\@(\w+)\W*?/g
    resources = []
    while match = resourcesReg.exec(project.resources)
      resources.push(match[1])

    read = []
    while match = resourcesReg.exec(project.read)
      read.push(match[1])

    write = []
    while match = resourcesReg.exec(project.write)
      write.push(match[1])

    grant = []
    while match = resourcesReg.exec(project.grant)
      grant.push(match[1])

    queryUsers = (query) ->
      (callback) ->
        User.find({github_username:
            {$in: query}}, (result, data) ->
          if result
            return callback(result, null)

          ids = _.map(data, (user) ->
            {id: user._id, name: user.github_username}
          )
          callback(result, ids)
        )

    async.parallel(
      resources: queryUsers(resources)
      read: queryUsers(read)
      write: queryUsers(write)
      grant: queryUsers(grant)
      (error, result) ->
        project = _.extend project, result
        Project.findByIdAndUpdate(id, project, (result, project) ->
          if result then return res.json({success: false, error: result})
          res.json({success: true, result: project})
        )
    )

  delete: (req, res) ->
    Project.findById(req.params.id, (result, project) ->
      if result
        res.json {success: false}, 404
      else
        project.getChildren(true, (result, projects) ->
          _.each(projects, (project) ->
            project.remove()
          )
        )
    )
    Project.remove({_id: req.params.id}, (result) ->
      if result
        res.json({success: false, error: result})
      else
        Task.remove({project: req.params.id}, (result) ->
          if result
            res.json({success: false, error: result})
          else
            res.json({success: true})
        )
    )
  
  suggest: (req, res) ->
    query = Project.find().select()
    if req.params.part?
      regexp = new RegExp("^#{req.params.part}")
      query.where 'name', regexp
    query.exec((result, projects) =>
      if result then return res.json success: false

      data = _.map(projects, (project) ->
        return {title: project.get("name"), value: project.get("name")}
      )

      res.json data
    )

  parent: (req, res) ->
    Project.findById(req.params.child, (result, project) ->
      if result
        res.json success: false, error: result
      else
        project.parent = req.params.parent
        project.save((result, project) ->
          if result
            res.json success: false, error: result
          else
            res.json success: true
        )
    )