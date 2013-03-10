{get_models} = require '../conf'

[Project] = get_models ["Project"]

module.exports =
    list: (req, res) ->
        Project.find().select().exec((result, data) ->
            if result
                res.json({success: false, error: result})
            else
                res.json(data)
        )

    create: (req, res) ->
        project = new Project(req.body.project)
        project.save((result, data) ->
            if result
                res.json({success: false, error: result})
            else
                res.json({success: true})
        )

    update: (req, res) ->
        res.json({})
    delete: (req, res) ->
        res.json({})
  
