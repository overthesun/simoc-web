<!--
Component to house all graphs related to the reference section of the wizard.
This component would have a similar functionality to that of the reference wiki.
-->

<template>
    <section class="graphs-wrapper"><!--
        <PowerUsage class="power-config-graph" :id="'pu-config-canvas-'+ canvasNumber"
            v-if="(activeConfigType === 'Custom' ||
                   (activeReference === 'Graphs' &&
                    (getActiveForm !== 'Initial' || getActiveForm === 'Finalize'))"/>
        <GreenhouseDoughnut class="greenhouse-config-graph" :id="'gh-config-canvas-'+ canvasNumber"
            v-if="(activeConfigType === 'Custom' ||
                   (activeReference === 'Graphs' &&
                    (getActiveForm === 'Greenhouse' || getActiveForm === 'Finalize'))"/>-->
        <!-- The wrapper divs make ChartJS happy. -->
        <div><PowerUsage id="pu-config-canvas" class="power-config-graph" /></div>
        <div><GreenhouseConfig id="gh-config-canvas" class="greenhouse-config-graph" /></div>
    </section>
</template>

<script>
import {storeToRefs} from 'pinia'
import {GreenhouseConfig, PowerUsage} from '../graphs'
import {useWizardStore} from '../../store/modules/WizardStore'

export default {
    components: {
        GreenhouseConfig,
        PowerUsage,
    },
    setup() {
        const wizard = useWizardStore()
        const {activeConfigType, activeReference, getActiveForm} = storeToRefs(wizard)
        return {activeConfigType, activeReference, getActiveForm}
    },
}
</script>

<style lang="scss" scoped>
.graphs-wrapper {
    display: grid;
    justify-items: center;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr;
    overflow: auto;
    width: 100%;
    height: 100%;
}
.graphs-wrapper div {
    /* these are required by ChartJS
     * to properly resize the graph */
    position: relative;
    overflow-x: scroll;
    width: 100%;
}
.graphs-wrapper canvas {
    height: 100%;
    width: 100%;
}
</style>
