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
import {make_labels} from '../../javascript/utils'
import {useDashboardStore} from '../../store/modules/DashboardStore'

Chart.register(LineController, LineElement, PointElement,
               LinearScale, CategoryScale, Tooltip, Legend, Filler)

export default {
    props: {
        id: {type: String, required: true},
        plottedStorage: {type: String, required: true},
        plottedItems: {type: String, default: undefined},
        storagesMapping: {type: Object, required: true},  // TODO: Revert ABM Workaround
        fullscreen: {type: Boolean, default: false},
        nsteps: {type: Number, required: true},
    },
    emits: ['plotted-items-changed'],
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
            storage_type: String,  // TODO: Revert ABM Workaround
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
        // re-init the chart when we plot something else
        plottedItems() {
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
            this.storage_name = this.plottedStorage
            this.storage_type = this.storagesMapping[this.storage_name]
            if (this.plottedItems !== undefined && this.plottedItems.length) {
                this.plotted_items = this.plottedItems.split('|')
            } else {
                this.plotted_items = undefined  // no list of items to plot -- plot'em all
            }
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
                            hidden: (this.plotted_items !== undefined &&
                                     !this.plotted_items.includes(label)),
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
                            onClick: (event, legendItem, legend) => {
                                legend.chart.setDatasetVisibility(
                                    legendItem.datasetIndex,
                                    !legend.chart.isDatasetVisible(legendItem.datasetIndex)
                                )
                                legend.chart.update()
                                const plotted_items = legend.legendItems
                                        .filter(item => !item.hidden)
                                        .map(item => item.text).join('|')
                                this.$emit('plotted-items-changed', plotted_items)
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
        calc_perc(amount, total) {
            return (amount * 100 / total).toFixed(4)
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
            // this is an object with the elements names as keys,
            // and either a number (for single steps) or an array of numbers (for ranges)
            const storage = this.getData([this.storage_name, 'storage', '*', range])
            // this is either a number (for single steps) or an array of numbers (for ranges)
            const tot_storage = this.getData([this.storage_name, 'storage', 'SUM', range])
            if (typeof tot_storage === 'object') {
                // replace current range with the new range (in place)
                Object.entries(storage).forEach(
                    ([elem, amounts]) => {
                        // find dataset index, calc ratios, and add the ratios to the dataset
                        const index = this.setsinfo[this.storage_type].order[elem]
                        const ratios = amounts.map((amt, i) => this.calc_perc(amt, tot_storage[i]))
                        data.datasets[index].data.splice(0, ratios.length, ...ratios)
                    }
                )
                const labels = make_labels(startingStep, endingStep, this.nsteps)
                data.labels.splice(0, labels.length, ...labels)
                this.chart.update('none')
            } else {
                // shift and add a single value at the end
                Object.entries(storage).forEach(
                    ([elem, amount]) => {
                        // find dataset index, calc ratio, and add the ratio to the dataset
                        const index = this.setsinfo[this.storage_type].order[elem]
                        const ratio = this.calc_perc(amount, tot_storage)
                        data.datasets[index].data.shift()
                        data.datasets[index].data.push(ratio)
                    }
                )
                data.labels.shift()
                data.labels.push(currentStep)
                this.chart.update()
            }
            this.chart.update()
            this.prevStep = currentStep
        },
    },
}
</script>

<style lang="scss">
</style>
