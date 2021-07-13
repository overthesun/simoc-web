<!-- This chart compares the total and the used space of the greenhouse in the config wizard. -->

<template>
    <canvas :id="id" />
</template>

<script>
import Chart from 'chart.js'
import 'chartjs-plugin-annotation'
import {mapState, mapGetters} from 'vuex'
export default {
    props: {
        id: String,
    },

    data() {
        return {
            greenhouseSizes: {
                greenhouse_small: 490,
                greenhouse_medium: 2454,
                greenhouse_large: 5610,
            },
            // colors used for the plants in the graphs
            colors: ['#ff0000', '#ee0000', '#dd0000', '#cc0000', '#bb0000', '#aa0000',
                     '#990000', '#880000', '#770000', '#660000', '#550000', '#440000',
                     '#330000', '#220000', '#110000'],
        }
    },

    computed: {
        ...mapGetters('wizard', ['getConfiguration']),

        plantSpecies() {
            return this.getConfiguration.plantSpecies
        },
        greenhouseSize() {
            return this.greenhouseSizes[this.getConfiguration.greenhouse.type]
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


    mounted() {
        // TODO this is mostly duplicated with PowerUsage.vue: remove duplication
        const canvas = document.getElementById(this.id)
        this.chart = new Chart(canvas, {
            type: 'horizontalBar',
            data: {
                labels: ['Total', 'Used'],
                datasets: [],  // see updateChart for info
            },
            options: {
                responsive: false,
                maintainAspectRatio: true,
                title: {
                    display: true,
                    text: 'Total Greenhouse Space vs Used Space',
                    fontColor: '#eeeeee',
                },
                tooltips: {
                    mode: 'point',  // show single value
                },
                legend: {
                    display: false,
                },
                scales: {
                    xAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero: true,
                            fontColor: '#eeeeee',
                            callback(value, index, values) {
                                return value + ' m³'
                            },
                        },
                        gridLines: {
                            color: '#666666',
                        },
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            fontColor: '#eeeeee',
                        },
                        gridLines: {
                            color: '#666666',
                        },
                    }],
                },
            },
        })
        this.updateChart()
    },
}
</script>

<style lang="scss" scoped>
</style>
