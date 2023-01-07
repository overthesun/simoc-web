<!--
Component to house all graphs related to the reference section of the wizard.
This component would have a similar functionality to that of the reference wiki.
-->

<template>
    <section class="graphs-wrapper" :class="simLocation"><!--
        <PowerUsage class="power-config-graph" :id="'pu-config-canvas-'+ canvasNumber"
            v-if="(activeConfigType === 'Custom' ||
                   (activeReference === 'Graphs' &&
                    (getActiveForm !== 'Initial' || getActiveForm === 'Finalize'))"/>
        <GreenhouseDoughnut class="greenhouse-config-graph" :id="'gh-config-canvas-'+ canvasNumber"
            v-if="(activeConfigType === 'Custom' ||
                   (activeReference === 'Graphs' &&
                    (getActiveForm === 'Greenhouse' || getActiveForm === 'Finalize'))"/>-->
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
        const {activeConfigType, activeReference, getActiveForm} = storeToRefs(wizard)
        const dashboard = useDashboardStore()
        const {simLocation} = storeToRefs(dashboard)
        return {activeConfigType, activeReference, getActiveForm, simLocation}
    },
}
</script>

<style lang="scss" scoped>
.graphs-wrapper {
    display: grid;
    justify-items: center;
    height: 100%;
    position: relative;
    &.mars {
        grid-template-rows: 50% 50%;
    }
    &.b2 {
        grid-template-rows: 33% 33% 33%;
    }
}
.graphs-wrapper div {
    width: 100%;
}
.graphs-wrapper canvas {
    height: 100%;
    width: 100%;
}
</style>
