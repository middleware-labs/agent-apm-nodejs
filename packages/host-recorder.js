'use strict'
const {SemanticResourceAttributes} = require("@opentelemetry/semantic-conventions");
const {Resource} = require("@opentelemetry/resources");
const {OTLPMetricExporter} = require('@opentelemetry/exporter-metrics-otlp-grpc');
const {MeterProvider} = require('@opentelemetry/sdk-metrics-base');

class HostRecorder {
    constructor(config) {
        this.config=config;
        this.metricsExporter = new OTLPMetricExporter({
            url: config.hostUrl,
        });
        this.serviceName = config.serviceName;
        this.projectName = config.projectName;
    }

    _send(metric_name,value){
        this.meter = new MeterProvider({
            exporter: this.metricsExporter,
            interval:1000,
            exportIntervalMillis: 1000,
            resource: new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: this.serviceName,
                ['mw_agent']: true,
                ['project.name']:this.projectName
            }),
        }).getMeter('node-app-meter');
        this.counter = this.meter.createCounter(metric_name);
        this.counter.add(value);
    }
}
module.exports = HostRecorder

