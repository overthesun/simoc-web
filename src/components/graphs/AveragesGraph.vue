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
import Chart from 'chart.js'
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
    props: {
        id: {type: String, required: true},
        plottedValue: {type: String, required: true},
        currency: {type: String, required: true},
        color: {type: String, required: true},
        unit: {type: String, required: true},
    },
    data() {
        return {
            prevStep: 0,
            average: 0,
        }
    },

    computed: {
        ...mapGetters('dashboard', ['getCurrentStepBuffer']),
        ...mapGetters('livedata', ['getSensorInfo', 'getReadings', 'getDataBundles']),
    },

    watch: {
        // calculate the average for the panel currency then update the chart datasets
        // and labels when the current step buffer changes
        getCurrentStepBuffer() {
            this.calculateAverage()
            this.updateChart()
        },
        // re-init the chart when we plot something else
        plottedValue() {
            this.initChart()
        },
        unit() {

        },
    },

    mounted() {
        this.initChart()
    },

    methods: {
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
                    labels: Array(10).fill(''),
                    // TODO: Create total number of datasets equal to total number of CO2 sensors
                    datasets: [
                        {
                            lineTension: 0,
                            data: Array(10),
                            label: 'Average',
                            borderColor: this.color,
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
                                callback: (value, index, values) => `${value}`,
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
                        text: '(Average) Atmospheric CO2',
                    },

                    defaultFontColor: '#1e1e1e',
                    responsive: true,
                    maintainAspectRatio: false,
                    drawborder: false,
                    cutoutPercentage: 70,
                    rotation: Math.PI,
                    circumference: Math.PI,
                },
            })
            this.updateChart()
        },
        updateChart() {
            const currentStep = this.getCurrentStepBuffer
            const {data} = this.chart
            // if the currentStep is not prevStep + 1 (e.g. when the user moved the scrubber)
            // we need to redraw the previous 10 steps, otherwise we just add one step
            let startingStep
            if (currentStep !== this.prevStep + 1) {
                startingStep = currentStep - 10  // replace all 10 values
            } else {
                startingStep = currentStep  // add the latest value
            }
            // this will do 1 or 10 iterations (maybe refactor it to something better)
            for (let step = startingStep; step <= currentStep; step++) {
                // remove the oldest values
                data.datasets[0].data.shift()
                data.labels.shift()
                if (step > 0) {
                    // add the new values
                    data.datasets[0].data.push(this.average)
                    data.labels.push(step)
                } else {
                    // for steps <= 0 use undefined as values and '' as labels
                    // so that the plot still has 10 total items and is not stretched
                    data.datasets[0].data.push(undefined)
                    data.labels.push('')
                }
            }
            this.chart.update()
            this.prevStep = currentStep
        },
        calculateAverage() {
            const r = this.getReadings(this.getCurrentStepBuffer)

            let average = 0
            let numActiveSensors = 0
            Object.entries(this.getSensorInfo).forEach(([key, value]) => {
                if (r[key]) {
                    numActiveSensors += 1
                    average += r[key][this.currency]
                }
            })

            this.average = average / numActiveSensors
        },
    },
}
</script>


<style lang="scss" scoped>

</style>
