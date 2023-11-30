<template>
    <div class="panel-graph">
        <GreenhouseDoughnut :id="'canvas'+ canvasNumber" />
    </div>
</template>

<script>
import {GreenhouseDoughnut} from '../graphs'

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
