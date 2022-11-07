module.exports.init = (config) => {
    const winston = require('winston');

    const tag = config.projectName;

    const host = config.host;

    const port = config.port.fluent;

    const c = {
        host,
        port,
        timeout: 3.0,
        requireAckResponse: true // Add this option to wait response from Fluentd certainly
    };
    const fluentTransport = require('fluent-logger').support.winstonTransport();

    const fluent = new fluentTransport(tag, c);

    const logger = winston.createLogger({
        transports: [fluent, new (winston.transports.Console)()]
    });

    logger.on('flush', () => {
    })

    logger.on('finish', () => {
        fluent.sender.end("end", {}, () => {})
    });
    return logger

}
