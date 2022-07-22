<!--
Component to house all graphs related to the reference section of the wizard.
This component would have a similar functionality to that of the reference wiki.
-->

<template>
    <section class="graphs-wrapper"><!--
        <PowerUsage class="power-config-graph" :id="'pu-config-canvas-'+ canvasNumber"
            v-if="(getActiveConfigType === 'Custom' ||
                   (getActiveReference === 'Graphs' &&
                    (getActiveForm !== 'Initial' || getActiveForm === 'Finalize'))"/>
        <GreenhouseDoughnut class="greenhouse-config-graph" :id="'gh-config-canvas-'+ canvasNumber"
            v-if="(getActiveConfigType === 'Custom' ||
                   (getActiveReference === 'Graphs' &&
                    (getActiveForm === 'Greenhouse' || getActiveForm === 'Finalize'))"/>-->
        <!-- The wrapper divs make ChartJS happy. -->
        <div><PowerUsage id="pu-config-canvas" class="power-config-graph" /></div>
        <div><GreenhouseConfig id="gh-config-canvas" class="greenhouse-config-graph" /></div>
    </section>
</template>

<script>
import {mapGetters} from 'vuex'
import {GreenhouseConfig, PowerUsage} from '../graphs'

export default {
    components: {
        GreenhouseConfig,
        PowerUsage,
    },
    computed: {
        // ...mapGetters('wizard',['getActiveConfigType','getActiveReference','getActiveForm']),
    },
}
</script>

<style lang="scss" scoped>
.graphs-wrapper {
    display: grid;
    justify-items: center;
    grid-template-rows: 50% 50%;
    height: 100%;
    position: relative;
}
.graphs-wrapper div {
    width: 100%;
}
.graphs-wrapper canvas {
    height: 100%;
    width: 100%;
}
</style>
