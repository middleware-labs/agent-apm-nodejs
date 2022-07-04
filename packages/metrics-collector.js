'use strict'
const v8 = require('v8')
const os = require('os')
const Recorder = require("./recorder");

class MetricsCollector {

    constructor(config) {
        this.isHostInstalled = config.isHostInstalled || false;
        this.time = process.hrtime()
        this.cpuUsage=false
        this.recorder = new Recorder({isHostInstalled:this.isHostInstalled})
    }

    init(){
        setInterval(() => {
              this.getCPUUsages()
              this.getHeapSpace()
              this.getMemoryUsages()
              this.getHeapStats()
              this.recorder._send(this.isHostInstalled)
        }, 10000)
    }

     getCPUUsages(){
        if (!process.cpuUsage) return

        this.elapsedTime = process.hrtime(this.time)
        this.elapsedUsage = process.cpuUsage(this.cpuUsage)

        this.time = process.hrtime()
        this.cpuUsage = process.cpuUsage()

        this.elapsedMs =  this.elapsedTime[0] * 1000 +  this.elapsedTime[1] / 1000000
        this.userPercent = 100 *  this.elapsedUsage.user / 1000 /  this.elapsedMs
        this.systemPercent = 100 *  this.elapsedUsage.system / 1000 /  this.elapsedMs
        this.totalPercent =  this.userPercent +  this.systemPercent
        this.recorder.recorderMetric('cpu.system',  this.systemPercent.toFixed(2))
        this.recorder.recorderMetric('cpu.user',  this.userPercent.toFixed(2))
        this.recorder.recorderMetric('cpu.total',  this.totalPercent.toFixed(2))
        this.recorder.recorderMetric('process.uptime', Math.round(process.uptime()))
    }

     getHeapSpace () {
        if (!v8.getHeapSpaceStatistics) return
        this.stats = v8.getHeapSpaceStatistics()
        for (let i = 0, l = this.stats.length; i < l; i++) {
            this.tags = `${this.stats[i].space_name}`
            this.recorder.recorderMetric(`heap.size.by.space.${this.tags}`,this.stats[i].space_size, this.tags)
            this.recorder.recorderMetric(`heap.used_size.by.space.${this.tags}`, this.stats[i].space_used_size, this.tags)
            this.recorder.recorderMetric(`heap.available_size.by.space.${this.tags}`, this.stats[i].space_available_size, this.tags)
            this.recorder.recorderMetric(`heap.physical_size.by.space.${this.tags}`, this.stats[i].physical_space_size, this.tags)
        }
    }

     getMemoryUsages(){
        this.stats = process.memoryUsage()
        console.log(`The script uses approximately ${Math.round(( process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100} MB`);
        this.recorder.recorderMetric('mem.heap_total', this.stats.heapTotal)
        this.recorder.recorderMetric('mem.heap_used', this.stats.heapUsed)
        this.recorder.recorderMetric('mem.rss', this.stats.rss)
        this.recorder.recorderMetric('mem.total', os.totalmem())
        this.recorder.recorderMetric('mem.free', os.freemem())

        this.stats.external && this.recorder.recorderMetric('mem.external', this.stats.external)
    }

     getHeapStats () {
        this.stats = v8.getHeapStatistics()

        this.recorder.recorderMetric('heap.total_heap_size', this.stats.total_heap_size)
        this.recorder.recorderMetric('heap.total_heap_size_executable', this.stats.total_heap_size_executable)
        this.recorder.recorderMetric('heap.total_physical_size', this.stats.total_physical_size)
        this.recorder.recorderMetric('heap.total_available_size', this.stats.total_available_size)
        this.recorder.recorderMetric('heap.heap_size_limit', this.stats.heap_size_limit)

        this.stats.malloced_memory && this.recorder.recorderMetric('heap.malloced_memory', this.stats.malloced_memory)
        this.stats.peak_malloced_memory && this.recorder.recorderMetric('heap.peak_malloced_memory', this.stats.peak_malloced_memory)
    }
}
module.exports = MetricsCollector
