'use strict'
const v8 = require('v8')
const os = require('os')
const Recorder = require("./recorder");
let time;
let cpuUsage;
let recorder;
module.exports.track =  ()=> {
    time = process.hrtime()
    recorder = new Recorder()
    setInterval(()=>{
        getCPUUsages()
        getHeapSpace()
        getMemoryUsages()
        getHeapStats()
    },10000)
};

function getCPUUsages(){
    if (!process.cpuUsage) return

    const elapsedTime = process.hrtime(time)
    const elapsedUsage = process.cpuUsage(cpuUsage)

    time = process.hrtime()
    cpuUsage = process.cpuUsage()

    const elapsedMs = elapsedTime[0] * 1000 + elapsedTime[1] / 1000000
    const userPercent = 100 * elapsedUsage.user / 1000 / elapsedMs
    const systemPercent = 100 * elapsedUsage.system / 1000 / elapsedMs
    const totalPercent = userPercent + systemPercent

    recorder.recorderMetric('node.cpu.system', systemPercent.toFixed(2))
    recorder.recorderMetric('node.cpu.user', userPercent.toFixed(2))
    recorder.recorderMetric('node.cpu.total', totalPercent.toFixed(2))
    recorder.recorderMetric('runtime.node.process.uptime', Math.round(process.uptime()))
}

function getHeapSpace () {
    if (!v8.getHeapSpaceStatistics) return

    const stats = v8.getHeapSpaceStatistics()
    for (let i = 0, l = stats.length; i < l; i++) {
        const tags = [`space:${stats[i].space_name}`]
        recorder.recorderMetric('heap.size.by.space', stats[i].space_size, tags)
        recorder.recorderMetric('heap.used_size.by.space', stats[i].space_used_size, tags)
        recorder.recorderMetric('heap.available_size.by.space', stats[i].space_available_size, tags)
        recorder.recorderMetric('heap.physical_size.by.space', stats[i].physical_space_size, tags)
    }
}

function getMemoryUsages(){
    const stats = process.memoryUsage()
    recorder.recorderMetric('mem.heap_total', stats.heapTotal)
    recorder.recorderMetric('node.mem.heap_used', stats.heapUsed)
    recorder.recorderMetric('node.mem.rss', stats.rss)
    recorder.recorderMetric('node.mem.total', os.totalmem())
    recorder.recorderMetric('node.mem.free', os.freemem())

    stats.external && recorder.recorderMetric('runtime.node.mem.external', stats.external)
}

function getHeapStats () {
    const stats = v8.getHeapStatistics()

    recorder.recorderMetric('node.heap.total_heap_size', stats.total_heap_size)
    recorder.recorderMetric('node.heap.total_heap_size_executable', stats.total_heap_size_executable)
    recorder.recorderMetric('node.heap.total_physical_size', stats.total_physical_size)
    recorder.recorderMetric('node.heap.total_available_size', stats.total_available_size)
    recorder.recorderMetric('node.heap.heap_size_limit', stats.heap_size_limit)

    stats.malloced_memory && recorder.recorderMetric('node.heap.malloced_memory', stats.malloced_memory)
    stats.peak_malloced_memory && recorder.recorderMetric('node.heap.peak_malloced_memory', stats.peak_malloced_memory)
}
