const winston = require('winston');

const host =  process.env.MELT_NODEJS_LOGGER_HOST ? process.env.MELT_NODEJS_LOGGER_HOST : "localhost";

const port =  process.env.MELT_NODEJS_LOGGER_PORT ? process.env.MELT_NODEJS_LOGGER_PORT : 8006;

const config = {
    host,
    port,
    timeout: 3.0,
    requireAckResponse: true // Add this option to wait response from Fluentd certainly
};
const fluentTransport = require('fluent-logger').support.winstonTransport();

const fluent = new fluentTransport('nodejs-tag', config);

const logger = winston.createLogger({
    transports: [fluent, new (winston.transports.Console)()]
});

logger.on('flush', () => {
    console.log("flush");
})

logger.on('finish', () => {
    console.log("finish");
    fluent.sender.end("end", {}, () => {})
});

module.exports.error =  (message) => {
    logger.error(message);
};

module.exports.info =  (message) => {
    logger.info(message);
};

module.exports.warn =  (message) => {
    logger.warn(message);
};

module.exports.debug =  (message) => {
    logger.debug(message);
};

