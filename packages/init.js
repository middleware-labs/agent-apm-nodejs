'use strict'
const MetricsCollector = require("./metrics-collector");
const TracerCollector = require("./tracer-collector")

module.exports = require('./logger')

module.exports.track =   (config) => {
    if (!config.MELT_API_KEY || !process.env.OTEL_EXPORTER_OTLP_ENDPOINT) return
    let apm_pause_metrics= config.MELT_APM_PAUSE_METRICS && config.MELT_APM_PAUSE_METRICS==true ? true : false;
    if(!apm_pause_metrics) {
        let metricer_collector = new MetricsCollector(config).init()
    }
    let apm_pause_traces= config.MELT_APM_PAUSE_TRACES && config.MELT_APM_PAUSE_TRACES==true ? true : false;
    if(!apm_pause_traces) {
        let tracer = new TracerCollector(config).init()
    }
};


