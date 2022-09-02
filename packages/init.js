require('./tracer-collector')

const MetricsCollector = require("./metrics-collector");

module.exports = require('./logger')

module.exports.track =   () => {
    if (!process.env.MW_API_KEY || !process.env.OTEL_EXPORTER_OTLP_ENDPOINT) return
    let apm_pause_metrics= process.env.MW_NODEJS_APM_PAUSE_METRICS && process.env.MW_NODEJS_APM_PAUSE_METRICS==1 ? true : false;
    if(!apm_pause_metrics) {
         new MetricsCollector({MW_API_KEY:process.env.MW_API_KEY}).init()
    }
};


