'use strict'
const {diag, DiagConsoleLogger, DiagLogLevel} = require('@opentelemetry/api');
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const process = require('process');
const openTelemetry = require('@opentelemetry/sdk-node');
const {SemanticResourceAttributes} = require("@opentelemetry/semantic-conventions");
const {Resource} = require("@opentelemetry/resources");
const {getNodeAutoInstrumentations} = require('@opentelemetry/auto-instrumentations-node');

const {HttpInstrumentation} = require('@opentelemetry/instrumentation-http');
const {OTLPMetricExporter} = require('@opentelemetry/exporter-metrics-otlp-grpc');
const {OTLPTraceExporter} = require('@opentelemetry/exporter-trace-otlp-grpc');

const metricsExporter = new OTLPMetricExporter();

const {MeterProvider} = require('@opentelemetry/sdk-metrics-base');


class HostRecorder {

    constructor() {
        this.init();
        this.meter = new MeterProvider({
            exporter: metricsExporter,
            interval: 1000,
            resource: new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: 'node-app-metrics-pid-' + process.pid,
            }),
        }).getMeter('node-app-meter');
    }

    init(){
        const sdk = new openTelemetry.NodeSDK({
            traceExporter: new OTLPTraceExporter(),
            metricExporter: new OTLPMetricExporter(),
            instrumentations: [
                getNodeAutoInstrumentations(),
                new HttpInstrumentation()
            ],
        });
        sdk.start()
            .then(() => console.log('Tracing initialized'))
            .catch((error) => console.log('Error initializing tracing', error));

        process.on('SIGTERM', () => {
            sdk.shutdown()
                .then(() => console.log('Tracing terminated'))
                .catch((error) => console.log('Error terminating tracing', error))
                .finally(() => process.exit(0));
        });
    }

    _send(metric_name,value){
        const labels = { pid: process.pid };
        const counter = this.meter.createCounter(metric_name);
        counter.add(value, labels);
    }


}
module.exports = HostRecorder

