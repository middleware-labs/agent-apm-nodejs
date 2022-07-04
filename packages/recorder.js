'use strict'

const socket = require('./socket')
const HostRecorder = require('./host-recorder')

class Recorder {

    constructor(config) {
        this.isHostInstalled = config.isHostInstalled || false;
        this.enqueue=[];
        if (!this.isHostInstalled){
            this.hostRecorder=new HostRecorder()
        }else {
            this.socket = new socket();
        }
    }

    recorderMetric(metric_name,value,tag=""){
        this.enqueue[metric_name]=value;
    }

    _send(host = false){
        if (host){
            this.buffer = Buffer.from(JSON.stringify(this.enqueue))
            this.socket._send([this.buffer])
        }else{
            console.log('length',this.enqueue.length)
            Object.keys(this.enqueue).forEach( metric_name => {
               this.hostRecorder._send(metric_name,this.enqueue[metric_name])
            });
        }
    }

}
module.exports = Recorder

