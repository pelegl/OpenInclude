_ = require "underscore"

{get_models} = require '../conf'

[Project, Task, User] = get_models ["Project", "Task", "User"]

module.exports =
    list: (req, res) ->
        Project.find({"client.id": req.user._id}).select().exec((result, data) ->
            if result
                res.json({success: false, error: result})
            else
                res.json(data)
        )

    create: (req, res) ->
        req.body.project.client = {id: req.user._id, name: req.user.github_username}
        project = new Project(req.body.project)
        project.save((result, project) ->
            if result
                res.json({success: false, error: result})
            else
                # parse description and create tasks
                # also append resources
                tasksReg = /\#(\w+)\W*?/g
                resourcesReg = /\@(\w+)\W*?/g

                tasks = []
                resources = []
                
                while match = tasksReg.exec(project.description)
                    tasks.push(match[1])
                while match = resourcesReg.exec(project.description)
                    resources.push(match[1])
                    
                _.each(tasks, (task) ->
                    t = new Task({name: task, project: project._id})
                    t.save()
                )
                    
                User.find({github_username: {$in: resources}}, (result, data) ->
                    if result then return res.json({success: true, message: result})
                    ids = _.map(data, (user) ->
                        return {id: user._id, name: user.github_username}
                    )
                    
                    project.resources = ids
                    project.save((result, project) ->
                        res.json({success: true})
                    )
                )
        )

    update: (req, res) ->
        res.json({})

    delete: (req, res) ->
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
  
