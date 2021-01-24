<template>
    <div class='panel-graph-gauge'>
        <div class='gauge-wrapper' style='position:relative'>
            <Gauge :id="'canvas1'+canvasNumber" color="#e6194b" keyValue="atmo_co2" :maximum=".03" :getter="getAirStorageRatio" label="CO₂"/>
            <div class='gauge-text'>CO₂ (0-3%)</div>
        </div>
        <div class='gauge-wrapper' style='position:relative'>
            <Gauge :id="'canvas2'+canvasNumber" color="#3cb44b" keyValue="atmo_o2" :maximum="1.0" :getter="getAirStorageRatio" label="O₂"/>
            <div class='gauge-text'>O₂ (0-100%)</div>
        </div>
        <div class='gauge-wrapper' style='position:relative'>
            <Gauge :id="'canvas3'+canvasNumber" color="#46f0f0" keyValue="atmo_h2o" :maximum="0.03" :getter="getAirStorageRatio" label="H₂O Vapor"/>
            <div class='gauge-text'>H₂O Vapor (0-3%)</div>
        </div>
        <div class='gauge-wrapper' style='position:relative'>
            <Gauge :id="'canvas4'+canvasNumber" color="#ffe119" keyValue="atmo_h2" :maximum=".03" :getter="getAirStorageRatio" label="H₂"/>
            <div class='gauge-text'>H₂ (0-3%)</div>
        </div>
        <div class='gauge-wrapper' style='position:relative'>
            <Gauge :id="'canvas5'+canvasNumber" color="#4363d8" keyValue="atmo_n2" :maximum="1.0" :getter="getAirStorageRatio" label="N₂"/>
            <div class='gauge-text'>N₂ (0-100%)</div>
        </div>
        <div class='gauge-wrapper' style='position:relative'>
            <Gauge :id="'canvas6'+canvasNumber" color="#f58231" keyValue="atmo_ch4" :maximum=".03" :getter="getAirStorageRatio" label="CH₄"/>
            <div class='gauge-text'>CH₄ (0-3%)</div>
        </div>
    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {Gauge} from '../../components/graphs'
export default {
    panelTitle: 'Atmospheric Monitors',
    props:{
        canvasNumber:0,
    },
    components:{
       'Gauge':Gauge,
    },
    computed:{
        ...mapGetters('wizard',['getConfiguration']),
        ...mapGetters('dashboard',['getAirStorageRatio']),
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
        padding-bottom: 1em;
    }

    .gauge-wrapper{
        display:grid;
        grid-template-rows: minmax(0px,1fr) 24px;
        grid-row-gap: 0;
        text-align:center;
    }

    .gauge-text{
        font-size: 16px;
        font-weight: 400;
    }

</style>
