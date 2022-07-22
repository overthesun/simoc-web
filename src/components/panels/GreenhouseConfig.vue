<template>
    <div class="panel-graph">
        <GreenhouseDoughnut :id="'canvas'+ canvasNumber" />
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import GreenhouseDoughnut from '@/components/graphs/GreenhouseDoughnut.vue'

export default {
    panelTitle: 'Greenhouse Configuration',
    modes: ['sim'],
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
