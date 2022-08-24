# melt-node-metrics

## Installation

`npm install @middlewarelabs-devs/melt-node-metrics` or `yarn add @middlewarelabs-devs/melt-node-metrics`

### Environment Variables

export OTEL_EXPORTER_OTLP_ENDPOINT = '<capture_address>'

export MELT_NODEJS_LOGGER_HOST = '<logger_host>'

export MELT_NODEJS_LOGGER_PORT = '<logger_port>'

export MELT_API_KEY = '<api_key>'

export MELT_NODEJS_APM_PAUSE_METRICS = '<true/false>'

export MELT_NODEJS_APM_PAUSE_TRACES = '<true/false>'


```javascript

const tracker = require('@middlewarelabs-devs/melt-node-metrics');

tracker.track();

tracker.error('error');

tracker.info('info');

tracker.warn('warning');

tracker.debug('debug');

```

