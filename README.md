# melt-node-metrics

## Installation

`npm install @middlewarelabs-devs/melt-node-metrics` or `yarn add @middlewarelabs-devs/melt-node-metrics`

### Environment Variables

set OTEL_EXPORTER_OTLP_ENDPOINT = '<capture_address>'

set MELT_LOGGER_ENDPOINT = '<logger_endpoint>'

set MELT_API_KEY = '<api_key>'

set MELT_APM_PAUSE_METRICS = '<true/false>'

set MELT_APM_PAUSE_TRACES = '<true/false>'


```javascript

const tracker = require('@middlewarelabs-devs/melt-node-metrics');

tracker.track();

tracker.error('error');

tracker.info('info');

tracker.warn('warning');

tracker.debug('debug');

tracker.log('log');

```

