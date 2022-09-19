# Middleware Node APM


```javascript

const tracker = require('@middleware.io/node-apm');
tracker.track({
    host:"localhost",
    port: {
        grpc: 4320,
        fluent: 8006
    },
    apiKey:"36kb1q8i2aqxdpw4keb5z6aq3fz0zayl4",
    projectName:"project 1",
    serviceName:"service 1",
    pauseMetrics:0,
    pauseTraces:0
})

tracker.error('error');

tracker.info('info');

tracker.warn('warning');

tracker.debug('debug');

```

