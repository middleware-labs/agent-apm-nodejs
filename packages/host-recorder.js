'use strict'
const process = require('process');
const {SemanticResourceAttributes} = require("@opentelemetry/semantic-conventions");
const {Resource} = require("@opentelemetry/resources");
const {OTLPMetricExporter} = require('@opentelemetry/exporter-metrics-otlp-grpc');
const {Metadata} = require('@grpc/grpc-js');
const {MeterProvider} = require('@opentelemetry/sdk-metrics-base');

class HostRecorder {
    constructor(config) {
        this.config=config;
        this.meta = new Metadata();
        this.meta.add('client', '5d03c-integration1');
        this.meta.add('authorization', config.apiKey);
        this.metricsExporter = new OTLPMetricExporter({
            metadata: this.meta,
            url: "http://"+config.host+":"+config.port.grpc,
        });
        this.serviceName = config.serviceName ? config.serviceName : 'Service-' + process.pid;
        this.projectName = config.projectName ? config.projectName : 'Project-' + process.pid;
    }

    _send(metric_name,value){
        this.meter = new MeterProvider({
            exporter: this.metricsExporter,
            interval:1000,
            exportIntervalMillis: 1000,
            resource: new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: this.serviceName,
                ['mw_agent']: true,
                ['mw.account_key']:this.config.apiKey,
                ['project.name']:this.projectName
            }),
        }).getMeter('node-app-meter');
        this.counter = this.meter.createCounter(metric_name);
        this.counter.add(value);
    }
}
module.exports = HostRecorder

