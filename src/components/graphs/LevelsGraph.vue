<!--
Storage Levels chart component used within the dashboard.

Updates values from the approriate step data getters when the getCurrentStepBuffer value changes.

See chart.js documentation for further details on the related mounted functions.
-->

<template>
    <canvas :id="id" />
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
export default {
    data() {
        return {
          prevStep: 0,
          setsinfo: {
            air_storage: {
                labels_colors: [['h2o', '#46f0f0'], ['co2', '#e6194b'], ['h2', '#ffe119'],
                                ['ch4', '#f58231'], ['o2', '#3cb44b'], ['n2', '#4363d8']],
                order: {atmo_h2o: 0, atmo_co2: 1, atmo_h2: 2, atmo_ch4: 3, atmo_o2: 4, atmo_n2: 5}
            },
          },
        }
    },
    props:{
        id: String,
        storage_name: undefined,
    },

    computed:{
        ...mapGetters('dashboard', ['getStorageCapacities', 'getCurrentStepBuffer'])
    },

    watch:{
        // update the chart datasets and labels
        // when the current step buffer changes
        getCurrentStepBuffer: function() {
            this.updateChart()
        },
    },

    methods:{
        updateChart: function() {
            const currentStep = this.getCurrentStepBuffer
            const data = this.chart.data
            // if the currentStep is not prevStep+1, the user moved the scrubber
            // and we need to redraw the previous 24 steps, otherwise we add one step
            let s = (currentStep == this.prevStep+1) ? currentStep : currentStep-23
            for (; s <= currentStep; s++) {
                // remove the oldest values and labels
                for (let k = 0; k < 6; k++) {
                    data.datasets[k].data.shift()
                }
                data.labels.shift()
                // add the new values
                if (s > 0) {
                    let storage = this.getStorageCapacities(s)[this.storage_name][1]
                    let tot_storage = Object.values(storage).reduce(
                        (acc, elem) => acc + elem['value'], 0  // start from 0
                    )
                    Object.entries(storage).map(
                        ([key, elem]) => {
                            // find dataset index, calc ratio, and add the ratio to the dataset
                            let index = this.setsinfo[this.storage_name].order[key]
                            data.datasets[index].data.push(elem['value'] * 100 / tot_storage)
                        }
                    )
                    data.labels.push(s)
                }
                else {
                    // for steps <= 0 use undefined as values and '' as labels
                    // so that the plot still has 24 total items and is not stretched
                    for (let k = 0; k < 6; k++) {
                        data.datasets[k].data.push(undefined)
                    }
                    data.labels.push('')
                }
            }
            this.chart.update()
            this.prevStep = currentStep
        }
    },

    mounted() {
        const ctx = document.getElementById(this.id)
        // create and initialize chart
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(24),
                // create N datasets with different labels/colors
                datasets: this.setsinfo[this.storage_name].labels_colors.map(([label, color]) => ({
                    lineTension: 0,
                    data: Array(24),
                    label: label,
                    backgroundColor: color,
                    fill: true,
                })),
            },
            options:{
                responsive: true,
                maintainAspectRatio: false,
                defaultFontColor: '#1e1e1e',
                scales:{
                    yAxes:[{
                        stacked: true,
                        ticks:{
                            beginAtZero: true,
                            // by default the values go up to 120% instead
                            // of stopping at 100%, but with max: 100 it's
                            // always stuck at 100% and it doesn't scale
                            // when only small values are displayed
                            callback: function(value, index, values) {
                                return value + '%'
                            }
                        }
                    }],
                },
                legend:{
                    display: true,
                    position: 'bottom',
                },
                elements: {
                    point:{
                        // make the dots small, but with a big
                        // hit ratio so it's easy to hover them
                        radius: 1,
                        hitRadius: 5,
                        hoverRadius: 2,
                    }
                },
                title:{
                    display: false,
                },
            }
        })
        this.updateChart()
    }
}
</script>

<style lang="scss">
</style>
