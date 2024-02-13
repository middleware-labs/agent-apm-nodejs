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
        const api = require('@opentelemetry/api');
        const { CompositePropagator } = require('@opentelemetry/core');
        const { B3Propagator, B3InjectEncoding } = require('@opentelemetry/propagator-b3');
        api.propagation.setGlobalPropagator(
            new CompositePropagator({
                propagators: [
                    new B3Propagator(),
                    new B3Propagator({ injectEncoding: B3InjectEncoding.MULTI_HEADER }),
                ],
            })
        );
        const sdk = new opentelemetry.NodeSDK({
            traceExporter: new OTLPTraceExporter({
                url: config.target,
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
            ['mw.account_key']:config.accessToken,
            ['mw_serverless']:config.isServerless ? 1 : 0,
        }))
        sdk.start()
        process.on('SIGTERM', () => {
            sdk.shutdown()
                .then(() => {})
                .catch((error) => console.log('Error terminating tracing', error))
                .finally(() => process.exit(0));
        });
    }
};


