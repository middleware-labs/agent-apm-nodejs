let logger,config;
const { format } = require('logform');
const otel = require('@opentelemetry/api')
const { errors } = format;
const errorsFormat = errors({ stack: true })
let transformError = errorsFormat.transform;

module.exports.track = (newConfig = {}) => {
    config = require('./config').init(newConfig)
    logger = require('./logger').init(config);
    profiler = require('./profiler').init(config);
    return config
};

module.exports.error = (message) => {
    let stack=transformError(message,{ stack: true });
    logger.error({message:typeof stack =="string" ? stack : stack.message , stack, "project.name":config.projectName, "service.name":config.serviceName});
};

module.exports.info = (message) => {
    logger.info({message, "project.name":config.projectName, "service.name":config.serviceName});
};

module.exports.warn = (message) => {
    logger.warn({message,"project.name":config.projectName,"service.name":config.serviceName});
};

module.exports.debug = (message) => {
    logger.level = 'debug';
    logger.log('debug', message, { "project.name": config.projectName,"service.name":config.serviceName});
};

module.exports.errorRecord = (e) => {
    const span = otel.trace.getSpan(otel.context.active())
    if(span){
        span.recordException(e)
        span.setStatus({ code: otel.SpanStatusCode.ERROR, message: String(e) })
    }
};

module.exports.setAttribute = (name,value) => {
    const span = otel.trace.getSpan(otel.context.active())
    if(span){
        span.setAttribute(name,value)
    }
};
