<!--
Component to house all graphs related to the reference section of the wizard.
This component would have a similar functionality to that of the reference wiki.
-->

<template>
    <section class="graphs-wrapper" :class="simLocation">
        <!-- The wrapper divs make ChartJS happy. -->
        <div v-if="simLocation === 'mars'">
            <PowerUsage id="pu-config-canvas" />
        </div>
        <div v-if="simLocation === 'b2'">
            <O2Usage id="ou-config-canvas" />
        </div>
        <div v-if="simLocation === 'b2'">
            <CO2Usage id="cu-config-canvas" />
        </div>
        <div><GreenhouseConfig id="gh-config-canvas" /></div>
    </section>
</template>

<script>
import {storeToRefs} from 'pinia'
import {GreenhouseConfig, PowerUsage, O2Usage, CO2Usage} from '../graphs'
import {useWizardStore} from '../../store/modules/WizardStore'
import {useDashboardStore} from '../../store/modules/DashboardStore'

export default {
    components: {
        GreenhouseConfig,
        PowerUsage,
        O2Usage,
        CO2Usage,
    },
    setup() {
        const wizard = useWizardStore()
        const {activeReference, getActiveForm} = storeToRefs(wizard)
        const dashboard = useDashboardStore()
        const {simLocation} = storeToRefs(dashboard)
        return {activeReference, getActiveForm, simLocation}
    },
}
</script>

<style lang="scss" scoped>
.graphs-wrapper {
    display: grid;
    justify-items: center;
    position: relative;
    &.mars {
        grid-template-rows: 1fr 1fr;
    }
    &.b2 {
        grid-template-rows: 1fr 1fr 1fr;
    }
    grid-template-columns: 1fr;
    overflow: auto;
    width: 100%;
    height: 100%;
}
.graphs-wrapper div {
    /* these are required by ChartJS
     * to properly resize the graph */
    position: relative;
    overflow-x: auto;
    width: 100%;
}
.graphs-wrapper canvas {
    height: 100%;
    width: 100%;
}
</style>
