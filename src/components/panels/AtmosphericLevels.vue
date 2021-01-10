<template>
    <div class='panel-graph'>
        <LevelsGraph :id="'canvas-atmosphere-' + canvasNumber" />
    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {LevelsGraph} from '../../components/graphs'

export default {
    panelTitle: 'Atmospheric Levels',
    props: {
        canvasNumber: 0,
    },
    components: {
       'LevelsGraph': LevelsGraph,
    },
}
</script>

<style lang="scss">
</style>
