require('./tracer-collector')

const MetricsCollector = require("./metrics-collector");

module.exports = require('./logger')

module.exports.track =   () => {
     let apm_pause_metrics= process.env.MELT_NODEJS_APM_PAUSE_METRICS && process.env.MELT_NODEJS_APM_PAUSE_METRICS==true ? true : false;
     if(!apm_pause_metrics) {
         new MetricsCollector({MELT_API_KEY:process.env.MELT_API_KEY}).init()
    }
};


