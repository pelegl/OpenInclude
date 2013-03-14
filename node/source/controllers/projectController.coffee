_     = require "underscore"
async = require "async"

{get_models} = require '../conf'

[Project, Task, User] = get_models ["Project", "Task", "User"]

module.exports =
    list: (req, res) ->
        Project.find().or([{"client.id": req.user._id}, {"read.id": req.user._id}, {"write.id": req.user._id}, {"grant.id": req.user._id}, {"resources.id": req.user._id}]).select().exec((result, data) ->
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
                    if result then return res.json({success: true, error: result})
                    ids = _.map(data, (user) ->
                        return {id: user._id, name: user.github_username}
                    )
                    
                    project.resources = project.read = ids
                    project.save((result, project) ->
                        res.json({success: true})
                    )
                )
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
                User.find({github_username: {$in: query}}, (result, data) ->
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
  
