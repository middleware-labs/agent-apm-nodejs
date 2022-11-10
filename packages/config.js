const {diag, DiagConsoleLogger, DiagLogLevel} = require('@opentelemetry/api');
const process = require('process');
const tracer = require('./tracer-collector');
const metrics = require('./metrics-collector');

const configDefault = {
    'DEBUG' : DiagLogLevel.NONE,
    'host':'localhost',
    'projectName':"Project-"+process.pid,
    'serviceName':"Service-"+process.pid,
    'port':{
        'grpc':9319,
        'fluent':8006
    },
    'hostUrl':'http://localhost:9319'
}

module.exports.init = (config = {}) => {
    Object.keys(configDefault).forEach(function(key) {
        configDefault[key] = config[key] ? config[key] : configDefault[key];
    })
    let isHostExist = (process.env.MW_AGENT_SERVICE  && process.env.MW_AGENT_SERVICE!=="") ? true : false;
    if(isHostExist){
        configDefault['host'] = process.env.MW_AGENT_SERVICE
        configDefault['hostUrl'] = process.env.MW_AGENT_SERVICE+":"+configDefault.port.grpc
    }
    diag.setLogger(new DiagConsoleLogger(), configDefault['DEBUG'] ? DiagLogLevel.DEBUG : DiagLogLevel.NONE);
    metrics.init(configDefault)
    tracer.init(configDefault)
    return configDefault
}