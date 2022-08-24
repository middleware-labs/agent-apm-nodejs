'use strict'

const HostRecorder = require('./host-recorder')

class Recorder {

    constructor(config) {
        this.enqueue=[];
        this.hostRecorder=new HostRecorder(config)
    }

    recorderMetric(metric_name,value,tag=""){
        this.enqueue[metric_name]=value;
    }

    _send(){
        Object.keys(this.enqueue).forEach( metric_name => {
            this.hostRecorder._send(metric_name,this.enqueue[metric_name])
        });
    }

}
module.exports = Recorder

