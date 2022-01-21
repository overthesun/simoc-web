<template>
    <div class="panel-graph-gauge">
        <div class="gauge-wrapper">
            <Gauge :id="'canvas1'+canvasNumber" :maximum="3"
                   :getter="airStorageGetter('atmo_co2')"
                   color="#e6194b" label="CO₂" />
            <div class="gauge-text">CO₂ (0-3%)</div>
        </div>
        <div class="gauge-wrapper">
            <Gauge :id="'canvas2'+canvasNumber" :maximum="100"
                   :getter="airStorageGetter('atmo_o2')"
                   color="#3cb44b" label="O₂" />
            <div class="gauge-text">O₂ (0-100%)</div>
        </div>
        <div class="gauge-wrapper">
            <Gauge :id="'canvas3'+canvasNumber" :maximum="3"
                   :getter="airStorageGetter('atmo_h2o')"
                   color="#46f0f0" label="H₂O Vapor" />
            <div class="gauge-text">H₂O Vapor (0-3%)</div>
        </div>
        <div class="gauge-wrapper">
            <Gauge :id="'canvas4'+canvasNumber" :maximum="3"
                   :getter="airStorageGetter('atmo_h2')"
                   color="#ffe119" label="H₂" />
            <div class="gauge-text">H₂ (0-3%)</div>
        </div>
        <div class="gauge-wrapper">
            <Gauge :id="'canvas5'+canvasNumber" :maximum="100"
                   :getter="airStorageGetter('atmo_n2')"
                   color="#4363d8" label="N₂" />
            <div class="gauge-text">N₂ (0-100%)</div>
        </div>
        <div class="gauge-wrapper">
            <Gauge :id="'canvas6'+canvasNumber" :maximum="3"
                   :getter="airStorageGetter('atmo_ch4')"
                   color="#f58231" label="CH₄" />
            <div class="gauge-text">CH₄ (0-3%)</div>
        </div>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {Gauge} from '../graphs'

export default {
    panelTitle: 'Atmospheric Monitors',
    modes: ['sim'],
    components: {
        Gauge,
    },
    props: {
        canvasNumber: {type: Number, required: true},
    },
    computed: {
        ...mapGetters('wizard', ['getConfiguration']),
        ...mapGetters('dashboard', ['getStorageCapacities', 'getGameConfig']),
        total_storage_capacity() {
            return this.getGameConfig.storages.air_storage[0].total_capacity.value
        },
    },
    methods: {
        airStorageGetter(currency) {
            // TODO: handle multiple air_storages with an optional dropdown
            const {total_storage_capacity} = this
            return step => {
                const amount = this.getStorageCapacities(step).air_storage[1][currency].value
                return amount / total_storage_capacity * 100
            }
        },
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
        display: grid;
        position: relative;
        grid-template-rows: minmax(0px,1fr) 24px;
        grid-row-gap: 0;
        text-align: center;
    }

    .gauge-text{
        font-size: 16px;
        font-weight: 400;
    }
</style>
