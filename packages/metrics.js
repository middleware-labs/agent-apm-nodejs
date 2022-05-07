'use strict'
const MetricsCollector = require("./metrics-collector");
const exec = require('child_process').exec;
module.exports.track =  async () => {
    // let isHostInstalled = await isHostRunning('chrome')
    let isHostInstalled=true;
    let collector = new MetricsCollector({isHostInstalled})
    collector.init()
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
        const { stdout } = await exec(cmd);
        return (stdout && stdout.toLowerCase().indexOf(query.toLowerCase()) > -1)
    } catch(e){
        console.log(e)
    }
    return false
}