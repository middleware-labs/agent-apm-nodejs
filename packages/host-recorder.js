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
        this.meta.add('authorization', config.MW_API_KEY);
        this.metricsExporter = new OTLPMetricExporter({
            metadata: this.meta,
        });
    }

    _send(metric_name,value){
        this.meter = new MeterProvider({
            exporter: this.metricsExporter,
            interval:1000,
            exportIntervalMillis: 1000,
            resource: new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: 'node-app-metrics-pid-' + process.pid,
                ['mw_agent']: true,
                ['mw.account_key']:this.config.MW_API_KEY
            }),
        }).getMeter('node-app-meter');
        this.counter = this.meter.createCounter(metric_name);
        this.counter.add(value);
    }
}
module.exports = HostRecorder

