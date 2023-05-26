<!--
Plots all fields/values for a given agent and category, e.g. 'human:flows'. Based on VersusGraph.

Valid categories:
  - flows: All exchanges as positive values
  - storage: All currencies for which agent has capacity
  - deprive: Remaining agent-hours before dying from lack
  - growth: Class-specific attibutes which change over time, e.g. te_factor
-->

<template>
    <canvas :id="id" />
</template>

<script>
import {Chart, LineController, LineElement,
        LinearScale, CategoryScale, Tooltip, Legend} from 'chart.js'
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {StringFormatter, make_labels, colors} from '../../javascript/utils'

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
        const {
            isTimerRunning, currentStepBuffer, maxStepBuffer, currencyDict,
        } = storeToRefs(dashboard)
        const {getData} = dashboard
        return {isTimerRunning, currentStepBuffer, maxStepBuffer, currencyDict,
                getData}
    },
    data() {
        return {
            prevStep: 0,
            datasetsIndex: {},
            unit: 'kg',  // TODO: In some cases it also includes kwh and ratios, so this is inaccurate.
            colors: colors,
            notInitialized: false,
        }
    },
    computed: {
        stub() {  // The path without the last value (step index)
            if (this.category === 'flows') {
                return [this.agent, 'flows', '*', '*', 'SUM']
            } elif (this.category === 'growth') {
                // Growth and deprive
                return [this.agent, this.category, '*']
            }
        },
    },
    watch: {
        // update the chart datasets and labels when the current step buffer changes
        currentStepBuffer() {
            if (this.notInitialized) {
                // ChartJS needs a 'datasets' object to initialize. Since this panel is dynamic and
                // the number/type of datasets is not known until the first step, we initialize it
                // with empty datasets while its loading (triggered by the call to initChart in
                // mounted), and update them here when the first step is ready.
                this.notInitialized = false
                this.initChart()
            } else if (!this.fullscreen) {
                // fullscreen charts show all the values and need no updates
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
            // Data for 'flows' contains an extra level of heirarchy, 'in' or 'out'.
            // Here I remove that layer and instead make 'out' amounts negative.
            const consolidated = {}
            const directions = ['in', 'out']
            directions.forEach(direction => {
                if (data[direction]) {
                    const multiplier = ({in: 1, out: -1})[direction]
                    Object.entries(data[direction]).forEach(([currency, amount]) => {
                        if (typeof amount === 'object') {
                            consolidated[currency] = amount.map(a => a * multiplier)
                        } else {
                            consolidated[currency] = amount * multiplier
                        }
                    })
                }
            })

            // For Inhabitants, the number of potential 'food' fields is excessive,
            // so we combile them all into a single field, 'food'.
            if (this.agent === 'human' && !('food' in consolidated)) {
                const foodFields = Object.keys(consolidated)
                        .filter(f => this.currencyDict[f].category === 'food')
                foodFields.forEach(field => {
                    const amount = consolidated[field]
                    delete consolidated[field]
                    if (!('food' in consolidated)) {
                        consolidated.food = amount
                    } else if (typeof amount === 'object') {
                        consolidated.food = consolidated.food.map((a, i) => a + amount[i])
                    } else {
                        consolidated.food += amount
                    }
                })
            }

            return consolidated
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
            let datasets
            if (data === undefined) {
                // Before the first packet of data is sent.
                this.notInitialized = true
                datasets = []
            } else {
                if (this.category === 'flows') {
                    data = this.consolidateFlows(data)
                }
                this.datasetsIndex = {}
                const datasetsData = {}
                Object.keys(data).forEach((field, index) => {
                    this.datasetsIndex[field] = parseInt(index, 10)
                    const cd = (field in this.currencyDict) ? this.currencyDict[field] : null
                    datasetsData[field] = {
                        unit: cd ? cd.unit : '',
                        label: cd ? (cd.short || cd.label) : StringFormatter(field),
                    }
                })
                // Return true if there is more than one different value for 'unit' in datasetsData
                const allUnits = new Set(Object.values(datasetsData).map(d => d.unit))
                this.unit = allUnits.size === 1 ? allUnits.values().next().value : ''
                datasets = Object.values(datasetsData).map(({unit, label}, i) => ({
                    lineTension: 0,
                    data: Array(this.nsteps),
                    label: label + ((unit && !this.unit) ? ` (${unit})` : ''),
                    // TODO: Get field-specific color from currencyDict or fieldDict
                    borderColor: this.colors[i],
                    fill: false,
                    pointStyle: 'line',
                }))
            }

            this.chart = new Chart(canvas, {
                type: 'line',
                data: {
                    // fill with '' so that at the beginning the labels don't show undefined
                    labels: Array(this.nsteps),
                    datasets: datasets,
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    color: '#eeeeee',
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: {
                                callback: (value, index, values) => {
                                    if (value === 0 || Math.abs(value) > 10) {
                                        return `${Math.round(value)} ${this.unit}`
                                    } else {
                                        return `${value.toPrecision(2)} ${this.unit}`
                                    }
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

            // Hide these fields initially, but still make them accessible.
            const hiddenByDefault = ['agent_step_num']
            hiddenByDefault.forEach(field => {
                const index = this.datasetsIndex[field]
                if (index !== undefined) {
                    this.chart.getDatasetMeta(index).hidden = true
                }
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
            const path = this.stub.concat([range])
            let allResults = this.getData(path)
            if (this.category === 'flows') {
                allResults = this.consolidateFlows(allResults)
            }
            Object.entries(allResults).forEach(([field, result], i) => {
                const index = this.datasetsIndex[field]
                if (typeof result === 'object') {
                    // replace current range with the new range (in place)
                    data.datasets[index].data.splice(0, result.length, ...result)
                    if (i === 0) {
                        const labels = make_labels(startingStep, endingStep, this.nsteps)
                        data.labels.splice(0, labels.length, ...labels)
                    }
                } else {
                    data.datasets[index].data.shift()
                    data.datasets[index].data.push(result)
                    if (i === 0) {
                        data.labels.shift()
                        data.labels.push(currentStep)
                    }
                }
            })
            this.chart.update()
            this.prevStep = currentStep
        },
    },
}
</script>

<style lang="scss" scoped>

</style>
