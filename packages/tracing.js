// tracing.js
'use strict'
const openTelemetry = require('@opentelemetry/sdk-node');
const {getNodeAutoInstrumentations} = require('@opentelemetry/auto-instrumentations-node');

const {HttpInstrumentation} = require('@opentelemetry/instrumentation-http');
const {OTLPTraceExporter} = require('@opentelemetry/exporter-trace-otlp-grpc');

const sdk = new openTelemetry.NodeSDK({
    traceExporter: new OTLPTraceExporter(),
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
