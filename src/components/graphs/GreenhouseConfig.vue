<!-- This chart compares the total and the used space of the greenhouse in the config wizard. -->

<template>
    <canvas :id="id" />
</template>

<script>
import {Chart, BarController, BarElement,
        LinearScale, CategoryScale, Title, Tooltip} from 'chart.js'
import 'chartjs-plugin-annotation'
import {mapState, mapGetters} from 'vuex'
import {storeToRefs} from 'pinia'
import {useWizardStore} from '../../store/modules/WizardStore'

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Title, Tooltip)

export default {
    props: {
        id: {type: String, required: true},
    },
    setup() {
        const wizard = useWizardStore()
        const {configuration} = storeToRefs(wizard)
        return {configuration}
    },
    data() {
        return {
            greenhouseSizes: {
                greenhouse_small: 490,
                greenhouse_medium: 2454,
                greenhouse_large: 5610,
                greenhouse_sam: 272,
                greenhouse_b2: 4000,
            },
            // colors used for the plants in the graphs
            colors: ['#ff0000', '#ee0000', '#dd0000', '#cc0000', '#bb0000', '#aa0000',
                     '#990000', '#880000', '#770000', '#660000', '#550000', '#440000',
                     '#330000', '#220000', '#110000'],
        }
    },

    computed: {
        plantSpecies() {
            return this.configuration.plantSpecies
        },
        greenhouseSize() {
            return this.greenhouseSizes[this.configuration.greenhouse.type]
        },
    },

    watch: {
        // update graph when the plants or greenhouse change
        plantSpecies: {
            handler() {
                this.updateChart()
            },
            deep: true,
        },
        greenhouseSize() {
            this.updateChart()
        },
    },


    mounted() {
        // TODO this is mostly duplicated with PowerUsage.vue: remove duplication
        const canvas = document.getElementById(this.id)
        this.chart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: ['Total', 'Used'],
                datasets: [],  // see updateChart for info
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        stacked: true,
                        ticks: {
                            color: '#eeeeee',
                            callback(value, index, values) {
                                return `${value} m³`
                            },
                        },
                        grid: {
                            color: '#666666',
                        },
                    },
                    y: {
                        stacked: true,
                        ticks: {
                            color: '#eeeeee',
                        },
                        grid: {
                            color: '#666666',
                        },
                    },
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Total Greenhouse Space vs Used Space',
                        color: '#eeeeee',
                    },
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        mode: 'point',  // show single value
                    },
                },
            },
        })
        this.updateChart()
    },

    methods: {
        updateChart() {
            // Instead of accepting a dataset for each row (i.e. one for
            // production and one for consumption), ChartJS wants several
            // datasets with a 2-elems [production, consumption] array.
            // Since values in the same dataset share label/color, a
            // workaround is to use e.g. [10, null] for the total size and
            // [null, 10] for the plants: these will show respectively a
            // 10 in the total size row and nothing in the plants row
            // and vice versa.
            this.chart.data.datasets = []

            // add dataset for the total size row
            this.chart.data.datasets.push({
                label: 'Greenhouse size',
                backgroundColor: '#0000ff',
                data: [this.greenhouseSize, null],
            })
            // add datasets for each plant in the used row
            this.plantSpecies.forEach((plant, i) => {
                const dataset = {
                    label: plant.type,
                    backgroundColor: this.colors[i],
                    data: [null, plant.amount],
                }
                this.chart.data.datasets.push(dataset)
            })
            this.chart.update()
        },
    },
}
</script>

<style lang="scss" scoped>
</style>
