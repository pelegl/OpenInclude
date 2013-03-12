{get_models} = require '../conf'

[Project, Task] = get_models ["Project", "Task"]

module.exports =
    list: (req, res) ->
        Task.find({project: req.params.project}).select().exec((result, data) ->
            if result
                res.json({success: false, error: result})
            else
                res.json(data)
        )

    create: (req, res) ->
        req.body.task.project = req.params.project
        task = new Task(req.body.task)
        task.save((result, data) ->
            if result
                res.json({success: false, error: result})
            else
                res.json({success: true})
        )

    update: (req, res) ->
        res.json({})
    delete: (req, res) ->
        res.json({})
  
