<!-- Greenhouse Doughnut Graph

Updates and uses the values from the greenhouse and the plant species within the wizard store to populate the graph values. Currently
has enough color values for up to 30 plants.

See chart.js documentation for more details.
-->

<template>
    <canvas :id="id" />
</template>

<script>
import Chart from 'chart.js';
import axios from 'axios'
import "chartjs-plugin-annotation";
import {mapState,mapGetters} from 'vuex'
import {StringFormatter} from '../../javascript/stringFormatter'
export default {
    props:{
        id:String,
    },

    data(){
        return{
            //Greenhouse volumes. These should be retrieved from the database in the future to populate.
            greenhouseSize:{
                'none':0,
                'greenhouse_small':490,
                'greenhouse_medium':2454,
                'greenhouse_large':5610
            },

            //Enough colors to cover all the plant types. Used to specify the color for each section of the pie chart.
            backgroundColor:["#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231", "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe", "#008080", "#e6beff", "#9a6324", "#fffac8", "#800000", "#aaffc3", "#808000", "#ffd8b1", "#000075", "#808080", "#ffffff", "#000000"]
        }
    },
    computed:{
        ...mapGetters('wizard',['getConfiguration']),
        ...mapGetters('dashboard',['getCurrentStepBuffer']),


        /*
        No longer used

        graphData:function(){
            let {greenhouse,plantSpecies} = this.getConfiguration
            let amounts = []
            let types = []

            let totalUsed = 0

            plantSpecies.forEach((item) =>{
                amounts.push(item.amount)
                types.push(new StringFormatter(item.type))
                totalUsed += parseInt(item.amount)
            })

            amounts.push()

            let data = {
                amounts:amounts,
                types:types
            }

            return data
        }*/
    },

    methods:{
        //Format the plant data to be used within the chart object.

        greenhouseConfiguration:function(){
            const {greenhouse,plantSpecies} = this.getConfiguration // get the plants and greenhouse from the configuration
            let values ={data:[this.greenhouseSize[greenhouse.type]],labels:["Free Space"]} // Set the first value of the dataset to the size of the greenhouse and add the label free space
            plantSpecies.forEach((item)=>{
                values.data[0] = Math.max(0,values.data[0] - item.amount) //Calculates the total free space left after all the plants are added, modifies the first index initialized above.
                values.data.push(item.amount) //Push in the amount of the plant that is present.
                values.labels.push(StringFormatter(item.type)) //format the plant name string for display
            })

            return values
        },
        updateChart: function(){
            const {greenhouse,plantSpecies} = this.getConfiguration
            const {data,labels} = this.greenhouseConfiguration()
            this.chart.data.labels = labels  // labels are always visible
            // only show the text if the greenhouse type is none
            if (greenhouse.type === 'none') {
                this.chart.data.datasets[0].data = []
                var text = 'No Greenhouse Type Selected'
            }
            // otherwise show both the doughnut and the text
            else {
                this.chart.data.datasets[0].data.pop()
                this.chart.data.datasets[0].data = data
                var text = data[0] + " m³ / " + this.greenhouseSize[greenhouse.type] + " m³"
            }
            this.chart.options.elements.centerText.text = text
            this.chart.update()
        },
    },
    watch:{
        // Watches for changes in getCurrentStepBuffer within the
        // dashboard store to update the graph in the dashboard
        getCurrentStepBuffer: function() {
            this.updateChart()
        },

        // Watches for changes within the getConfiguration object within
        // the wizard store to update the graph in the config wizard
        getConfiguration:{
            handler: function() {
                this.updateChart()
            },
            deep:true
        },
    },
    update(){

    },
    mounted(){
        const ctx = document.getElementById(this.id)
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data:{
                labels: ["Free Space"],
                datasets:[{
                    backgroundColor: this.backgroundColor,
                    data:[0],
                }]
            },
            options:{
                responsive: true,
                maintainAspectRatio: false,
                cutoutPercentage: 70,
                elements:{
                    arc:{
                        borderWidth: 0
                    },
                    centerText:{
                        text: '',
                    }
                },
                legend:{
                    onClick:null,
                    display:true,
                    fontColor: "#eeeeee",
                    position: 'bottom',
                    labels:{
                        fontColor: "#eeeeee",
                        fontFamily: "open sans",
                        fontSize: 14,
                        boxWidth: 4,
                        usePointStyle:true,
                    }
                },
                animation:{
                    animateScale:false,
                    animateRotate:false,
                },
                drawborder: false,
            },
            plugins:[{
                beforeDraw: function(chart){
                    var width = chart.chart.width;
                    var height = chart.chart.height;
                    var ctx = chart.chart.ctx;

                    ctx.restore();
                    var fontSize = (height/300).toFixed(2);
                    ctx.font = fontSize + "em sans-serif";
                    ctx.textBaseline = "bottom";

                    var text = chart.chart.options.elements.centerText.text,
                        textX = Math.round((width - ctx.measureText(text).width) / 2),
                        textY = height/2;

                    ctx.fillStyle = 'white';
                    ctx.fillText(text,textX,textY);
                    ctx.save();
                }
            }]
        })
    this.updateChart()  // this will set the center text and other things
    }
}

</script>

<style lang="scss" scoped>

    .doughnut-wrapper{
        position:relative;
        display:grid;
        grid-template-rows: minmax(0px,1fr) 32px;
        grid-row-gap: 16px;
    }
</style>
