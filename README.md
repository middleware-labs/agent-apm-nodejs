# melt-node-metrics

## Installation

`npm install @middlewarelabs-devs/melt-node-metrics` or `yarn add @middlewarelabs-devs/melt-node-metrics`

### Environment Variables

set OTEL_EXPORTER_OTLP_ENDPOINT = '<capture_address>'

set MELT_LOGGER_ENDPOINT = '<logger_endpoint>'


```javascript

const tracker = require('@middlewarelabs-devs/melt-node-metrics')

tracker.track({
    MELT_API_KEY:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ',
    MELT_APM_PAUSE_METRICS:false,
    MELT_APM_PAUSE_TRACES:false
})

tracker.error('error');

tracker.info('info');

tracker.warn('warning');

tracker.debug('debug');

tracker.log('log');

```

