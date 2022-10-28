module.exports.init = (config) => {

    const winston = require('winston');

    const tag = config.serviceName;

    const host = config.hostUrl;

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
        console.log("flush");
    })

    logger.on('finish', () => {
        console.log("finish");
        fluent.sender.end("end", {}, () => {
        })
    });

    return logger

}
