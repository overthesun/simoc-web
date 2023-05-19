<!-- This chart compares the total production and consumption of energy in the config wizard. -->

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
            energy: {
                // agent: [production, consumption],
                // these only produce
                powerGenerator: [0, null],
                // powerStorage: [0, null], TODO: handle batteries
                // these only consume
                plantSpecies: [null, 0],
                eclss: [null, 0],
                crewQuarters: [null, 0],
                greenhouse: [null, 0],
            },
            // these two arrays should match the items in this.energy
            labels: ['Solar array', /* 'Batteries', */ 'Plants',
                     'ECLSS', 'Crew quarters', 'Greenhouse'],
            colors: ['#0000ff', /* '#0000ee', */ '#ff0000',
                     '#ee0000', '#dd0000', '#cc0000'],
        }
    },

    computed: {

        crewQuarters() {
            return this.configuration.crewQuarters
        },
        eclss() {
            return this.configuration.eclss
        },
        powerGenerator() {
            return this.configuration.powerGeneration
        },
        powerStorage() {
            return this.configuration.powerStorage
        },
        greenhouse() {
            return this.configuration.greenhouse
        },
        plantSpecies() {
            return this.configuration.plantSpecies
        },
    },

    watch: {
        plantSpecies: {
            handler() {
                this.energy.plantSpecies[1] = 0
                this.plantSpecies.forEach(element => {
                    // TODO: double check the plantSpecies values in the presets
                    if (element.type !== null && element.amount > 0) {
                        this.retrievePower(element.type, element.amount, response => {
                            const {energy_input} = response
                            this.energy.plantSpecies[1] += energy_input
                            this.updateChart()
                        })
                    }
                })
            },
            immediate: true,
            deep: true,
        },

        eclss: {
            handler() {
                this.retrievePower(this.eclss.type, this.eclss.amount, response => {
                    const {energy_input} = response
                    this.energy.eclss[1] = energy_input
                    this.updateChart()
                })
            },
            immediate: true,
            deep: true,
        },
        crewQuarters: {
            handler() {
                this.retrievePower(this.crewQuarters.type, 1, response => {
                    const {energy_input} = response
                    this.energy.crewQuarters[1] = energy_input
                    this.updateChart()
                })
            },
            immediate: true,
            deep: true,
        },
        greenhouse: {
            handler() {
                this.retrievePower(this.greenhouse.type, 1, response => {
                    const {energy_input} = response
                    this.energy.greenhouse[1] = energy_input
                    this.updateChart()
                })
            },
            immediate: true,
            deep: true,
        },
        powerGenerator: {
            handler() {
                this.retrievePower(
                    this.powerGenerator.type,
                    this.powerGenerator.amount,
                    response => {
                        const {energy_output} = response
                        this.energy.powerGenerator[0] = energy_output
                        this.updateChart()
                    }
                )
            },
            immediate: true,
            deep: true,
        },
        powerStorage: {
            handler() {
                this.retrievePower(
                    this.powerStorage.type,
                    this.powerStorage.amount,
                    response => {
                        // const {energy_capacity} = response
                        // TODO: handle batteries
                        // this.energy.powerStorage = energy_capacity
                        // this.updateChart()
                    }
                )
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
                                return `${value} kWh`
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
                        text: 'Total Energy Production vs Consumption',
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
        retrievePower(agent, amount, callback) {
            axios.defaults.withCredentials = true
            const params = {agent_name: agent, quantity: amount ?? 1}
            return axios.get('/get_energy', {params})
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
            Object.keys(this.energy).forEach((key, i) => {
                const dataset = {
                    label: this.labels[i],
                    backgroundColor: this.colors[i],
                    data: this.energy[key],
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
