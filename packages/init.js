'use strict'

const {diag, DiagConsoleLogger, DiagLogLevel} = require('@opentelemetry/api');
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

require("./tracer-collector").tracer();

const MetricsCollector = require("./metrics-collector");

module.exports = require('./logger')

module.exports.track =   () => {
     if (!process.env.MELT_API_KEY || !process.env.OTEL_EXPORTER_OTLP_ENDPOINT) return
     let apm_pause_metrics= process.env.MELT_APM_PAUSE_METRICS && process.env.MELT_APM_PAUSE_METRICS==true ? true : false;
     if(!apm_pause_metrics) {
         new MetricsCollector({MELT_API_KEY:process.env.MELT_API_KEY}).init()
    }
};


