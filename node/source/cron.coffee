###
  Dependencies
###
cron           = require('cron').CronJob
weekly_billing = require './background_jobs/weekly_bill_processing'

##
console.log "[__scheduler__] Cron started"
##
Jobs = []

###
  weekly billing job
###
weekly_billing_job =  new cron {
    cronTime: "1 0 0 * * 1"
    onTick: weekly_billing
    start: true
  }
Jobs.push weekly_billing_job

## perform billing ""
#weekly_billing()


###
  Exports
###
module.exports = Jobs

