# Middleware Node APM

### Environment Variables
<br />


Environment Name               |    Value
------------------------------ |    --------------------------
OTEL_EXPORTER_OTLP_ENDPOINT    |    '<capture_address>'
MW_API_KEY                   |    '<api_key>'
MW_NODEJS_APM_PAUSE_METRICS  |    '<1/0>'
MW_NODEJS_APM_PAUSE_TRACES   |    '<1/0>'
MW_NODEJS_LOGGER_HOST        |    '<logger_host>'
MW_NODEJS_LOGGER_PORT        |    '<logger_port>'

<br />
<br />

```javascript

const tracker = require('@middleware.io/node-apm');

tracker.track();

tracker.error('error');

tracker.info('info');

tracker.warn('warning');

tracker.debug('debug');

```

