<!--
Atmospheric Levels chart component used within the dashboard.

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
        }
    },
    props:{
        id: String,
    },

    computed:{
        ...mapGetters('dashboard', ['getAirStorageRatio', 'getCurrentStepBuffer'])
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
                if (s > 0) {
                    // add the new values
                    let air_storage = this.getAirStorageRatio(s)
                    data.datasets[0].data.push(air_storage['atmo_h2o'] * 100)
                    data.datasets[1].data.push(air_storage['atmo_co2'] * 100)
                    data.datasets[2].data.push(air_storage['atmo_h2'] * 100)
                    data.datasets[3].data.push(air_storage['atmo_ch4'] * 100)
                    data.datasets[4].data.push(air_storage['atmo_o2'] * 100)
                    data.datasets[5].data.push(air_storage['atmo_n2'] * 100)
                    data.labels.push(s)
                }
                else {
                    // if the step is <= 0 there are no data to add, but none/undefined
                    // are plotted, so just increase the length to keep it equal to 24
                    // without adding a plottable value (it creates an empty slot)
                    for (let k = 0; k < 6; k++) {
                        data.datasets[k].data.length++
                    }
                    data.labels.length++
                }
            }
            this.chart.update()
            this.prevStep = currentStep
        }
    },

    mounted(){
        const ctx = document.getElementById(this.id)
        this.chart = new Chart(ctx, {
            type: 'line',
            data:{
                labels: Array(24),
                // create 6 dataset with different labels/colors
                datasets: [
                    ['h2o', '#46f0f0'],
                    ['co2', '#e6194b'],
                    ['h2', '#ffe119'],
                    ['ch4', '#f58231'],
                    ['o2', '#3cb44b'],
                    ['n2', '#4363d8'],
                ].map(([label, color]) => ({
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
                    text: 'Atmospheric Levels',
                },
            }
        })
        this.updateChart()
    }
}
</script>

<style lang="scss">
</style>
