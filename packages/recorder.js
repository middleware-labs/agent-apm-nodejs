'use strict'

const socket = require('./socket')
const HostRecorder = require('./host-recorder')

class Recorder {

    constructor(config) {
        this.isHostInstalled = config.isHostInstalled || false;
        if (!this.isHostInstalled){
            this.hostRecorder=new HostRecorder()
        }else {
            this.socket = new socket();
            this.enqueue=[];
        }
    }

    recorderMetric(metric_name,value){
        this.isHostInstalled ? this.enqueue.push({metric_name:value}) : this.hostRecorder._send(metric_name,value)
    }

    _sendToHost(){
        let buffer = Buffer.from(JSON.stringify(this.enqueue))
        this.socket._send([buffer])
    }
}
module.exports = Recorder

