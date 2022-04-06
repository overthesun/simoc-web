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
        unit: {type: String, required: true},
    },
    data() {
        return {
            prevStep: 0,
        }
    },

    computed: {
        ...mapGetters('dashboard', ['getCurrentStepBuffer']),
        ...mapGetters('livedata', ['getSensorInfo', 'getReadings', 'getDataBundles']),
    },

    watch: {
        // update the chart datasets and labels
        // when the current step buffer changes
        getCurrentStepBuffer() {
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
        initChart() {
            if (this.chart) {
                this.chart.destroy()
            }
            const canvas = document.getElementById(this.id)
            this.chart = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: Array(10).fill(''),
                    datasets: [
                        {
                            lineTension: 0,
                            data: Array(10),
                            label: 'SCD-30',
                            borderColor: '#ff7729',
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
                            yAxisID: 'ppm',
                        }],
                        xAxes: [{
                            ticks: {
                                beginAtZero: true,
                            },
                            xAxisID: 'n',
                        }],
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {usePointStyle: true},
                    },
                    animation: {
                        animateScale: false,
                        animateRotate: false,
                    },
                    title: {
                        display: false,
                        text: 'CO2 Averages',
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
            let startingStep
            if (currentStep !== this.prevStep+1) {
                startingStep = currentStep - 10
            } else {
                startingStep = currentStep
            }
            for (let step = startingStep; step <= currentStep; step++) {
                data.datasets[0].data.shift()
                data.labels.shift()
                if (step > 0) {
                    data.datasets[0].data.push()
                    data.labels.push(step)
                } else {
                    data.datasets[0].data.push(undefined)
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
