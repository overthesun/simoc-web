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
import {StringFormatter} from '../../javascript/utils'

Chart.register(LineController, LineElement,
               LinearScale, CategoryScale, Tooltip, Legend)

export default {
    props: {
        id: {type: String, required: true},
        agent: {type: String, required: true},
        category: {type: String, required: true},
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
            datasetsIndex: {},
            unit: 'kg',
        }
    },
    computed: {
        stub() {  // The path without the last value (step index)
            if (this.category === 'flows') {
                return [this.agent, 'flows', '*', '*', 'SUM']
            } else {
                return [this.agent, this.category, '*']
            }
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
        category() {
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
        consolidateFlows(data) {
            // The 'flows' category is different from others in that there are
            // 2 additional levels of heirarchy: direction (in/out) and
            // connection (who the flow is from/to). The latter can be summed
            // by parseData, but the former has to be done manually.
            return Object.values(data).reduce((prev, curr) => (
                {...prev, ...curr}
            ), {})
        },
        // TODO: this code is very similar to LevelsGraph.vue
        initChart() {
            if (this.chart) {
                // when switching chart we have to destroy
                // the old one before reusing the same canvas
                this.chart.destroy()
            }
            const canvas = document.getElementById(this.id)

            // Build the datasets object, and corresponding index, from the selected data
            let data = this.getData(this.stub.concat([1]))
            if (this.category === 'flows') {
                data = this.consolidateFlows(data)
            }
            const fields = Object.keys(data)
            this.datasetsIndex = Object.fromEntries(  // create a currency:index map
                Object.entries(fields).map(([a, b]) => [b, parseInt(a)]))
            const datasets = fields.map(item => ({
                lineTension: 0,
                data: Array(this.nsteps),
                label: StringFormatter(item),
                borderColor: '#0000ff',
                fill: false,
                pointStyle: 'line',
            }))

            this.chart = new Chart(canvas, {
                type: 'line',
                data: {
                    // fill with '' so that at the beginning the labels don't show undefined
                    labels: Array(this.nsteps).fill(''),
                    datasets: datasets,
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
                data.datasets.forEach(ds => ds.data.shift())
                data.labels.shift()
                if (step > 0) {
                    const path = this.stub.concat([step])
                    let result = this.getData(path)
                    if (this.category === 'flows') {
                        result = this.consolidateFlows(result)
                    }
                    Object.entries(result).forEach(([field, amount]) => {
                        const index = this.datasetsIndex[field]
                        data.datasets[index].data.push(amount)
                    })
                    data.labels.push(step)
                } else {
                    // for steps <= 0 use undefined as values and '' as labels
                    // so that the plot still has nsteps total items and is not stretched
                    data.datasets.forEach(ds => ds.data.push(undefined))
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
