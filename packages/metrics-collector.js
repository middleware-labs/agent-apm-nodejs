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
            if(this.isHostInstalled)
                this.recorder._sendToHost()
        }, 10000)
    }

    getCPUUsages(){
        if (!process.cpuUsage) return

        const elapsedTime = process.hrtime(this.time)
        const elapsedUsage = process.cpuUsage(this.cpuUsage)

        this.time = process.hrtime()
        this.cpuUsage = process.cpuUsage()

        const elapsedMs = elapsedTime[0] * 1000 + elapsedTime[1] / 1000000
        const userPercent = 100 * elapsedUsage.user / 1000 / elapsedMs
        const systemPercent = 100 * elapsedUsage.system / 1000 / elapsedMs
        const totalPercent = userPercent + systemPercent

        this.recorder.recorderMetric('node.cpu.system', systemPercent.toFixed(2))
        this.recorder.recorderMetric('node.cpu.user', userPercent.toFixed(2))
        this.recorder.recorderMetric('node.cpu.total', totalPercent.toFixed(2))
        this.recorder.recorderMetric('node.process.time', Math.round(process.uptime()))
    }

    getHeapSpace () {
        if (!v8.getHeapSpaceStatistics) return
        const stats = v8.getHeapSpaceStatistics()
        for (let i = 0, l = stats.length; i < l; i++) {
            const tags = [`space:${stats[i].space_name}`]
            this.recorder.recorderMetric('heap.size.by.space', stats[i].space_size, tags)
            this.recorder.recorderMetric('heap.used_size.by.space', stats[i].space_used_size, tags)
            this.recorder.recorderMetric('heap.available_size.by.space', stats[i].space_available_size, tags)
            this.recorder.recorderMetric('heap.physical_size.by.space', stats[i].physical_space_size, tags)
        }
    }

    getMemoryUsages(){
        const stats = process.memoryUsage()
        this.recorder.recorderMetric('mem.heap_total', stats.heapTotal)
        this.recorder.recorderMetric('node.mem.heap_used', stats.heapUsed)
        this.recorder.recorderMetric('node.mem.rss', stats.rss)
        this.recorder.recorderMetric('node.mem.total', os.totalmem())
        this.recorder.recorderMetric('node.mem.free', os.freemem())

        stats.external && this.recorder.recorderMetric('node.mem.external', stats.external)
    }

    getHeapStats () {
        const stats = v8.getHeapStatistics()

        this.recorder.recorderMetric('node.heap.total_heap_size', stats.total_heap_size)
        this.recorder.recorderMetric('node.heap.total_heap_size_executable', stats.total_heap_size_executable)
        this.recorder.recorderMetric('node.heap.total_physical_size', stats.total_physical_size)
        this.recorder.recorderMetric('node.heap.total_available_size', stats.total_available_size)
        this.recorder.recorderMetric('node.heap.heap_size_limit', stats.heap_size_limit)

        stats.malloced_memory && this.recorder.recorderMetric('node.heap.malloced_memory', stats.malloced_memory)
        stats.peak_malloced_memory && this.recorder.recorderMetric('node.heap.peak_malloced_memory', stats.peak_malloced_memory)
    }
}
module.exports = MetricsCollector
