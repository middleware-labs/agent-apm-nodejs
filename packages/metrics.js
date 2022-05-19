'use strict'
const MetricsCollector = require("./metrics-collector");
const exec = require('child_process').exec;
require('./tracing')
module.exports.track =  async () => {
    // let isHostInstalled = await isHostRunning('chrome')
    let isHostInstalled=false;
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
        const {stdout } = await exec(cmd);
        return (stdout && JSON.stringify(stdout).toLowerCase().indexOf(query.toLowerCase()) > -1)
    } catch(e){
        console.log(e)
    }
    return false
}

// for testing
const express = require('express');
const app = express()
const port = 3070
app.get('/movies', async function (req, res) {
    res.type('json')
    // var delay = Math.floor( ( Math.random() * 2000 ) + 100);
    setTimeout((() => {
        res.send(({
            movies: [
                {name: 'Jaws', genre: 'Thriller'},
                {name: 'Annie', genre: 'Family'},
                {name: 'Jurassic Park', genre: 'Action'},
            ]
        }))
    }), 1000)
})

app.listen(port, () => {
    console.log(`Listening movies at http://localhost:${port}`)
})