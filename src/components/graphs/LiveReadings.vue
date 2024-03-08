<!--
Averages graph takes the average of a set of readings from a group of sensors and displays
it on a line chart. The minor line represents each mathematical variable in the average. The
major line is the average itself.
This graph will display as many minor lines as there are readings and only one major line.
The visual difference between minor and major lines are in there opacity with minor lines being
50% transparent and the major line being fully opaque.
-->

<template>
    <canvas :id="id" />
</template>


<script>
import {Chart, LineController, LineElement,
        LinearScale, CategoryScale, Tooltip, Legend} from 'chart.js'
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useLiveStore} from '../../store/modules/LiveStore'

Chart.register(LineController, LineElement, LinearScale, CategoryScale, Tooltip, Legend)

const getColorRange = (baseColor, n=1) => {
    // Given a hex color, return a list of shades lighter/darker
    const output = []
    const step = Math.min(0.4, 1.6 / n)
    const start = (1 - (n * step / 2))
    // ref: https://www.sitepoint.com/javascript-generate-lighter-darker-color/
    const hex = String(baseColor).replace(/[^0-9a-f]/gi, '')
    for (let i = 0; i < n; i++) {
        const lum = start + (i * step)
        let rgb = '#'
        for (let j = 0; j < 3; j++) {
            let c = parseInt(hex.substr(j * 2, 2), 16)
            c = Math.round(Math.min(Math.max(0, c * lum), 255)).toString(16)
            rgb += c.padStart(2, '0')
        }
        output.push(rgb)
    }
    return output
}
export default {
    props: {
        id: {type: String, required: true},
        plottedValue: {type: String, required: true},
        currency: {type: String, required: true},
        color: {type: String, required: true},
        unit: {type: String, required: true},
        hostname: {type: String, default: ''},
        sensorname: {type: String, default: ''},
        currencySensorInfo: {type: Object, required: true},
        fullscreen: {type: Boolean, default: false},
        nsteps: {type: Number, required: true},
    },
    setup() {
        const dashboard = useDashboardStore()
        const liveStore = useLiveStore()
        const {currentStepBuffer} = storeToRefs(dashboard)
        const {sensorInfo} = storeToRefs(liveStore)
        const {getReadings, getTimestamp} = liveStore
        return {currentStepBuffer, sensorInfo, getReadings, getTimestamp}
    },
    data() {
        return {
            prevStep: 0,
            activeSensors: [],
        }
    },
    watch: {
        // calculate the average for the panel currency then update the chart datasets
        // and labels when the current step buffer changes
        currentStepBuffer() {
            this.updateChart()
        },
        // re-init the chart when we plot something else
        plottedValue() {
            this.updateActiveSensors()
            this.initChart()
        },
        hostname() {
            this.updateActiveSensors()
            this.initChart()
        },
        sensorname() {
            this.updateActiveSensors()
            this.initChart()
        },
        currencySensorInfo() {
            this.updateActiveSensors()
            this.initChart()
        },
        // re-init the chart when we change the number of steps displayed
        nsteps() {
            this.initChart()
        },
    },
    mounted() {
        this.updateActiveSensors()
        this.initChart()
    },
    methods: {
        updateActiveSensors() {
            if (this.plottedValue === 'all') {
                this.activeSensors = Object.keys(this.currencySensorInfo)
            } else {
                this.activeSensors = [this.plottedValue]
            }
        },
        stepnum2timestamp(step) {
            const time = this.getTimestamp(step)
            return (time === undefined) ? '00:00:00' : time.time
        },
        initChart() {
            if (this.chart) {
                // when switching chart we have to destroy
                // the old one before reusing the same canvas
                this.chart.destroy()
            }
            const canvas = document.getElementById(this.id)
            // TODO: Create list of shades of this.color
            const colors = getColorRange(this.color, this.activeSensors.length)
            this.chart = new Chart(canvas, {
                type: 'line',
                data: {
                    // fill with '' so that at the beginning the labels don't show undefined
                    labels: Array(this.nsteps).fill(''),
                    // TODO: Create total number of datasets equal to total number of CO2 sensors
                    datasets: [{
                        lineTension: 0,
                        data: Array(this.nsteps),
                        label: `${this.hostname}.${this.sensorname}`,
                        borderColor: colors[0],
                        fill: false,
                        pointStyle: 'line',
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    color: '#eeeeee',
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value, index, values) => `${value}${this.unit}`,
                            },
                        },
                        x: {
                            beginAtZero: true,
                        },
                    },
                    animation: {
                        /* this prevents the new points to rise from
                         * the bottom and just slide in from the right */
                        y: {duration: 0},
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            // https://stackoverflow.com/a/50450646
                            labels: {usePointStyle: true},
                        },
                        tooltip: {
                            mode: 'index', // show both values
                            intersect: false,
                            usePointStyle: true,
                            callbacks: {
                                title: context => `Step: ${context[0].label}`,
                            },
                        },
                    },
                },
            })
            this.updateChart()
        },
        updateChart() {
            const currentStep = this.currentStepBuffer
            const {data} = this.chart
            // if the currentStep is not prevStep + 1 (e.g. when the user moved the scrubber)
            // we need to redraw the previous nsteps steps, otherwise we just add one step
            let startingStep
            if (currentStep !== this.prevStep + 1) {
                startingStep = currentStep - this.nsteps  // replace all nsteps values
            } else {
                startingStep = currentStep  // add the latest value
            }
            // this will do 1 or nsteps iterations (maybe refactor it to something better)
            for (let step = startingStep; step <= currentStep; step++) {
                // remove the oldest values
                data.datasets.forEach(set => set.data.shift())
                data.labels.shift()
                if (step > 0) {
                    if (!this.hostname.length || !this.sensorname.length ||
                        !this.plottedValue.length) {
                        return
                    }
                    const r = this.getReadings(step)
                    const sensor_id = `${this.hostname}.${this.sensorname}`
                    const value = r[sensor_id][this.plottedValue]
                    data.datasets[0].data.push(value)
                    data.labels.push(this.stepnum2timestamp(step))
                } else {
                    // for steps <= 0 use undefined as values and '' as labels
                    // so that the plot still has nsteps total items and is not stretched
                    data.datasets.forEach(set => set.data.push(undefined))
                    data.labels.push('')
                }
            }
            this.chart.update()
            this.prevStep = currentStep
        },
    },
}
</script>


<style lang="scss" scoped>
</style>
