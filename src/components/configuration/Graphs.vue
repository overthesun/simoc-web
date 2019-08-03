<!-- Component to house all graphs related to the reference sectoin of the wizard. This component would have a
similar functionality to that of the reference wiki. Table of contents to select which graph is active.
-->

<template>
        <GreenhouseDoughnut class="greenhouse-config-graph" :class="{'visible': getActiveForm === 'Greenhouse' || getActiveForm === 'Finalize'}" :id="'gh-config-canvas-'+ canvasNumber"/>
</template>

<script>
import {GreenhouseDoughnut} from '../../components/graphs'
import {mapGetters} from 'vuex'
export default {
    props:{
        canvasNumber:0,
    },
    components:{
        'GreenhouseDoughnut':GreenhouseDoughnut
    },
    computed:{
        ...mapGetters('wizard',['getActiveForm']),
    },
}
</script>

<style lang="scss" scoped>
    .graphs-wrapper{
        width: 100%;
        height: 100%;
        position:relative;
    }
    .greenhouse-config-graph {
        display: none !important;
    }
    .greenhouse-config-graph.visible {
        display: block !important;
    }
</style>
