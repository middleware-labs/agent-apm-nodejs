'use strict'
//require('./tracing')
const MetricsCollector = require("./metrics-collector");
const exec = require('child_process').exec;
const logger = require('./logger')

module.exports.track =   () => {
    // let isHostInstalled = await isHostRunning('chrome')
    let isHostInstalled=false;
    let collector = new MetricsCollector({isHostInstalled})
    collector.init()
};

module.exports.log =  (label,msg) => {
    logger.log(label,msg)
};

async function isHostRunning(query) {
    try{
        let platform = process.platform;
        let cmd = '';
        switch (platform) {
            case 'win32' : cmd = `tasklist`; break;
            case 'darwin' : cmd = `ps -ax | grep ${query}`; break;
            case 'linux' : cmd = `ps -A`; break;
            default: break;
        }
        const {stdout } = await exec(cmd);
        return (stdout && JSON.stringify(stdout).toLowerCase().indexOf(query.toLowerCase()) > -1)
    } catch(e){
        console.log(e)
    }
    return false
}

