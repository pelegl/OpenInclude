###
  Class and Job Exposed  
###
proxy_scraper   = require 'proxy-scraper'
github_scraper  = require 'github-repo-scraper'
{start}         = require 'node.io'
async           = require 'async'
fs              = require 'fs'
_               = require 'underscore'

colors = require 'colors'
colors.setTheme
  silly   : 'rainbow'
  input   : 'grey'
  verbose : 'cyan'
  prompt  : 'grey'
  info    : 'green'
  data    : 'grey'
  help    : 'cyan'
  warn    : 'yellow'
  debug   : 'blue'
  error   : 'red'

###
  Set proxy tasks
###

main_conf = require '../source/conf'
[Module] = main_conf.get_models ["Module"]

Write_to_database = (repos)->
  async.forEach Object.keys(repos), (repoKey, callback)=>
    repo = repos[repoKey]
    {module_name, owner} = repo
    Module.findOne {owner, module_name}, (err, res)=>
      #console.log res
      unless res
        repository = new Module repo
        repository.save callback
      else
        res = _.extend res, repo
        res.save callback
  ,(err)=>
    console.log "Batch write finished".debug, err

Tasks = 
  # get https anonymous proxy list
  get_proxy : (capture_proxy)->
    console.log "Started proxy scraping".info
    cache = "./proxy_list.json"
    if fs.existsSync(cache) and new Date().getTime() - fs.statSync(cache).mtime.getTime() < 1000*60*60 # 1 hours    
      fs.readFile cache, "utf-8", (err, data)=>
        try
          data = JSON.parse data
        catch error
          return capture_proxy error, null
        finally
          capture_proxy null, data
    else
      start proxy_scraper.job, (err, data)=>
        unless err
          fs.writeFile cache, JSON.stringify(data), "utf-8", (err)=>            
            capture_proxy err, data
        else
          capture_proxy err
      , true              

  # get github repo list
  get_github: (capture_github)->    
    console.log "Started git scraping".info    
    github_scraper null, (err, message, completed)->      
      unless completed
        Write_to_database message
      else
        capture_github err, message
  

###
  Define task list
###

async.auto Tasks, (err, results)->  
  console.log err.error if err?
  console.log "Proxy List Has".help, results.get_proxy.length.toString().info, " items".info
  console.log "Git Scraping Result".help, results.get_github

