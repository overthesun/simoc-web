<!--
This chart compares the total production and consumption of O2 in the config wizard.
It was adapted from PowerUsage.vue and mirrors CO2Usage.vue
-->
<template>
    <canvas :id="id" style="height: 100%" />
</template>

<script>
import axios from 'axios'
import {Chart, BarController, BarElement,
        LinearScale, CategoryScale, Title, Tooltip} from 'chart.js'
import 'chartjs-plugin-annotation'
import {mapState, mapGetters} from 'vuex'
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
            o2: {
                // agent: [production, consumption],
                // these only produce
                plantSpecies: [0, null],
                biomes_produce: [0, null],
                // these only consume
                humans: [null, 0],
                biomes_consume: [null, 0],
            },
            // these two arrays should match the items in this.o2
            labels: ['Plants', 'Biomes', 'Humans', 'Biomes'],
            colors: ['#0000ff', '#0000dd', '#ff0000', '#dd0000'],
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
    },
    watch: {
        plantSpecies: {
            handler() {
                this.o2.plantSpecies = [0, 0]
                this.plantSpecies.forEach(element => {
                    // TODO: double check the plantSpecies values in the presets
                    if (element.type !== null && element.amount > 0) {
                        this.retrieveO2(element.type, element.amount, response => {
                            const {o2} = response
                            this.o2.plantSpecies[0] += o2.output
                            this.o2.plantSpecies[1] += o2.input
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
                this.o2.humans = [0, 0]
                this.retrieveO2('human_agent', this.configuration.humans.amount, response => {
                    const {o2} = response
                    this.o2.humans[0] += o2.output
                    this.o2.humans[1] += o2.input
                    this.updateChart()
                })
            },
            immediate: true,
            deep: true,
        },
        biomes: {
            handler() {
                this.o2.biomes = [0, 0]
                Object.entries(this.configuration.biomes).forEach(([biome, amount]) => {
                    this.retrieveO2(`${biome}_biome`, amount, response => {
                        const {o2} = response
                        this.o2.biomes_produce[0] += o2.output
                        this.o2.biomes_consume[1] += o2.input
                        this.updateChart()
                    })
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
                        text: 'O2 Production vs Consumption (ideal conditions)',
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
        retrieveO2(agent, amount, callback) {
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
            Object.keys(this.o2).forEach((key, i) => {
                const dataset = {
                    label: this.labels[i],
                    backgroundColor: this.colors[i],
                    data: this.o2[key],
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
