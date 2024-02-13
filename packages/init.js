const otel = require('@opentelemetry/api')
const {log} = require('./logger')
let  config;
module.exports.track = (newConfig = {}) => {
    config = require('./config').init(newConfig)
    require('./profiler').init(config);
};

module.exports.info = (message, attributes = {}) => {
    log('INFO', message, attributes);
};

module.exports.warn = (message, attributes = {}) => {
    log('WARN', message, attributes);
};

module.exports.debug = (message, attributes = {}) => {
    log('DEBUG', message, attributes);
};

module.exports.error = (message, attributes = {}) => {
    log('ERROR', message, attributes);
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

module.exports.getMeter =() => {
    if (config.meterProvider){
        return config.meterProvider.getMeter(config.serviceName)
    }
    return false
}
module.exports.getTracer =() => {
    return otel.trace.getTracer(config.serviceName)
}
