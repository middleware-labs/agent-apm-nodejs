let logger;
const process = require('process');
const { format } = require('logform');
const { errors } = format;
const errorsFormat = errors({ stack: true })
let transformError = errorsFormat.transform;
module.exports.track = (config = {}) => {
    if (!config.apiKey) return
    config['host'] = config['host'] ? config['host'] : "localhost";
    config['projectName'] = config['projectName'] ? config['projectName'] : "Project-"+process.pid;
    config['serviceName'] = config['serviceName'] ? config['serviceName'] : "Service-"+process.pid;
    config['port'] = config['port'] ? config['port'] : {};
    if (!config.port || (config.port && !config.port.grpc)) {
        config['port']['grpc'] = 4320
    }
    if (!config.port || (config.port && !config.port.fluent)) {config['port']['fluent'] = 8006}
    const MetricsCollector = require("./metrics-collector");
    logger = require('./logger').init(config);
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
