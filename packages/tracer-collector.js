module.exports =  (config) => {
    let apm_pause_traces= (config.pauseTraces && config.pauseTraces==1) ? true : false;
    if(!apm_pause_traces) {
        const grpc = require('@grpc/grpc-js');
        const {Metadata} = require('@grpc/grpc-js');
        const process = require('process');
        const opentelemetry = require('@opentelemetry/sdk-node');
        const {getNodeAutoInstrumentations} = require('@opentelemetry/auto-instrumentations-node');
        const {OTLPTraceExporter} = require('@opentelemetry/exporter-trace-otlp-grpc');
        const { GrpcInstrumentation } = require('@opentelemetry/instrumentation-grpc');
        const {Resource} = require("@opentelemetry/resources");
        const {SemanticResourceAttributes} = require("@opentelemetry/semantic-conventions");
        let meta = new Metadata();
        meta.add('client', '5d03c-integration1');
        meta.add('authorization', config.apiKey);
        const sdk = new opentelemetry.NodeSDK({
            traceExporter: new OTLPTraceExporter({
                metadata: meta,
                url: config.host,
            }),
            instrumentations: [
                getNodeAutoInstrumentations({}),
                new GrpcInstrumentation({
                    ignoreGrpcMethods:["Export"]
                })
            ],
        });

        sdk.addResource(new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName ? config.serviceName : 'Service-' + process.pid,
            ['mw_agent']: true,
            ['mw.account_key']:config.apiKey,
            ['project.name']:config.projectName ? config.projectName : 'Project-' + process.pid
        }))

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
};


