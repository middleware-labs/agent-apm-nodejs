module.exports.init =  (config) => {
    let apm_pause_metrics = config.pauseMetrics && config.pauseMetrics == 1 ? true : false;
    if (!apm_pause_metrics) {
        const v8 = require('v8')
        const os = require('os')
        const {OTLPMetricExporter} = require('@opentelemetry/exporter-metrics-otlp-grpc');
        const {SemanticResourceAttributes} = require("@opentelemetry/semantic-conventions");
        const {Resource} = require("@opentelemetry/resources");
        const {MeterProvider,PeriodicExportingMetricReader} = require('@opentelemetry/sdk-metrics');
        const metricsExporter = new OTLPMetricExporter({url: config.target});
        this.config = config;
        this.time = process.hrtime()
        this.cpuUsage = false
        this.serviceName = config.serviceName;
        this.projectName = config.projectName;
        setInterval(() => {
            if (process.cpuUsage) {
                this.elapsedTime = process.hrtime(this.time)
                this.elapsedUsage = process.cpuUsage(this.cpuUsage)
                this.time = process.hrtime()
                this.cpuUsage = process.cpuUsage()
                this.enqueue = [];
                this.elapsedMs = this.elapsedTime[0] * 1000 + this.elapsedTime[1] / 1000000
                this.userPercent = 100 * this.elapsedUsage.user / 1000 / this.elapsedMs
                this.systemPercent = 100 * this.elapsedUsage.system / 1000 / this.elapsedMs
                this.totalPercent = this.userPercent + this.systemPercent
                this.enqueue['cpu.system'] = this.systemPercent.toFixed(2);
                this.enqueue['cpu.user'] = this.userPercent.toFixed(2);
                this.enqueue['cpu.total'] = this.totalPercent.toFixed(2);
                this.enqueue['cpu.uptime'] = Math.round(process.uptime());
            }
            const eventLoop = require('./../build/Release/eventLoopStats');
            this.eventLoopMatric = eventLoop.sense()
            this.enqueue['event_loop.delay.min'] = this.eventLoopMatric.min.toFixed(2);
            this.enqueue['event_loop.delay.max'] = this.eventLoopMatric.max.toFixed(2);
            this.enqueue['event_loop.delay.sum'] = this.eventLoopMatric.sum.toFixed(2);
            if (v8.getHeapSpaceStatistics) {
                this.stats = v8.getHeapSpaceStatistics()
                for (let i = 0, l = this.stats.length; i < l; i++) {
                    this.tags = `${this.stats[i].space_name}`
                    this.enqueue[`heap.size.by.space.${this.tags}`] = this.stats[i].space_size;
                    this.enqueue[`heap.used_size.by.space.${this.tags}`] = this.stats[i].space_used_size;
                    this.enqueue[`heap.available_size.by.space.${this.tags}`] = this.stats[i].space_available_size;
                    this.enqueue[`heap.physical_size.by.space.${this.tags}`] = this.stats[i].physical_space_size;
                }
            }
            this.memoryStats = process.memoryUsage()
            this.enqueue[`mem.heap_total`] = this.memoryStats.heapTotal;
            this.enqueue[`mem.heap_used`] = this.memoryStats.heapUsed;
            this.enqueue[`mem.total`] = os.totalmem();
            this.enqueue[`mem.rss`] = os.freemem()
            if (this.memoryStats.external) {
                this.enqueue[`mem.external`] = this.memoryStats.external
            }

            this.heapStats = v8.getHeapStatistics()
            this.enqueue[`heap.total_heap_size`] = this.heapStats.heapTotal;
            this.enqueue[`heap.total_heap_size_executable`] = this.heapStats.total_heap_size_executable;
            this.enqueue[`heap.total_physical_size`] = this.heapStats.total_physical_size;
            this.enqueue[`heap.total_available_size`] = this.heapStats.total_available_size;
            this.enqueue[`heap.heap_size_limit`] = this.heapStats.heap_size_limit;
            if (this.heapStats.malloced_memory) {
                this.enqueue[`heap.malloced_memory`] = this.heapStats.malloced_memory;
            }
            if (this.heapStats.peak_malloced_memory) {
                this.enqueue[`heap.peak_malloced_memory`] = this.heapStats.peak_malloced_memory;
            }
            Object.keys(this.enqueue).forEach(metric_name => {
                if (this.enqueue[metric_name]) {
                    this.meterProvider = new MeterProvider({
                        resource:new Resource({
                            [SemanticResourceAttributes.SERVICE_NAME]: this.serviceName,
                            ['mw_agent']: true,
                            ['project.name']: this.projectName,
                            ['mw.account_key']:config.accessToken
                        })
                    });
                    this.meterProvider.addMetricReader(new PeriodicExportingMetricReader({
                        exporter: metricsExporter,
                        exportIntervalMillis: 10000,
                    }));
                    this.meter = this.meterProvider.getMeter('node-app-meter');
                    this.counter = this.meter.createCounter(metric_name);
                    this.counter.add(parseFloat(this.enqueue[metric_name]));
                }
            })
        }, 10000)
    }
};


