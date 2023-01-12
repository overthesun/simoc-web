<!--
Storage Levels chart component used within the dashboard.

Updates values from the approriate step data getters when the currentStepBuffer value changes.

See chart.js documentation for further details on the related mounted functions.
-->

<template>
    <canvas :id="id" />
</template>

<script>
import {Chart, LineController, LineElement, PointElement,
        LinearScale, CategoryScale, Tooltip, Legend, Filler} from 'chart.js'
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'

Chart.register(LineController, LineElement, PointElement,
               LinearScale, CategoryScale, Tooltip, Legend, Filler)

export default {
    props: {
        id: {type: String, required: true},
        plottedStorage: {type: String, required: true},
        storagesMapping: {type: Object, required: true},  // TODO: Revert ABM Workaround
        fullscreen: {type: Boolean, default: false},
        nsteps: {type: Number, required: true},
    },
    setup() {
        const dashboard = useDashboardStore()
        const {currentStepBuffer} = storeToRefs(dashboard)
        const {getData} = dashboard
        return {currentStepBuffer, getData}
    },
    data() {
        return {
            prevStep: 0,
            storage_name: String,
            storage_num: String,
            storageType: String,  // TODO: Revert ABM Workaround
            setsinfo: {
                // These are used to determine labels, colors, and line order in the graph.
                // They should be updated if a new storage type or currency is added,
                // or a generic fallback should be added.
                air_storage: {
                    labels_colors: [['H₂O', '#46f0f0'], ['CO₂', '#e6194b'], ['H₂', '#ffe119'],
                                    ['CH₄', '#f58231'], ['O₂', '#3cb44b'], ['N₂', '#4363d8']],
                    order: {h2o: 0, co2: 1, h2: 2, ch4: 3, o2: 4, n2: 5},
                },
                water_storage: {
                    labels_colors: [['Potable', '#46f0f0'], ['Treated', '#4363d8'],
                                    ['Urine', '#ffe119'], ['Waste', '#f58231']],
                    order: {potable: 0, treated: 1, urine: 2, feces: 3},
                },
                nutrient_storage: {
                    labels_colors: [['Inedible Biomass', '#3cb44b'], ['Waste', '#f58231'],
                                    ['Fertilizer', '#46f0f0']],
                    order: {inedible_biomass: 0, waste: 1, fertilizer: 2},
                },
            },
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
        // re-init the chart when we plot something else
        plottedStorage() {
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
        // TODO: this code is very similar to VersusGraph.vue
        initChart() {
            [this.storage_name, this.storage_num] = this.plottedStorage.split('/')
            this.storage_type = this.storagesMapping[this.storage_name]
            if (this.chart) {
                // when switching chart we have to destroy
                // the old one before reusing the same canvas
                this.chart.destroy()
            }
            // create and initialize chart
            const canvas = document.getElementById(this.id)
            this.chart = new Chart(canvas, {
                type: 'line',
                data: {
                    // fill with '' so that at the beginning the labels don't show undefined
                    labels: Array(this.nsteps).fill(''),
                    // create N datasets with different labels/colors
                    datasets: this.setsinfo[this.storage_type].labels_colors.map(
                        ([label, color]) => ({
                            lineTension: 0,
                            data: Array(this.nsteps),
                            label: label,
                            backgroundColor: color,
                            fill: true,
                            pointStyle: 'line',
                        })
                    ),
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    color: '#eeeeee',
                    scales: {
                        y: {
                            stacked: true,
                            beginAtZero: true,
                            ticks: {
                                // by default the values go up to 120% instead
                                // of stopping at 100%, but with max: 100 it's
                                // always stuck at 100% and it doesn't scale
                                // when only small values are displayed
                                callback: (value, index, values) => `${value}%`,
                            },
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
                            labels: {
                                boxWidth: 20,
                            },
                        },
                        tooltip: {
                            mode: 'index', // show both values
                            intersect: false,
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
                // remove the oldest values and labels
                Object.values(data.datasets).forEach(dataset => dataset.data.shift())
                data.labels.shift()
                // add the new values
                if (step > 0) {
                    const storagePath = [this.storage_name, 'storage', '*', step]
                    const storage = this.getData(storagePath)
                    const tot_storage = Object.values(storage).reduce((a, b) => a + b)
                    Object.entries(storage).forEach(
                        ([key, elem]) => {
                            // find dataset index, calc ratio, and add the ratio to the dataset
                            const index = this.setsinfo[this.storage_type].order[key]
                            const ratio = (elem * 100 / tot_storage).toFixed(4)
                            data.datasets[index].data.push(ratio)
                        }
                    )
                    data.labels.push(step)
                } else {
                    // for steps <= 0 use undefined as values and '' as labels
                    // so that the plot still has nsteps total items and is not stretched
                    Object.values(data.datasets).forEach(dataset => dataset.data.push(undefined))
                    data.labels.push('')
                }
            }
            this.chart.update()
            this.prevStep = currentStep
        },
    },
}
</script>

<style lang="scss">
</style>
