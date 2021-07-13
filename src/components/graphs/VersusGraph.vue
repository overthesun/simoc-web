<!--
Energy versus chart component used within the dashboard.

Updates values from the approriate step data getters when the getCurrentStepBuffer value changes.

See chart.js documentation for further details on the related mounted functions.
-->

<template>
    <canvas :id="id" />
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
export default {
    data() {
        return {
            prevStep: 0,
        }
    },
    props: {
        id: String,
        plotted_value: String,
        unit: String,
    },

    computed: {
        ...mapGetters('dashboard', ['getIsTimerRunning', 'getCurrentStepBuffer', 'getMaxStepBuffer',
                                    'getTotalProduction', 'getTotalConsumption']),
    },

    watch: {
        // update the chart datasets and labels
        // when the current step buffer changes
        getCurrentStepBuffer: function() {
            this.updateChart()
        },
        // re-init the chart when we plot something else
        plotted_value: function() {
            this.initChart()
        },
    },

    mounted() {
        this.initChart()
    },

    methods: {
        // TODO: this code is very similar to LevelsGraph.vue
        initChart: function() {
            if (this.chart) {
                // when switching chart we have to destroy
                // the old one before reusing the same canvas
                this.chart.destroy()
            }
            const ctx = document.getElementById(this.id)
            this.chart = new Chart(ctx, {
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
                                callback: (value, index, values) => value + ' ' + this.unit,
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
        updateChart: function() {
            const currentStep = this.getCurrentStepBuffer
            const data = this.chart.data
            // if the currentStep is not prevStep+1 (e.g. when the user moved the scrubber)
            // we need to redraw the previous 24 steps, otherwise we just add one step
            let startingStep
            if (currentStep != this.prevStep+1) {
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
                    let production = this.getTotalProduction(step)[this.plotted_value].value
                    let consumption = this.getTotalConsumption(step)[this.plotted_value].value
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
