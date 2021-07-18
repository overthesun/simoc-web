<template>
    <div class="panel-graph">
        <GreenhouseDoughnut :id="'canvas'+ canvasNumber" />
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {GreenhouseDoughnut} from '../graphs'

export default {
    panelTitle: 'Greenhouse Configuration',
    components: {
        GreenhouseDoughnut,
    },
    props: {
        canvasNumber: {type: Number, required: true},
    },
}
</script>


<style lang="scss" scoped>

</style>
