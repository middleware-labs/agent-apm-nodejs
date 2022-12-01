let logger,config;
const { format } = require('logform');
const otel = require('@opentelemetry/api')
const { errors } = format;
const errorsFormat = errors({ stack: true })
let transformError = errorsFormat.transform;

module.exports.track = (newConfig = {}) => {
    config = require('./config').init(newConfig)
    logger = require('./logger').init(config);
};

module.exports.error = (message) => {
    let stack=transformError(message,{ stack: true });
    logger.error({message:typeof stack =="string" ? stack : stack.message ,stack,projectName:config.projectName,serviceName:config.serviceName});
};

module.exports.info = (message) => {
    logger.info({message,projectName:config.projectName,serviceName:config.serviceName});
};

module.exports.warn = (message) => {
    logger.warn({message,projectName:config.projectName,serviceName:config.serviceName});
};

module.exports.debug = (message) => {
    logger.debug({message,projectName:config.projectName,serviceName:config.serviceName});
};

module.exports.errorRecord = (e) => {
    const span = otel.trace.getSpan(otel.context.active())
    span.recordException(e)
    span.setStatus({ code: otel.SpanStatusCode.ERROR, message: String(e) })
};
