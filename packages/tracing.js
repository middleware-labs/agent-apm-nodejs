// tracing.js
'use strict'
const openTelemetry = require('@opentelemetry/sdk-node');
const {getNodeAutoInstrumentations} = require('@opentelemetry/auto-instrumentations-node');
const {HttpInstrumentation} = require('@opentelemetry/instrumentation-http');
const {OTLPTraceExporter} = require('@opentelemetry/exporter-trace-otlp-grpc');
const {Metadata} = require('@grpc/grpc-js');
let meta = new Metadata();
meta.add('client', '5d03c-integration1');
meta.add('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjEsIkFjY291bnRJZCI6MSwiQXV0aFR5cGUiOiIiLCJUaW1lIjoiMjAyMi0wNi0zMFQwNjo0OTo0Ni4zODk2ODEzWiIsImlzcyI6Im13X19sb2dpbiIsInN1YiI6ImxvZ2luIn0.RlM4Zu0u-0lBvyUsVT2YRiPvWh-LeHNXv5bL0aAxuf0');
const sdk = new openTelemetry.NodeSDK({
    traceExporter: new OTLPTraceExporter({
        metadata: meta
    }),
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
