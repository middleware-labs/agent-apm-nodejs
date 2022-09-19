module.exports.init = (config) => {
    const winston = require('winston');

    const tag = config.serviceName ? config.serviceName : 'nodejs-app';

    const host = config.host && config.host !== "" ? config.host : "localhost";

    const port = config.port && config.port.fluent && config.port.fluent !== "" ? config.port.fluent : 8006;

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
