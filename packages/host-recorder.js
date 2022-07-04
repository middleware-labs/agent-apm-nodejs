'use strict'
const {diag, DiagConsoleLogger, DiagLogLevel} = require('@opentelemetry/api');
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
const process = require('process');
const {SemanticResourceAttributes} = require("@opentelemetry/semantic-conventions");
const {Resource} = require("@opentelemetry/resources");
const {OTLPMetricExporter} = require('@opentelemetry/exporter-metrics-otlp-grpc');
const {Metadata} = require('@grpc/grpc-js');
const {MeterProvider} = require('@opentelemetry/sdk-metrics-base');

class HostRecorder {
    constructor() {
        this.meta = new Metadata();
        this.meta.add('client', '5d03c-integration1');
        this.meta.add('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjEsIkFjY291bnRJZCI6MSwiQXV0aFR5cGUiOiIiLCJUaW1lIjoiMjAyMi0wNi0zMFQwNjo0OTo0Ni4zODk2ODEzWiIsImlzcyI6Im13X19sb2dpbiIsInN1YiI6ImxvZ2luIn0.RlM4Zu0u-0lBvyUsVT2YRiPvWh-LeHNXv5bL0aAxuf0');
        this.metricsExporter = new OTLPMetricExporter({
            metadata: this.meta,
        });
    }

    _send(metric_name,value){
        const meter = new MeterProvider({
            exporter: this.metricsExporter,
            interval:1000,
            exportIntervalMillis: 1000,
            resource: new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: 'node-app-metrics-pid-' + process.pid,
                ['mw_agent']: true,
            }),
        }).getMeter('node-app-meter');
        const counter = meter.createCounter(metric_name);
        counter.add(value);
    }
}
module.exports = HostRecorder

