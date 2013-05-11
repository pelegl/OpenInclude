###
  Config
###
http = require 'http'

AWS = require 'aws-sdk'
AWS.config.loadFromPath './amazon.ec2.json'
AWS.config.update {region: 'us-east-1', sslEnabled: true}
# service
EC2 = new AWS.EC2
# client
ec2 = EC2.client

# Grab metadata from an AMI instance
endpoint = ""
url      = 'http://169.254.169.254/latest/meta-data/' + endpoint;

class AWS
  constructor: ->
    @client = ec2
  # get metadata  
  getMetadata : (params..., callback)->
    endpoint = params[0] || ""
    url      = 'http://169.254.169.254/latest/meta-data/' + endpoint
    
    req = http.get url, (res)->
      string = '';
      res.setEncoding 'utf8'
      
      res.on 'data', (chunk)=>
        string += chunk
      
      res.on 'end', =>
        if res.statusCode is 200
          return callback null, string
        else
          return callback new Error('HTTP ' + res.statusCode +' when fetching credentials from EC2 API')
  
    req.once 'error', callback
    req.setTimeout 1000, callback
    

module.exports = new AWS