<!--
This chart compares the total production and consumption of CO2 in the config wizard.
It was adapted from PowerUsage.vue and mirrors O2Usage.vue
-->

<template>
    <canvas :id="id" />
</template>

<script>
import axios from 'axios'
import {Chart, BarController, BarElement,
        LinearScale, CategoryScale, Title, Tooltip} from 'chart.js'
import 'chartjs-plugin-annotation'
import {storeToRefs} from 'pinia'
import {useWizardStore} from '../../store/modules/WizardStore'

Chart.register(BarController, BarElement,
               LinearScale, CategoryScale, Title, Tooltip)

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
                biomes_consume: [0, null],
                // these only consume
                humans: [null, 0],
                concrete: [null, 0],
                biomes_produce: [null, 0],
            },
            // these two arrays should match the items in this.co2
            labels: ['Plants', 'Biomes', 'Humans', 'Concrete', 'Biomes'],
            colors: ['#ff0000', '#dd0000', '#0000ff', '#dd0000', '#0000bb'],
        }
    },
    computed: {
        plantSpecies() {
            return this.configuration.plantSpecies
        },
        humans() {
            return this.configuration.humans
        },
        biomes() {
            return this.configuration.biomes
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
                this.retrieveCO2('human', this.configuration.humans.amount, response => {
                    const {co2} = response
                    this.co2.humans[0] += co2.output
                    this.co2.humans[1] += co2.input
                    this.updateChart()
                })
            },
            immediate: true,
            deep: true,
        },
        biomes: {
            handler() {
                this.co2.biomes_consume = [0, null]
                this.co2.biomes_produce = [null, 0]
                Object.entries(this.configuration.biomes).forEach(([biome, amount]) => {
                    this.retrieveCO2(`${biome}_biome`, amount, response => {
                        const {co2} = response
                        this.co2.biomes_produce[0] += co2.output
                        this.co2.biomes_consume[1] += co2.input
                        this.updateChart()
                    })
                })
            },
            immediate: true,
            deep: true,
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
            deep: true,
        },
    },

    mounted() {
        // TODO this is mostly duplicated with GreenhouseConfiguration.vue: remove duplication
        const canvas = document.getElementById(this.id)
        this.chart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: ['Prod.', 'Cons.'],
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
                                return `${value} kg`
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
                        text: 'CO2 Production vs Consumption (ideal conditions)',
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
        // TODO request all data as a single json, do math client-side
        retrieveCO2(agent, amount, callback) {
            axios.defaults.withCredentials = true
            const params = {agent_name: agent, quantity: amount ?? 1,
                            location: this.configuration.location}
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
