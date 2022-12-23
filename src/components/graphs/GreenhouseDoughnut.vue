<!--
Greenhouse Doughnut Graph

Updates and uses the values from the greenhouse and the plant species
within the wizard store to populate the graph values.
Currently has enough color values for up to 30 plants.

See chart.js documentation for more details.
-->

<template>
    <canvas :id="id" />
</template>

<script>
import {Chart, DoughnutController, ArcElement, Legend, Tooltip} from 'chart.js'
import 'chartjs-plugin-annotation'
import {mapState, mapGetters} from 'vuex'
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useWizardStore} from '../../store/modules/WizardStore'
import {StringFormatter} from '../../javascript/utils'

Chart.register(DoughnutController, ArcElement, Legend, Tooltip)

export default {
    props: {
        id: {type: String, required: true},
    },
    setup() {
        const dashboard = useDashboardStore()
        const wizard = useWizardStore()
        const {currentStepBuffer} = storeToRefs(dashboard)
        const {configuration} = storeToRefs(wizard)
        return {currentStepBuffer, configuration}
    },
    data() {
        return {
            // Greenhouse volumes. These should be retrieved from the backend in the future.
            greenhouseSize: {
                none: 0,
                greenhouse_small: 490,
                greenhouse_medium: 2454,
                greenhouse_large: 5610,
                greenhouse_sam: 494,
            },

            // Enough colors to cover all the plant types.
            // Used to specify the color for each section of the pie chart.
            backgroundColor: [
                '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0',
                '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8',
                '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff',
                '#000000',
            ],
        }
    },
    computed: {

        /*
        No longer used

        graphData:function(){
            let {greenhouse,plantSpecies} = this.getConfiguration
            let amounts = []
            let types = []

            let totalUsed = 0

            plantSpecies.forEach((item) =>{
                amounts.push(item.amount)
                types.push(new StringFormatter(item.type))
                totalUsed += parseInt(item.amount, 10)
            })

            amounts.push()

            let data = {
                amounts:amounts,
                types:types
            }

            return data
        }*/
    },
    watch: {
        // Watches for changes in currentStepBuffer within the
        // dashboard store to update the graph in the dashboard
        currentStepBuffer() {
            this.updateChart()
        },

        // Watches for changes within the configuration object within
        // the wizard store to update the graph in the config wizard
        configuration: {
            handler() {
                this.updateChart()
            },
            deep: true,
        },
    },
    mounted() {
        const canvas = document.getElementById(this.id)
        this.chart = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: ['Free Space'],
                datasets: [{
                    backgroundColor: this.backgroundColor,
                    data: [0],
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                color: '#eeeeee',
                elements: {
                    arc: {
                        borderWidth: 0,
                    },
                    centerText: {
                        text: '',
                    },
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            boxWidth: 20,
                        },
                    },
                },
            },
            plugins: [{
                beforeDraw(chart) {
                    const {width, height, ctx} = chart
                    ctx.restore()

                    const fontSize = Math.min((width/8), 16).toFixed(2)
                    ctx.font = `${fontSize}px sans-serif`
                    ctx.textBaseline = 'alphabetic'

                    const {text} = chart.options.elements.centerText
                    const textX = Math.round((width - ctx.measureText(text).width) / 2)
                    const textY = Math.round((height / 2) - fontSize)

                    ctx.fillStyle = '#eeeeee'
                    ctx.fillText(text, textX, textY)
                    ctx.save()
                },
            }],
        })
        this.updateChart()  // this will set the center text and other things
    },

    methods: {
        // Format the plant data to be used within the chart object.

        greenhouseConfiguration() {
            // get the plants and greenhouse from the configuration
            const {greenhouse, plantSpecies} = this.configuration
            // Set the first value of the dataset to the size of the greenhouse
            // and add the label free space
            const values = {data: [this.greenhouseSize[greenhouse.type]], labels: ['Free Space']}
            plantSpecies.forEach(item => {
                // Calculates the total free space left after all the plants are added,
                // modifies the first index initialized above.
                values.data[0] = Math.max(0, values.data[0] - item.amount)
                values.data.push(item.amount) // Push in the amount of the plant that is present.
                values.labels.push(StringFormatter(item.type)) // format the plant name for display
            })

            return values
        },
        updateChart() {
            const {greenhouse} = this.configuration
            const {data, labels} = this.greenhouseConfiguration()
            this.chart.data.labels = labels  // labels are always visible
            let text
            if (greenhouse.type === 'none') {
                // only show the text if the greenhouse type is none
                this.chart.data.datasets[0].data = []
                text = 'No Greenhouse Type Selected'
            } else {
                // otherwise show both the doughnut and the text
                this.chart.data.datasets[0].data.pop()
                this.chart.data.datasets[0].data = data
                text = `${data[0]} m³ / ${this.greenhouseSize[greenhouse.type]} m³`
            }
            this.chart.options.elements.centerText.text = text
            this.chart.update()
        },
    },
    update() {

    },
}

</script>

<style lang="scss" scoped>

    .doughnut-wrapper{
        position:relative;
        display:grid;
        grid-template-rows: minmax(0px,1fr) 32px;
        grid-row-gap: 16px;
    }
</style>
