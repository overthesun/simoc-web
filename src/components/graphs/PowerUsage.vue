<!-- This chart compares the total production and consumption of energy in the configuration wizard. -->

<template>
    <canvas :id="id" />
</template>

<script>
import axios from 'axios'
import Chart from 'chart.js';
import "chartjs-plugin-annotation";
import {mapState, mapGetters} from 'vuex'
export default {
    props: {
        id: String,
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
            labels: ['Solar array', /* 'Batteries',*/ 'Plants', 'ECLSS', 'Crew quarters', 'Greenhouse'],
            colors: ['#0000ff', /* '#0000ee',*/ '#ff0000', '#ee0000', '#dd0000', '#cc0000'],
        }
    },

    computed: {
        ...mapGetters('wizard', ['getConfiguration']),

        crewQuarters: function() {
            return this.getConfiguration.crewQuarters
        },
        eclss: function() {
            return this.getConfiguration.eclss
        },
        powerGenerator: function() {
            return this.getConfiguration.powerGeneration
        },
        powerStorage: function() {
            return this.getConfiguration.powerStorage
        },
        greenhouse: function() {
            return this.getConfiguration.greenhouse
        },
        plantSpecies: function() {
            return this.getConfiguration.plantSpecies
        }
    },

    watch: {
        plantSpecies: {
            handler: function() {
                this.energy.plantSpecies[1] = 0
                this.plantSpecies.forEach((element) => {
                    if (element.type != null && element.amount > 0) {
                        this.retrievePower(element.type, element.amount, (response) => {
                            let {energy_input} = response
                            this.energy.plantSpecies[1] += energy_input
                            this.updateChart()
                        })
                    }
                })
            },
            immediate: true,
            deep: true
        },

        eclss: {
            handler: function() {
                this.retrievePower(this.eclss.type, this.eclss.amount, (response) => {
                    let {energy_input} = response
                    this.energy.eclss[1] = energy_input
                    this.updateChart()
                })
            },
            immediate: true,
            deep: true
        },
        crewQuarters: {
            handler: function() {
                this.retrievePower(this.crewQuarters.type, 1, (response) => {
                    let {energy_input} = response
                    this.energy.crewQuarters[1] = energy_input
                    this.updateChart()
                })

            },
            immediate: true,
            deep: true
        },
        greenhouse: {
            handler: function() {
                this.retrievePower(this.greenhouse.type, 1, (response) => {
                    let {energy_input} = response
                    this.energy.greenhouse[1] = energy_input
                    this.updateChart()
                })
            },
            immediate: true,
            deep: true
        },
        powerGenerator: {
            handler: function() {
                this.retrievePower(this.powerGenerator.type, this.powerGenerator.amount, (response) => {
                    let {energy_output} = response
                    this.energy.powerGenerator[0] = energy_output
                    this.updateChart()
                })
            },
            immediate: true,
            deep: true
        },
        powerStorage: {
            handler: function() {
                this.retrievePower(this.powerStorage.type, this.powerStorage.amount, (response) => {
                    let {energy_capacity} = response
                    // TODO: handle batteries
                    // this.energy.powerStorage = energy_capacity
                    // this.updateChart()
                })
            },
            immediate: true,
            deep: true
        },
    },

    methods: {
        // TODO request all data as a single json, do math client-side
        retrievePower: function(agent, amount=1, callback) {
            axios.defaults.withCredentials = true
            const params = {agent_name: agent, quantity: amount}
            return axios.get('/get_energy', {params: params})
                    .then(response => {
                        if (response.status === 200) {
                            callback(response.data)
                        }
                    }).catch(error => {
                        console.log(error)
                    })
        },
        updateChart: function() {
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
                let dataset = {
                    label: this.labels[i],
                    backgroundColor: this.colors[i],
                    data: this.energy[key]
                }
                this.chart.data.datasets.push(dataset)
            })
            this.chart.update()
        },
    },

    mounted() {
        // TODO this is mostly duplicated with GreenhouseConfiguration.vue: remove duplication
        const ctx = document.getElementById(this.id)
        this.chart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: ['Prod.', 'Cons.'],
                datasets: [],  // see updateChart for info
            },
            options: {
                responsive: false,
                maintainAspectRatio: true,
                title: {
                    display: true,
                    text: 'Total Energy Production vs Consumption',
                    fontColor: "#eeeeee",
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
                            fontColor: "#eeeeee",
                            callback: function(value, index, values) {
                                return value + ' kWh'
                            }
                        },
                        gridLines: {
                            color: "#666666"
                        },
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            fontColor: "#eeeeee",
                        },
                        gridLines: {
                            color: "#666666"
                        },
                    }],
                }
            },
        })
        this.updateChart()
    }
}
</script>

<style lang="scss" scoped>
</style>
