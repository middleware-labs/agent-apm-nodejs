'use strict'
const MetricsCollector = require("./metrics-collector");
const TracerCollector = require("./tracer-collector")
const logger = require('./logger')

module.exports.track =   (config) => {
    if (!config.MELT_API_KEY || !process.env.OTEL_EXPORTER_OTLP_ENDPOINT) return
    let metricer_collector = new MetricsCollector(config).init()
    let tracer = new TracerCollector(config).init()
};

module.exports.log =  (label,msg) => {
    logger.log(label,msg)
};


