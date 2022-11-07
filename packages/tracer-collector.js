module.exports.init =  (config) => {
    let apm_pause_traces= (config.pauseTraces && config.pauseTraces==1) ? true : false;
    if(!apm_pause_traces) {
        const grpc = require('@grpc/grpc-js');
        const process = require('process');
        const opentelemetry = require('@opentelemetry/sdk-node');
        const {getNodeAutoInstrumentations} = require('@opentelemetry/auto-instrumentations-node');
        const {OTLPTraceExporter} = require('@opentelemetry/exporter-trace-otlp-grpc');
        const { GrpcInstrumentation } = require('@opentelemetry/instrumentation-grpc');
        const {Resource} = require("@opentelemetry/resources");
        const {SemanticResourceAttributes} = require("@opentelemetry/semantic-conventions");
        const sdk = new opentelemetry.NodeSDK({
            traceExporter: new OTLPTraceExporter({
                url: config.hostUrl,
            }),
            instrumentations: [
                getNodeAutoInstrumentations({}),
                new GrpcInstrumentation({
                    ignoreGrpcMethods:["Export"]
                })
            ],
        });
        sdk.addResource(new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
            ['mw_agent']: true,
            ['project.name']:config.projectName,
        }))
        sdk.start()
            .then(() => {})
            .catch((error) => console.log('Error initializing tracing', error));
        process.on('SIGTERM', () => {
            sdk.shutdown()
                .then(() => {})
                .catch((error) => console.log('Error terminating tracing', error))
                .finally(() => process.exit(0));
        });
    }
};


