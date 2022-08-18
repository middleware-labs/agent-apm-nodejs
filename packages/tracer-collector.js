'use strict'
module.exports.tracer = ()=>{
    let apm_pause_traces= process.env.MELT_APM_PAUSE_TRACES && process.env.MELT_APM_PAUSE_TRACES==true ? true : false;
    if (!apm_pause_traces && process.env.MELT_API_KEY){
        const {Metadata} = require('@grpc/grpc-js');
        const process = require('process');
        const opentelemetry = require('@opentelemetry/sdk-node');
        const {getNodeAutoInstrumentations} = require('@opentelemetry/auto-instrumentations-node');

        const {HttpInstrumentation} = require('@opentelemetry/instrumentation-http');
        const {OTLPTraceExporter} = require('@opentelemetry/exporter-trace-otlp-grpc');

        let meta = new Metadata();
        meta.add('client', '5d03c-integration1');
        meta.add('authorization', process.env.MELT_API_KEY);
        const sdk = new opentelemetry.NodeSDK({
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
    }

}
