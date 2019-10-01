<template>
    <div class='panel-graph'>
        <VersusGraph :id="'canvas-co2-' + canvasNumber" plotted_value='atmo_co2' unit='kg' />
    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {VersusGraph} from '../../components/graphs'

export default {
    panelTitle: 'CO₂ Production / Consumption',
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
