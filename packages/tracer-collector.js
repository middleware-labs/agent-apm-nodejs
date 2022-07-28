'use strict'
const openTelemetry = require('@opentelemetry/sdk-node');
const {getNodeAutoInstrumentations} = require('@opentelemetry/auto-instrumentations-node');
const {HttpInstrumentation} = require('@opentelemetry/instrumentation-http');
const {OTLPTraceExporter} = require('@opentelemetry/exporter-trace-otlp-grpc');
const {Metadata} = require('@grpc/grpc-js');

class TracerCollector {

    constructor(config) {
        this.meta = new Metadata();
        this.meta.add('client', '5d03c-integration1');
        this.meta.add('authorization', config.MELT_API_KEY);
        this.sdk = new openTelemetry.NodeSDK({
            traceExporter: new OTLPTraceExporter({
                metadata: this.meta
            }),
            instrumentations: [
                getNodeAutoInstrumentations(),
                new HttpInstrumentation()
            ],
        });
    }

    init(){
       this.sdk.start()
            .then(() => console.log('Tracing initialized'))
            .catch((error) => console.log('Error initializing tracing', error));
        process.on('SIGTERM', () => {
            this.sdk.shutdown()
                .then(() => console.log('Tracing terminated'))
                .catch((error) => console.log('Error terminating tracing', error))
                .finally(() => process.exit(0));
        });
    }
}
module.exports = TracerCollector