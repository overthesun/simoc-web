<template>
    <div class="panel-graph">
        <GreenhouseDoughnut :id="'canvas'+ canvasNumber"/>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {GreenhouseDoughnut} from '../graphs'

export default {
    panelTitle: 'Greenhouse Configuration',
    props: {
        canvasNumber: 0,
    },
    components: {
        GreenhouseDoughnut,
    },
}
</script>


<style lang="scss" scoped>

</style>
