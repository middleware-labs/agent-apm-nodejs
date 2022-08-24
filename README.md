# melt-node-metrics

## Installation

`npm install @middlewarelabs-devs/melt-node-metrics` or `yarn add @middlewarelabs-devs/melt-node-metrics`
<br />
<br />
### Environment Variables
<br />


Environment Name               |    Value
------------------------------ |    --------------------------
OTEL_EXPORTER_OTLP_ENDPOINT    |    '<capture_address>'
MELT_API_KEY                   |    '<api_key>'
MELT_NODEJS_APM_PAUSE_METRICS  |    '<true/false>'
MELT_NODEJS_APM_PAUSE_TRACES   |    '<true/false>'
MELT_NODEJS_LOGGER_HOST        |    '<logger_host>'
MELT_NODEJS_LOGGER_PORT        |    '<logger_port>'

<br />
<br />

```javascript

const tracker = require('@middlewarelabs-devs/melt-node-metrics');

tracker.track();

tracker.error('error');

tracker.info('info');

tracker.warn('warning');

tracker.debug('debug');

```

