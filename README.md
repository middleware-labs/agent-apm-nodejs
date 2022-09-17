# Middleware Node APM

### Environment Variables
<br />


Environment Name               |    Value
------------------------------ |    --------------------------
MW_NODEJS_LOGGER_HOST        |    '<logger_host>'
MW_NODEJS_LOGGER_PORT        |    '<logger_port>'

<br />
<br />

```javascript

const tracker = require('@middleware.io/node-apm');

tracker.track({
    host:"http://localhost:4320",
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

