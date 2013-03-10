###
  Config
###
{ObjectId}   = require('mongoose').Schema.Types
{get_models} = require '../conf'
async        = require 'async'
_            = require 'underscore'

[Module] = get_models ["Module"]


###
  Definition
###

definition =
  owner       : String
  module_name : String  
  


exports.definition = definition