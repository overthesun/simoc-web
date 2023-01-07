<!--
This chart compares the total production and consumption of CO2 in the config wizard.
It was adapted from PowerUsage.vue and mirrors O2Usage.vue
-->

<template>
    <canvas :id="id"  style="height: 100%"/>
</template>

<script>
import axios from 'axios'
import Chart from 'chart.js'
import 'chartjs-plugin-annotation'
import {mapState, mapGetters} from 'vuex'
import {storeToRefs} from 'pinia'
import {useWizardStore} from '../../store/modules/WizardStore'

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
            co2: {
                // agent: [production, consumption],
                // these only produce
                plantSpecies: [0, null],
                // these only consume
                humans: [null, 0],
                soil: [null, 0],
                concrete: [null, 0],
            },
            // these two arrays should match the items in cthis.co2
            labels: ['Plants', 'Humans', 'Soil', 'Concrete'],
            colors: ['#ff0000', '#0000ff', '#0000ee', '#ee0000'],
        }
    },
    computed: {
        plantSpecies() {
            return this.configuration.plantSpecies
        },
        humans() {
            return this.configuration.humans
        },
        soil() {
            return this.configuration.soil
        },
        concrete() {
            return this.configuration.concrete
        },
    },
    watch: {
        plantSpecies: {
            handler() {
                this.co2.plantSpecies = [0, 0]
                this.plantSpecies.forEach(element => {
                    // TODO: double check the plantSpecies values in the presets
                    if (element.type !== null && element.amount > 0) {
                        this.retrieveCO2(element.type, element.amount, response => {
                            const {co2} = response
                            this.co2.plantSpecies[0] += co2.output
                            this.co2.plantSpecies[1] += co2.input
                            this.updateChart()
                        })
                    }
                })
            },
            immediate: true,
            deep: true,
        },
        humans: {
            handler() {
                this.co2.humans = [0, 0]
                this.retrieveCO2('human_agent', this.configuration.humans.amount, response => {
                    const {co2} = response
                    this.co2.humans[0] += co2.output
                    this.co2.humans[1] += co2.input
                    this.updateChart()
                })
            },
            immediate: true,
            deep: true
        },
        soil: {
            handler() {
                this.co2.soil = [0, 0]
                this.retrieveCO2('soil', this.configuration.soil.amount, response => {
                    const {co2} = response
                    this.co2.soil[0] += co2.output
                    this.co2.soil[1] += co2.input
                    this.updateChart()
                })
            },
            immediate: true,
            deep: true
        },
        concrete: {
            handler() {
                this.co2.concrete = [0, 0]
                this.retrieveCO2('concrete', this.configuration.concrete.amount, response => {
                    const {co2} = response
                    this.co2.concrete[0] += co2.output
                    this.co2.concrete[1] += co2.input
                    this.updateChart()
                })
            },
            immediate: true,
            deep: true
        },
    },

    mounted() {
        // TODO this is mostly duplicated with GreenhouseConfiguration.vue: remove duplication
        const canvas = document.getElementById(this.id)
        this.chart = new Chart(canvas, {
            type: 'horizontalBar',
            data: {
                labels: ['Prod.', 'Cons.'],
                datasets: [],  // see updateChart for info
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: 'CO2 Production vs Consumption (ideal conditions)',
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
                                return `${value} kg`
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

    methods: {
        // TODO request all data as a single json, do math client-side
        retrieveCO2(agent, amount, callback) {
            axios.defaults.withCredentials = true
            const params = {agent_name: agent, quantity: amount ?? 1}
            return axios.get('/get_o2_co2', {params})
                .then(response => {
                    if (response.status === 200) {
                        callback(response.data)
                    }
                }).catch(error => {
                    console.log(error)
                })
        },
        updateChart() {
            // Instead of accepting a dataset for each row (i.e. one for
            // production and one for consumption), ChartJS wants several
            // datasets with a 2-elems [production, consumption] array.
            // Since values in the same dataset share label/color, a
            // workaround is to use e.g. [10, null] for production and
            // [null, 10] for consumption: these will show respectively a
            // 10 in the production row and nothing in the consumption row
            // and vice versa.
            this.chart.data.datasets = []
            Object.keys(this.co2).forEach((key, i) => {
                const dataset = {
                    label: this.labels[i],
                    backgroundColor: this.colors[i],
                    data: this.co2[key],
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
