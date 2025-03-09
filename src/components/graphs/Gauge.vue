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
import {Chart, DoughnutController, ArcElement, Title, Tooltip} from 'chart.js'
import 'chartjs-plugin-annotation'
import {useDashboardStore} from '../../store/modules/DashboardStore'

Chart.register(DoughnutController, ArcElement, Title, Tooltip)


export default {
    props: {
        id: {type: String, required: true},
        color: {type: String, required: true},
        maximum: {type: Number, required: true},
        label: {type: String, required: true},
        getter: {type: Function, required: true},
    },
    setup() {
        const {currentStepBuffer} = useDashboardStore()
        return {currentStepBuffer}
    },
    watch: {
        // update the chart datasets and labels when the current step buffer has changed.
        currentStepBuffer: {
            handler() {
                const current = this.currentStepBuffer
                const value = this.getter(current)
                const gauge_value = Math.min(value, this.maximum) // clip at max
                const gauge_remainder = this.maximum - gauge_value

                this.chart.data.labels = [this.label, 'to limit']
                this.chart.data.datasets[0].data.pop()
                this.chart.data.datasets[0].data = [gauge_value, gauge_remainder]
                this.chart.data.datasets[0].backgroundColor = [this.color, '#eeeeee']
                this.chart.options.elements.centerText.text = `${value.toFixed(4)}%`
                this.chart.update('active')
            },
            deep: true,
        },
    },

    mounted() {
        const canvas = document.getElementById(this.id)
        this.chart = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    backgroundColor: this.color,
                    data: [10],
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                rotation: -90,
                circumference: 180,
                cutout: '70%',
                elements: {
                    arc: {
                        borderWidth: 0,
                    },
                    centerText: {
                        text: 'Loading...',
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label(context) {
                                // show "label: N%" in the tooltip
                                return `${context.label}: ${context.formattedValue}%`
                            },
                        },
                    },
                },
            },
            plugins: [{
                beforeDraw(chart, args, options) {
                    const {width, height, ctx} = chart
                    ctx.restore()

                    // scale the font size based on the width, so that
                    // it doesn't overlap with the gauge, but max 16px
                    const fontSize = Math.min((width/8), 16).toFixed(2)
                    ctx.font = `${fontSize}px sans-serif`
                    ctx.textBaseline = 'alphabetic'

                    const {text} = chart.options.elements.centerText
                    const textX = Math.round((width - ctx.measureText(text).width) / 2)
                    const arcH = width / 2  // height of the arc
                    const textY = Math.min(((height-arcH)/2) + arcH, height)

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
