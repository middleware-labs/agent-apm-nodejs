# Middleware Node APM


```javascript

const tracker = require('@middleware.io/node-apm');
tracker.track({
    apiKey:"Your middleware api key",
    projectName:"Your application name",
    serviceName:"Your service name",
})

tracker.error(new Error('your error message'));

tracker.info('info');

tracker.warn('warning');

tracker.debug('debug');

```

