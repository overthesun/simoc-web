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
        agent: {type: String, default: 'SUM'},
        category: {type: String, default: 'flows'},
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
        agent() {
            this.initChart()
        },
        section() {
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
        updateChart() {
            const currentStep = this.currentStepBuffer
            const {data} = this.chart
            // if the currentStep is not prevStep+1 (e.g. when the user moved the scrubber)
            // we need to redraw the previous nsteps steps, otherwise we just add one step
            let startingStep
            let endingStep
            if (this.fullscreen) {
                // show the full graph
                startingStep = 0
                endingStep = this.nsteps
            } else if (currentStep !== this.prevStep+1) {
                // replace the last nsteps values
                startingStep = currentStep - (this.nsteps-1)
                endingStep = currentStep
            } else {
                // add the latest value
                startingStep = currentStep
                endingStep = currentStep
            }
            // this will do 1 iteration when startingStep == endingStep
            for (let step = startingStep; step <= endingStep; step++) {
                // remove the oldest values
                data.datasets[0].data.shift()
                data.datasets[1].data.shift()
                data.labels.shift()
                if (step > 0) {
                    const productionPath = [this.agent, this.category, 'out', this.currency, 'SUM', step]
                    const consumptionPath = [this.agent, this.category, 'in', this.currency, 'SUM', step]
                    const production = this.getData(productionPath)
                    console.log(production)
                    const consumption = this.getData(consumptionPath)
                    // add the new values
                    data.datasets[0].data.push(production)
                    data.datasets[1].data.push(consumption)
                    data.labels.push(step)
                } else {
                    // for steps <= 0 use undefined as values and '' as labels
                    // so that the plot still has nsteps total items and is not stretched
                    data.datasets[0].data.push(undefined)
                    data.datasets[1].data.push(undefined)
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