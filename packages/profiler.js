const Pyroscope = require('@pyroscope/nodejs');
const axios = require('axios');

module.exports.init = async (config) => {

    if (config.enableProfiling && config.accessToken !== '') {
        try {
          const authUrl = process.env.MW_AUTH_URL || config.mwAuthURL; // Update with the correct auth URL
    
          const response = await axios.post(authUrl, null, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer ' + config.accessToken,
            },
          });
    
          if (response.status === 200) {
            const data = response.data;
            if (data.success === true) {
              const account = data.data.account;
              if (typeof account === 'string') {
                config.TenantID = account;
    
                const profilingServerUrl = process.env.MW_PROFILING_SERVER_URL || config.profilingServerUrl;
                
                Pyroscope.init({
                    serverAddress: profilingServerUrl,
                    appName: config.serviceName,
                    tenantID: config.TenantID,
                });
            
                Pyroscope.start()
              } else {
                console.log('Failed to retrieve TenantID from API response');
              }
            } else {
                console.log('Failed to authenticate with Middleware API, kindly check your access token');
            }
          } else {
            console.log('Error making auth request');
          }
        } catch (error) {
          console.log('Error:', error.message);
        }
      }
    
      return config;
}