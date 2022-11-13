<!--
Energy versus chart component used within the dashboard.

Updates values from the approriate step data getters when the currentStepBuffer value changes.

See chart.js documentation for further details on the related mounted functions.
-->

<template>
    <canvas :id="id" />
</template>

<script>
import Chart from 'chart.js'
import {storeToRefs} from 'pinia'

import {useDashboardStore} from '../../store/modules/DashboardStore'

export default {
    props: {
        id: {type: String, required: true},
        plottedValue: {type: String, required: true},
        unit: {type: String, required: true},
    },
    setup() {
        const dashboard = useDashboardStore()
        const {
            isTimerRunning, currentStepBuffer, maxStepBuffer,
        } = storeToRefs(dashboard)
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
            this.updateChart()
        },
        // re-init the chart when we plot something else
        plottedValue() {
            this.initChart()
        },
    },

    mounted() {
        this.initChart()
    },

    methods: {
        // TODO: this code is very similar to LevelsGraph.vue
        initChart() {
            console.log(`Initializing ${this.plottedValue}`)
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
                    labels: Array(24).fill(''),
                    datasets: [
                        {
                            lineTension: 0,
                            data: Array(24),
                            label: 'Produced',
                            borderColor: 'rgba(0,0,255,1)',
                            fill: false,
                            pointStyle: 'line',
                        },
                        {
                            lineTension: 0,
                            data: Array(24),
                            label: 'Consumed',
                            borderColor: '#cd0000',
                            fill: false,
                            pointStyle: 'line',
                        },
                    ],
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                callback: (value, index, values) => {
                                    const val = value > 0 ? value : value.toPrecision(2)
                                    return `${val} ${this.unit}`
                                },
                            },
                        }],
                        xAxes: [{
                            ticks: {
                                beginAtZero: true,
                            },
                        }],
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        // https://stackoverflow.com/a/50450646
                        labels: {usePointStyle: true},
                    },
                    animation: {
                        animateScale: false,
                        animateRotate: false,
                    },
                    title: {
                        display: false,
                        text: '(Energy) Consumption Vs Production',
                    },

                    defaultFontColor: '#1e1e1e',
                    responsive: true,
                    maintainAspectRatio: false,
                    drawborder: false,
                    cutoutPercentage: 70,
                    rotation: Math.PI,
                    circumference: 1 * Math.PI,
                },
            })
            this.updateChart()
        },
        updateChart() {
            const currentStep = this.currentStepBuffer
            const {data} = this.chart
            // if the currentStep is not prevStep+1 (e.g. when the user moved the scrubber)
            // we need to redraw the previous 24 steps, otherwise we just add one step
            let startingStep
            if (currentStep !== this.prevStep+1) {
                startingStep = currentStep - 23  // replace all 24 values
            } else {
                startingStep = currentStep  // add the latest value
            }
            // this will do 1 or 24 iterations (maybe refactor it to something better)
            for (let step = startingStep; step <= currentStep; step++) {
                // remove the oldest values
                data.datasets[0].data.shift()
                data.datasets[1].data.shift()
                data.labels.shift()
                if (step > 0) {
                    const productionPath = ['SUM', 'flows', 'out', this.plottedValue, 'SUM', step]
                    const consumptionPath = ['SUM', 'flows', 'in', this.plottedValue, 'SUM', step]
                    const production = this.getData(productionPath)
                    const consumption = this.getData(consumptionPath)
                    // add the new values
                    data.datasets[0].data.push(production)
                    data.datasets[1].data.push(consumption)
                    data.labels.push(step)
                } else {
                    // for steps <= 0 use undefined as values and '' as labels
                    // so that the plot still has 24 total items and is not stretched
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
