'use strict'
const metrics = require('./packages/metrics')
metrics.track()
metrics.log('info','Hi from node app')

