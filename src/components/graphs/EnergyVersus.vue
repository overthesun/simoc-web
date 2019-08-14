<!--
Energy versus chart component used within the dashboard.

Updates values from the approriate step data getters when the getCurrentStepBuffer value changes.

See chart.js documentation for further details on the related mounted functions.
-->

<template>
    <canvas :id="id" style="height: 100%; width: 100%;" height='auto' width='auto'/>
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
export default {
    props:{
        id:String,
    },

    computed:{
        ...mapGetters('dashboard',['getCurrentStepBuffer','getMaxStepBuffer','getTotalProduction','getTotalConsumption'])
    },

    watch:{
        //Update the chart datasets and labels when the current step buffer has changed.
        getCurrentStepBuffer: function() {
            this.updateChart()
        },
    },

    methods:{
        updateChart: function() {
            // TODO when the user selects an arbitrary step, it will be added
            // after the others; ideally the previous 23 steps should be
            // retrieved and displayed instead
            const step = this.getCurrentStepBuffer
            const data = this.chart.data
            let {enrg_kwh:consumption} = this.getTotalConsumption(step)
            let {enrg_kwh:production} = this.getTotalProduction(step)
            // remove the oldest values
            data.datasets[0].data.shift()
            data.datasets[1].data.shift()
            data.labels.shift()
            // add the new ones
            data.datasets[0].data.push(production.value)
            data.datasets[1].data.push(consumption.value)
            data.labels.push(step)

            this.chart.update()
        }
    },


    mounted(){
        const ctx = document.getElementById(this.id)
        this.chart = new Chart(ctx, {
            type: 'line',
            data:{
                labels: Array(24),
                datasets:[{
                        lineTension: 0,
                        data: Array(24),
                        label: 'Produced',
                        borderColor: "rgba(0,0,255,1)",
                        fill:false
                    },
                    {
                        lineTension: 0,
                        data: Array(24),
                        label: 'Consumed',
                        borderColor: "#cd0000",
                        fill: false
                    }
                ]
            },
            options:{
                scales:{
                    yAxes:[{
                        ticks:{
                            beginAtZero:true,
                            callback:function(value,index,values){
                                return value + ' kWh'
                            }
                        }
                    }],
                    xAxes:[{
                        ticks:{
                            beginAtZero:true,
                        }
                    }]
                },
                legend:{
                    display:false,
                },
                animation:{
                    animateScale: false,
                    animateRotate: false,
                },
                title:{
                    display:false,
                    text:'(Energy) Consumption Vs Production'
                },

                defaultFontColor: '#1e1e1e',
                response: true,
                maintainAspectRatio: false,
                drawborder:false,
                cutoutPercentage: 70,
                rotation: Math.PI,
                circumference: 1 * Math.PI
            }
        })
    }

}
</script>

<style lang="scss" scoped>

</style>
