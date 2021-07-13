<!--
Gauge chart component used within the dashboard.

Props are used to pass in the values for the gauges to use within the 'Gauge' component.
Passing in the getter method was simply added so that the gauges were more generalized
for future implementations beyond atmospheric tracking.
See chart.js documentation for further explantion of below fucntionality.
-->

<template>
    <div style="position:relative">
        <canvas :id="id" />
    </div>
</template>

<script>
import Chart from 'chart.js'
import 'chartjs-plugin-annotation'
import {mapState, mapGetters} from 'vuex'
export default {
    props: {
        id: String,
        color: String,
        maximum: Number,
        label: String,
        getter: Function,
        stepDataKey: String,
    },

    computed: {
        ...mapGetters('dashboard', ['getCurrentStepBuffer']),
    },

    watch: {
        // update the chart datasets and labels when the current step buffer has changed.
        getCurrentStepBuffer: {
            handler() {
                const current = this.getCurrentStepBuffer
                const value = this.getter(current)
                const gauge_value = Math.min(value, this.maximum) // clip at max
                const gauge_remainder = this.maximum - gauge_value

                this.chart.data.labels = [this.label, 'to limit']
                this.chart.data.datasets[0].data.pop()
                this.chart.data.datasets[0].data = [gauge_value, gauge_remainder]
                this.chart.data.datasets[0].backgroundColor = [this.color, '#eeeeee']
                this.chart.options.elements.centerText.text = value.toFixed(4) + '%'
                this.chart.update()
            },
            deep: true,
        },
    },

    mounted() {
        const ctx = document.getElementById(this.id)
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    backgroundColor: this.color,
                    data: [10],
                }],
            },
            rotation: Math.PI * -.5,
            options: {
                elements: {
                    arc: {
                        borderWidth: 0,
                    },
                    centerText: {
                        text: 'Loading...',
                    },
                },
                tooltips: {
                    callbacks: {
                        label(tooltipItems, data) {
                            // show "label: N%" in the tooltip
                            const label = data.labels[tooltipItems.index]
                            const value = data.datasets[0].data[tooltipItems.index]
                            return label + ': ' + (value*100) + '%'
                        },
                    },
                },
                legend: {
                    display: false,
                },
                animation: {
                    animateScale: false,
                    animateRotate: false,
                },
                responsive: true,
                maintainAspectRatio: false,
                drawborder: false,
                cutoutPercentage: 70,
                rotation: Math.PI,
                circumference: 1 * Math.PI,
            },
            plugins: [{
                beforeDraw(chart) {
                    const {width, height, ctx} = chart.chart
                    ctx.restore()

                    // scale the font size based on the width, so that
                    // it doesn't overlap with the gauge, but max 16px
                    const fontSize = Math.min((width/8), 16).toFixed(2)
                    ctx.font = fontSize + 'px sans-serif'
                    ctx.textBaseline = 'alphabetic'

                    const {text} = chart.chart.options.elements.centerText,
                        textX = Math.round((width - ctx.measureText(text).width) / 2),
                        arcH = width/2,  // height of the arc
                        textY = Math.min((height-arcH)/2 + arcH, height)

                    ctx.fillStyle = '#eeeeee'
                    ctx.fillText(text, textX, textY)
                    ctx.save()
                },
            }],
        })
    },

}
</script>

<style lang="scss" scoped>
    canvas{
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>
