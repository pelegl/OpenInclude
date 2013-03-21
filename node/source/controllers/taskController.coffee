{get_models} = require '../conf'

[Project, Task] = get_models ["Project", "Task"]

moment = require 'moment'

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
        task.due = moment(task.due).format("YYYY-MM-DD")
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
  
    comment: (req, res) ->
      Task.findByIdAndUpdate(req.params.id, {$push: {comments: req.body.comment}}, (result, data) ->
        if result then res.json {success: false, error: result}
        res.json({success: true})
      )