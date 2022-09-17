const MetricsCollector = require("./metrics-collector");

module.exports = require('./logger')

module.exports.track =   (config = {}) => {
    require('./tracer-collector')(config)
    if (!config.apiKey || !config.host || !config.projectName || !config.serviceName) return
    let apm_pause_metrics= config.pauseMetrics && config.pauseMetrics==1 ? true : false;
    if(!apm_pause_metrics) {
         new MetricsCollector(config).init()
    }
};


