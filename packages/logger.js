const FluentClient = require("@fluent-org/logger").FluentClient;

const logger = new FluentClient("melt", {
    socket: {
        host: process.env.MELT_LOGGER_ENDPOINT ? process.env.MELT_LOGGER_ENDPOINT : "localhost",
        port: 8006,
        timeout: 3000,
    }
});

module.exports.error =  (message) => {
    logger.emit('error', {record:message});
};
module.exports.info =  (message) => {
    logger.emit('info', {record:message});
};
module.exports.warn =  (message) => {
    logger.emit('warn', {record:message});
};
module.exports.debug =  (message) => {
    logger.emit('debug', {record:message});
};

module.exports.log =  (message) => {
    logger.emit('log', {record:message});
};



