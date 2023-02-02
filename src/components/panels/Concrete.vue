<template>
    <div class="panel-graph">
        <AgentGraph :id="'canvas-pc-' + canvasNumber" agent="concrete" category="storage"
                    :fullscreen="fullscreen" :nsteps="fullscreen ? getTotalMissionHours : 24" />
    </div>
</template>

<script>
import {storeToRefs} from 'pinia'
import {useWizardStore} from '../../store/modules/WizardStore'
import {AgentGraph} from '../graphs'

export default {
    panelTitle: 'Concrete',
    modes: ['sim:b2'],
    components: {
        AgentGraph,
    },
    props: {
        canvasNumber: {type: Number, required: true},
        // these are passed by dashboard/Main.vue and
        // determine the panel index and the selected graph
        panelIndex: {type: Number, required: true},
        panelSection: {type: String, default: null},
        fullscreen: {type: Boolean, default: false},
    },
    emits: ['panel-section-changed'],
    setup() {
        const wizard = useWizardStore()
        const {getTotalMissionHours} = storeToRefs(wizard)
        return {getTotalMissionHours}
    },
}
</script>

<style lang="scss" scoped>
.panel-graph {
    display: grid;
    grid-template-rows: auto 1fr;
}
.chart-area {
    /* see https://github.com/chartjs/Chart.js/issues/4156#issuecomment-295180128 */
    min-width: 0;
    min-height: 0;
}
</style>
