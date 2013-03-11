###
  Configuration
###
main_conf = require '../source/conf'
async     = require 'async'
util      = require 'util'
_         = require 'underscore'
github    = main_conf.git
aws       = require './aws'

[Module]  = main_conf.get_models ["Module"]

###
  Helpers
###
limit = (headers)->
  return parseInt headers['x-ratelimit-remaining']


###
  Set of tasks for background scraping
###
class Tasks  
  ###
    Get running meta instance ID
  ###
  instanceId : (callback)->
    aws.getMetadata 'instance-id', callback
  
  ###
    Get Elastic IPs
  ###
  addresses : (callback)->
    aws.client.describeAddresses callback
  
  ###
    get instasnce description
  ###
  instance : (instanceId, callback)->    
    aws.client.describeInstances {InstanceIds: [instanceId]}, callback
  
  ###
    disassociate address
  ###
  disassociateAddress : (Adresses, instanceId, callback) ->
    associatedAddress = _.find Addresses, (address)=>
      return address.InstanceId is InstanceId
  
    return callback "No associated addresses found" unless associatedAddress
  
    # getting dynamic ip here
    aws.client.disassociateAddress {PublicIp: associatedAddress.PublicIp}, callback
  
  ###
    associate address
  ###
  associateAddress: (PublicIp, InstanceId, callback)->
    aws.client.associateAddress {InstanceId, PublicIp}, callback
  
  ###
    Pull repositories from the database and init new job
  ###
  repositories: (limit..., callback)->
    unless limit[0]      
      Module.find({}, "_id owner module_name").sort({stars:-1}).exec (err, modules)=>      
        return callback err if err?      
        callback null, {snapshot_date: new Date(), modules, total: modules.length}
    else
      Module.find({}, "_id owner module_name").sort({stars:-1}).limit(limit[0]).exec (err, modules)=>      
        return callback err if err?      
        callback null, {snapshot_date: new Date(), modules, total: modules.length}
    
  ###
    Process repository
  ###
  process_repo: (repository, snapshot_date, callback)->    
    response = 0
    page     = 1
    per_page = 100
  
    test = ->
      page++
      return response > 0
  
    process = (cb) ->
      
      repository.list_stargazers page, per_page, (err, output, headers)=>
        console.log "Current limit", limit(headers)
        # handle exceptions
        return cb err if err? or (response = output.length) <= 0
        # work on the response here          
        repository.make_stargazers_snapshot output, snapshot_date, (err)=>
          err = "limit over" unless limit(headers) > 0
          cb err
  
    console.log "Started processing module #{repository.owner}/#{repository.module_name}"  
    async.doWhilst process, test, callback
  
  ###
    Get page link
  ###
  getPageLinks: (link)->
    if typeof link == "object" and (link.link || link.meta.link)
      link = link.link || link.meta.link
    
    links = {}
    return links if typeof link != "string" 

    # link format:
    # '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'      
    link.replace /<([^>]*)>;\s*rel="([\w]*)\"/g, (m, uri, type)=>
      links[type] = uri
      
    links
    
  ###
    Create task wrapper
  ###
  call: (name, args...)->
    console.log "Calling function: #{name}"
    self = this
    return (callback)->
      args.push callback
      self[name].apply self, args


module.exports = new Tasks