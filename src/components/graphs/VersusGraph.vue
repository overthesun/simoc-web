<!--
Energy versus chart component used within the dashboard.

Updates values from the approriate step data getters when the currentStepBuffer value changes.

See chart.js documentation for further details on the related mounted functions.
-->

<template>
    <canvas :id="id" />
</template>

<script>
import {Chart, LineController, LineElement,
        LinearScale, CategoryScale, Tooltip, Legend} from 'chart.js'
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'

Chart.register(LineController, LineElement,
               LinearScale, CategoryScale, Tooltip, Legend)

export default {
    props: {
        id: {type: String, required: true},
        plottedValue: {type: String, required: true},
        unit: {type: String, required: true},
        fullscreen: {type: Boolean, default: false},
        nsteps: {type: Number, required: true},
    },
    setup() {
        const dashboard = useDashboardStore()
        const {isTimerRunning, currentStepBuffer, maxStepBuffer} = storeToRefs(dashboard)
        const {getData} = dashboard
        return {isTimerRunning, currentStepBuffer, maxStepBuffer, getData}
    },
    data() {
        return {
            prevStep: 0,
        }
    },

    watch: {
        // update the chart datasets and labels
        // when the current step buffer changes
        currentStepBuffer() {
            // fullscreen charts show all the values and need no updates
            if (!this.fullscreen) {
                this.updateChart()
            }
        },
        maxStepBuffer() {
            if (this.fullscreen) {
                this.updateChart()
            }
        },
        // re-init the chart when we plot something else
        plottedValue() {
            this.initChart()
        },
        // re-init the chart when we change the number of steps displayed
        nsteps() {
            this.initChart()
        },
    },

    mounted() {
        this.initChart()
    },

    methods: {
        // TODO: this code is very similar to LevelsGraph.vue
        initChart() {
            if (this.chart) {
                // when switching chart we have to destroy
                // the old one before reusing the same canvas
                this.chart.destroy()
            }
            const canvas = document.getElementById(this.id)
            this.chart = new Chart(canvas, {
                type: 'line',
                data: {
                    // fill with '' so that at the beginning the labels don't show undefined
                    labels: Array(this.nsteps).fill(''),
                    datasets: [
                        {
                            lineTension: 0,
                            data: Array(this.nsteps),
                            label: 'Produced',
                            borderColor: '#0000ff',
                            fill: false,
                            pointStyle: 'line',
                        },
                        {
                            lineTension: 0,
                            data: Array(this.nsteps),
                            label: 'Consumed',
                            borderColor: '#cd0000',
                            fill: false,
                            pointStyle: 'line',
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    color: '#eeeeee',
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value, index, values) => {
                                    const val = value > 0 ? value : value.toPrecision(2)
                                    return `${val} ${this.unit}`
                                },
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
        makeLabels(start, end, nsteps) {
            // create nsteps labels from start to end, possibly adding empty slots at the beginning
            const s = Math.max(start+1, 1)  // don't generate steps <1
            const len = (end+1) - s
            return Array(nsteps-len).concat(Array(len).fill().map((d, i) => i + s))
        },
        updateChart() {
            const currentStep = this.currentStepBuffer
            const {data} = this.chart
            // if the currentStep is not prevStep+1 (e.g. when the user moved the scrubber)
            // we need to redraw the previous nsteps steps, otherwise we just add one step
            let startingStep
            let endingStep
            let range
            if (this.fullscreen) {
                // show the full graph
                startingStep = 0
                endingStep = this.nsteps
                range = `*`
            } else if (currentStep !== this.prevStep+1) {
                // replace the last nsteps values
                startingStep = currentStep - this.nsteps
                endingStep = currentStep
                range = `${startingStep}:${endingStep}`
            } else {
                // add the latest value
                startingStep = currentStep
                endingStep = currentStep
                range = currentStep
            }
            const productionPath = ['SUM', 'flows', 'out', this.plottedValue, 'SUM', range]
            const consumptionPath = ['SUM', 'flows', 'in', this.plottedValue, 'SUM', range]
            const production = this.getData(productionPath)
            const consumption = this.getData(consumptionPath)
            if (typeof production === 'object') {
                // replace current range with the new range (in place)
                data.datasets[0].data.splice(0, production.length, ...production)
                data.datasets[1].data.splice(0, consumption.length, ...consumption)
                const labels = this.makeLabels(startingStep, endingStep, this.nsteps)
                data.labels.splice(0, labels.length, ...labels)
                this.chart.update('none')
            } else {
                // shift and add a single value at the end
                data.datasets[0].data.shift()
                data.datasets[1].data.shift()
                data.labels.shift()
                data.datasets[0].data.push(production)
                data.datasets[1].data.push(consumption)
                data.labels.push(currentStep)
                this.chart.update()
            }
            this.prevStep = currentStep
        },
    },
}
</script>

<style lang="scss" scoped>

</style>
