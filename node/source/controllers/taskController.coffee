{get_models} = require '../conf'

[Project, Task, Worklog] = get_models ["Project", "Task", "Worklog"]

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
      Task.findByIdAndUpdate(req.params.id, {$push: {comments: {text: req.body.comment, author: req.user.github_display_name, author_link: req.user.github_username, date: new Date()}}}, (result, data) ->
        if result then res.json {success: false, error: result}
        res.json({success: true})
      )

    start: (req, res) ->
      Worklog.findOne({"who.id": req.user._id, task: req.params.id}, (result, log) ->
        if result then return res.json {success: false, error: result}, 404

        unless log
          log = new Worklog(
            task: req.params.id
            start: req.params.start
            logged: 0
            who:
              id: req.user._id
              name: req.user.github_display_name
              link: req.user.github_username
          )

        log.start = req.params.start
        log.save()

        Task.findByIdAndUpdate(req.params.id, {person: {id: req.user._id, name: req.user.github_display_name, link: req.user.github_username}}).exec()

        res.json success: true
      )

    end: (req, res) ->
      Worklog.findOne({"who.id": req.user._id, task: req.params.id}, (result, log) ->
        if result then return res.json {success: false, error: result}, 404

        unless log
          return res.json {success: false, error: "No previous log found"}

        diff = req.params.end - log.start
        log.logged += diff
        log.save()

        Task.findByIdAndUpdate(req.params.id, {person: null, $inc: {logged: diff} }).exec()

        res.json success: true
      )