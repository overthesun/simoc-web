<template>
    <div class="panel-graph">
        <select v-model="currency" required>
            <option :selected="currency === 'co2' || !(currency in units)" value="co2">
                Carbon dioxide (CO₂)
            </option>
            <option :selected="currency === 'o2'" value="o2">Oxygen (O₂)</option>
            <option :selected="currency === 'potable'" value="potable">Potable Water</option>
            <option :selected="currency === 'kwh'" value="kwh">Energy</option>
        </select>
        <div>
            <VersusGraph :id="'canvas-pc-' + canvasNumber" :plotted-value="currency" :unit="units[currency]" />
        </div>
    </div>
</template>

<script>
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {VersusGraph} from '../graphs'

export default {
    panelTitle: 'Production / Consumption',
    modes: ['sim', 'kiosk'],
    components: {
        VersusGraph,
    },
    props: {
        canvasNumber: {type: Number, required: true},
        // these are passed by dashboard/Main.vue and
        // determine the panel index and the selected graph
        panelIndex: {type: Number, required: true},
        panelSection: {type: String, default: null},
    },
    emits: ['panel-section-changed'],
    setup() {
        const dashboard = useDashboardStore()
        const {activePanels} = storeToRefs(dashboard)
        return {activePanels}
    },
    data() {
        return {
            // default on 'co2' if we don't get anything
            // (e.g. when using "Change panel")
            currency: this.panelSection ?? 'co2',
            units: {
                co2: 'kg',
                o2: 'kg',
                potable: 'kg',
                kwh: 'kW',
            },
        }
    },
    watch: {
        currency() {
            // tell dashboard/Main.vue that we changed panel section,
            // so that it can update the list of activePanels
            this.$emit('panel-section-changed', this.panelIndex, this.currency)
        },
        activePanels() {
            // update section when the user clicks on the reset panels button of the dashboard menu
            this.currency = this.activePanels[this.panelIndex].split(':')[1]
        },
    },
}
</script>

<style lang="scss" scoped>
.panel-graph {
    display: grid;
    grid-template-rows: auto 1fr;
}
.panel-graph select {
    width: 50%;
}
.panel-graph select + div {
    /* see https://github.com/chartjs/Chart.js/issues/4156#issuecomment-295180128 */
    min-width: 0;
    min-height: 0;
}
</style>
