<template>
    <div class="panel-graph">
        <select v-model="currency" required>
            <option :selected="currency === 'co2'" value="co2">
                {{getOptionLabel('co2')}}
            </option>
            <option :selected="currency === 'o2'" value="o2">
                {{getOptionLabel('o2')}}
            </option>
            <option :selected="currency === 'potable'" value="potable">
                {{getOptionLabel('potable')}}
            </option>
            <option v-if="simLocation !== 'b2'" :selected="currency === 'kwh'" value="kwh">
                {{getOptionLabel('kwh')}}
            </option>
        </select>
        <div>
            <VersusGraph :id="'canvas-pc-' + canvasNumber" :plotted-value="currency"
                         :unit="getUnit(currency)" :fullscreen="fullscreen"
                         :nsteps="fullscreen?getTotalMissionHours:24" />
        </div>
    </div>
</template>

<script>
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useWizardStore} from '../../store/modules/WizardStore'
import {VersusGraph} from '../graphs'

export default {
    panelTitle: 'Production / Consumption',
    modes: ['sim'],
    components: {
        VersusGraph,
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
        const dashboard = useDashboardStore()
        const wizard = useWizardStore()
        const {activePanels, simLocation, currencyDict} = storeToRefs(dashboard)
        const {getTotalMissionHours} = storeToRefs(wizard)
        const {getUnit} = dashboard
        return {activePanels, getTotalMissionHours, simLocation, currencyDict, getUnit}
    },
    data() {
        return {
            // default on 'co2' if we don't get anything
            // (e.g. when using "Change panel")
            currency: this.panelSection ?? 'co2',
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
    methods: {
        getOptionLabel(currency) {
            const desc = this.currencyDict[currency]
            if (!desc) {
                return currency
            }
            return desc.label + (desc.short ? ` (${desc.short})` : '')
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
