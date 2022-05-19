'use strict'
const {diag, DiagConsoleLogger, DiagLogLevel} = require('@opentelemetry/api');
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
const process = require('process');
const {SemanticResourceAttributes} = require("@opentelemetry/semantic-conventions");
const {Resource} = require("@opentelemetry/resources");
const {OTLPMetricExporter} = require('@opentelemetry/exporter-metrics-otlp-grpc');
const metricsExporter = new OTLPMetricExporter();

const {MeterProvider} = require('@opentelemetry/sdk-metrics-base');


class HostRecorder {
    constructor() {
        this.meter = new MeterProvider({
            exporter: metricsExporter,
            interval: 1000,
            resource: new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: 'node-app-metrics-pid-' + process.pid,
            }),
        }).getMeter('node-app-meter');

    }

    _send(metric_name,value){
        const labels = { pid: process.pid };
        const counter = this.meter.createCounter(metric_name);
        counter.add(value, labels);
    }
}
module.exports = HostRecorder

