<template>
    <div class='panel-graph-gauge'>
        <div class='gauge-wrapper' style='position:relative'>
            <Gauge :id="'canvas1'+canvasNumber" :color="'#00aaee'" :keyValue="'atmo_co2'" :maximum=".03" :getter="getAirStorageRatio"/>
            <div class='gauge-text'>CO<sub>2</sub> (0-3%)</div>
        </div>
        <div class='gauge-wrapper' style='position:relative'>
            <Gauge :id="'canvas2'+canvasNumber" :color="'#00aaee'" :keyValue="'atmo_o2'" :maximum="1.0" :getter="getAirStorageRatio"/>
            <div class='gauge-text'>O<sub>2</sub> (0-100%)</div>
        </div>
        <div class='gauge-wrapper' style='position:relative'>
            <Gauge :id="'canvas3'+canvasNumber" :color="'#00aaee'" :keyValue="'atmo_h2o'" :maximum="1.0" :getter="getAirStorageRatio"/>
            <div class='gauge-text'>H<sub>2</sub>O Vapor (0-100%)</div>
        </div>
        <div class='gauge-wrapper' style='position:relative'>
            <Gauge :id="'canvas4'+canvasNumber" :color="'#00aaee'" :keyValue="'atmo_h2'" :maximum=".01" :getter="getAirStorageRatio"/>
            <div class='gauge-text'>H<sub>2</sub> (0-1%)</div>
        </div>
        <div class='gauge-wrapper' style='position:relative'>
            <Gauge :id="'canvas5'+canvasNumber" :color="'#00aaee'" :keyValue="'atmo_n2'" :maximum="1.0" :getter="getAirStorageRatio"/>
            <div class='gauge-text'>N<sub>2  (0-100%)</sub></div>
        </div>
        <div class='gauge-wrapper' style='position:relative'>
            <Gauge :id="'canvas6'+canvasNumber" :color="'#00aaee'" :keyValue="'atmo_ch4'" :maximum=".01" :getter="getAirStorageRatio"/>
            <div class='gauge-text'>CH<sub>4</sub> (0-1%)</div>
        </div>
    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {Gauge} from '../../components/graphs'
export default {
    panelTitle: 'Atmospheric Levels',
    props:{
        canvasNumber:0,
    },
    components:{
       'Gauge':Gauge,
    },
    computed:{
        ...mapGetters('wizard',['getConfiguration']),
        ...mapGetters('dashboard',['getAirStorageRatio','getTotalAgentMass','getAgentType']),
    },
}
</script>


<style lang="scss" scoped>

    .panel-graph{
        position:relative;
    }

    .panel-graph-gauge{
        display:grid;
        grid-template-columns: repeat(3,1fr);
        grid-template-rows: repeat(2,1fr);
        grid-row-gap: 16px;
        grid-column-gap: 16px;
    }

    .gauge-wrapper{
        display:grid;
        grid-template-rows: minmax(0px,1fr) 24px;
        grid-row-gap: 8px;
        text-align:center;
    }

    .gauge-text{
        font-size:18px;
        font-weight: 400;
    }

</style>
