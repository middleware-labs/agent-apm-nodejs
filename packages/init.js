let logger;
const { format } = require('logform');
const { errors } = format;
const errorsFormat = errors({ stack: true })
let transformError = errorsFormat.transform;

module.exports.track = (newConfig = {}) => {
    let config = require('./config').init(newConfig)
    logger = require('./logger').init(config);
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
