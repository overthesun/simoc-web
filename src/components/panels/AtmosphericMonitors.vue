<template>
    <div class="panel-graph-gauge">
        <div class="gauge-wrapper">
            <Gauge :id="'canvas1'+canvasNumber" :maximum="3"
                   :getter="airStorageGetter('co2')"
                   color="#e6194b" :label="getShortLabel('co2')" />
            <div class="gauge-text">{{getShortLabel('co2')}} (0-3%)</div>
        </div>
        <div class="gauge-wrapper">
            <Gauge :id="'canvas2'+canvasNumber" :maximum="100"
                   :getter="airStorageGetter('o2')"
                   color="#3cb44b" :label="getShortLabel('o2')" />
            <div class="gauge-text">{{getShortLabel('o2')}} (0-100%)</div>
        </div>
        <div class="gauge-wrapper">
            <Gauge :id="'canvas3'+canvasNumber" :maximum="3"
                   :getter="airStorageGetter('h2o')"
                   color="#46f0f0" :label="getShortLabel('h2o')" />
            <div class="gauge-text">{{getShortLabel('h2o')}} Vapor (0-3%)</div>
        </div>
        <div class="gauge-wrapper">
            <Gauge :id="'canvas4'+canvasNumber" :maximum="3"
                   :getter="airStorageGetter('h2')"
                   color="#ffe119" :label="getShortLabel('h2')" />
            <div class="gauge-text">{{getShortLabel('h2')}} (0-3%)</div>
        </div>
        <div class="gauge-wrapper">
            <Gauge :id="'canvas5'+canvasNumber" :maximum="100"
                   :getter="airStorageGetter('n2')"
                   color="#4363d8" :label="getShortLabel('n2')" />
            <div class="gauge-text">{{getShortLabel('n2')}} (0-100%)</div>
        </div>
        <div class="gauge-wrapper">
            <Gauge :id="'canvas6'+canvasNumber" :maximum="3"
                   :getter="airStorageGetter('ch4')"
                   color="#f58231" :label="getShortLabel('ch4')" />
            <div class="gauge-text">{{getShortLabel('ch4')}} (0-3%)</div>
        </div>
    </div>
</template>

<script>
import {storeToRefs} from 'pinia'

import {useDashboardStore} from '../../store/modules/DashboardStore'
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
    setup() {
        const {humanAtmosphere, gameConfig, currencyDict, getData} = useDashboardStore()
        return {humanAtmosphere, gameConfig, getData, currencyDict}
    },
    computed: {
        totalAtmosphere() {
            return this.getData([this.humanAtmosphere, 'storage', 'SUM', 1])
        },
    },
    methods: {
        airStorageGetter(currency) {
            // TODO: handle multiple air_storages with an optional dropdown
            return step => {
                const amount = this.getData([this.humanAtmosphere, 'storage', currency, step])
                return amount / this.totalAtmosphere * 100
            }
        },
        getShortLabel(currency) {
            const desc = this.currencyDict[currency]
            return desc ? desc.short : currency
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
