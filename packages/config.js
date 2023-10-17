const {diag, DiagConsoleLogger, DiagLogLevel} = require('@opentelemetry/api');
const process = require('process');
const tracer = require('./tracer-collector');
const metrics = require('./metrics-collector');
const {OTLPTraceExporter} = require('@opentelemetry/exporter-trace-otlp-grpc');

const configDefault = {
    'DEBUG' : DiagLogLevel.NONE,
    'host':'localhost',
    'projectName':"Project-"+process.pid,
    'serviceName':"Service-"+process.pid,
    'port':{
        'grpc':9319,
        'fluent':8006
    },
    'hostUrl':'http://localhost:9319',
    'collectMetrics':false,
    'profilingServerUrl': 'https://profiling.middleware.io',
    'enableProfiling': true,
    'accessToken': '',
    'tenantID': '',
    'mwAuthURL': 'https://app.middleware.io/api/v1/auth',
    'traceExporter': {},
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

    configDefault['traceExporter'] = new OTLPTraceExporter({
        url: configDefault['hostUrl'],
    }),

    diag.setLogger(new DiagConsoleLogger(), configDefault['DEBUG'] ? DiagLogLevel.DEBUG : DiagLogLevel.NONE);
    if (configDefault['collectMetrics']) {metrics.init(configDefault)}
    tracer.init(configDefault)
    return configDefault
}
