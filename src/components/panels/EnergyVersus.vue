<template>
    <div class='panel-graph'>
        <VersusGraph :id="'canvas-energy-' + canvasNumber" plotted_value='enrg_kwh' unit='kW' />
    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {VersusGraph} from '../../components/graphs'

export default {
    panelTitle: 'Energy Production / Consumption',
    props: {
        canvasNumber: 0,
    },
    components: {
       'VersusGraph': VersusGraph,
    },
}
</script>

<style lang="scss" scoped>
</style>
