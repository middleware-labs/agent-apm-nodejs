# Middleware Node APM


```javascript

const tracker = require('@middleware.io/node-apm');
tracker.track({
    projectName:"Your application name",
    serviceName:"Your service name",
})

tracker.error(new Error('your error message'));

tracker.info('your info messaege');

tracker.warn('your warning message');

tracker.debug('your debug message');

```

