<template>
    <div class='panel-graph'>
        <AtmosphericGraph :id="'canvas-atmosphere-' + canvasNumber" />
    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {AtmosphericGraph} from '../../components/graphs'

export default {
    panelTitle: 'Atmospheric Levels',
    props: {
        canvasNumber: 0,
    },
    components: {
       'AtmosphericGraph': AtmosphericGraph,
    },
}
</script>

<style lang="scss">
</style>
