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

const getColorRange = (baseColor, n=1) => {
    // Given a hex color, return a list of shades lighter/darker
    const output = []
    const step = Math.min(0.4, 1.6 / n)
    const start = (1 - (n * step / 2))
    // ref: https://www.sitepoint.com/javascript-generate-lighter-darker-color/
    const hex = String(baseColor).replace(/[^0-9a-f]/gi, '')
    for (let i = 0; i < n; i++) {
        const lum = start + (i * step)
        let rgb = '#'
        for (let j = 0; j < 3; j++) {
            let c = parseInt(hex.substr(j * 2, 2), 16)
            c = Math.round(Math.min(Math.max(0, c * lum), 255)).toString(16)
            rgb += `00${c}`.substr(c.length)
        }
        output.push(rgb)
    }
    return output
}

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
            activeSensors: [],
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
            this.updateChart()
        },
        // re-init the chart when we plot something else
        plottedValue() {
            this.updateActiveSensors()
            this.initChart()
        },
        getSensorInfo() {
            this.updateActiveSensors()
            this.initChart()
            console.log('Updating sensor info')
        },
        unit() {

        },
    },

    mounted() {
        this.updateActiveSensors()
        this.initChart()
    },

    methods: {
        updateActiveSensors() {
            if (this.plottedValue === 'all') {
                this.activeSensors = Object.keys(this.getSensorInfo)
            } else {
                this.activeSensors = [this.plottedValue]
            }
        },
        initChart() {
            if (this.chart) {
                // when switching chart we have to destroy
                // the old one before reusing the same canvas
                this.chart.destroy()
            }
            const canvas = document.getElementById(this.id)
            // TODO: Create list of shades of this.color
            const colors = getColorRange(this.color, this.activeSensors.length)
            const datasets = this.activeSensors.map((sensor_id, i) => ({
                lineTension: 0,
                data: Array(10),
                label: sensor_id,
                borderColor: colors[i],
                fill: false,
                pointStyle: 'line',
            }))
            this.chart = new Chart(canvas, {
                type: 'line',
                data: {
                    // fill with '' so that at the beginning the labels don't show undefined
                    labels: Array(10).fill(''),
                    // TODO: Create total number of datasets equal to total number of CO2 sensors
                    datasets: datasets,
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                callback: (value, index, values) => `${value}${this.unit}`,
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
                data.datasets.forEach(set => set.data.shift())
                data.labels.shift()
                if (step > 0) {
                    this.activeSensors.forEach((sensor_id, i) => {
                        const r = this.getReadings(step)
                        let value
                        if (sensor_id === 'Average') {
                            const values = Object.keys(r).map(key => r[key][this.currency])
                            value = values.reduce((a, b) => a + b, 0) / values.length
                        } else if (Object.keys(r).includes(sensor_id)) {
                            value = r[sensor_id][this.currency]
                        }
                        data.datasets[i].data.push(value)
                    })
                    // add the new values
                    data.labels.push(step)
                } else {
                    // for steps <= 0 use undefined as values and '' as labels
                    // so that the plot still has 10 total items and is not stretched
                    data.datasets.forEach(set => set.data.push(undefined))
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
