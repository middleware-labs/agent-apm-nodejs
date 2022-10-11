let logger;
let transformError;
module.exports.track = (config = {}) => {
    if (!config.apiKey || !config.host || !config.projectName || !config.serviceName) return
    if (!config.port || (config.port && !config.port.grpc)) {
        config['port']['grpc'] = "4320"
    }
    const MetricsCollector = require("./metrics-collector");
    logger = require('./logger').init(config);
    const { format } = require('logform');
    const { errors } = format;

    const errorsFormat = errors({ stack: true })

    transformError = errorsFormat.transform;
    require('./tracer-collector')(config)
    let apm_pause_metrics = config.pauseMetrics && config.pauseMetrics == 1 ? true : false;
    if (!apm_pause_metrics) {
        new MetricsCollector(config).init()
    }
};

module.exports.error = (message) => {
    logger.error(transformError(message,{ stack: true }));
};

module.exports.info = (message) => {
    logger.info(message);
};

module.exports.warn = (message) => {
    logger.warn(message);
};

module.exports.debug = (message) => {
    logger.debug(message);

};




