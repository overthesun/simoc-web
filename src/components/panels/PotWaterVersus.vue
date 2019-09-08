<template>
    <div class='panel-graph'>
        <VersusGraph :id="'canvas-water-' + canvasNumber" plotted_value='h2o_potb' unit='kg' />
    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {VersusGraph} from '../../components/graphs'

export default {
    panelTitle: 'Potable Water Levels',
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
