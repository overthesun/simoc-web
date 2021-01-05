<template>
    <div class='panel-graph'>
        <select v-model="currency" required>
            <option value='atmo_co2' :selected="currency === 'atmo_co2' || !(currency in units)">Carbon dioxide (CO₂)</option>
            <option value='atmo_o2' :selected="currency === 'atmo_o2'">Oxygen (O₂)</option>
            <option value='h2o_potb' :selected="currency === 'h2o_potb'">Potable Water</option>
            <option value='enrg_kwh' :selected="currency === 'enrg_kwh'">Energy</option>
        </select>
        <div>
            <VersusGraph :id="'canvas-pc-' + canvasNumber" :plotted_value='currency' :unit='units[currency]' />
        </div>
    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {VersusGraph} from '../../components/graphs'

export default {
    panelTitle: 'Production / Consumption',
    data() {
        return {
            // default on 'atmo_co2' if we don't get anything
            // (e.g. when using "Change panel")
            currency: this.panelSection || 'atmo_co2',
            units: {
                atmo_co2: 'kg',
                atmo_o2: 'kg',
                h2o_potb: 'kg',
                enrg_kwh: 'kW',
            },
        }
    },
    props: {
        canvasNumber: 0,
        // these are passed by dashboard/Main.vue and
        // determine the panel index and the selected graph
        panelIndex: Number,
        panelSection: undefined,
    },
    components: {
       'VersusGraph': VersusGraph,
    },
    computed: {
        ...mapGetters('dashboard', ['getActivePanels']),
    },
    watch: {
        currency: function () {
            // tell dashboard/Main.vue that we changed panel section,
            // so that it can update the list of activePanels
            this.$emit('panel-section-changed', this.panelIndex, this.currency)
        },
        getActivePanels: function () {
            // update section when the user clicks on the reset panels button of the dashboard menu
            this.currency = this.getActivePanels[this.panelIndex].split(':')[1]
        },
    },
}
</script>

<style lang="scss" scoped>
.panel-graph {
    display: grid;
    grid-template-rows: auto 1fr;
}
select {
    width: 50%;
}
.panel-graph select + div {
    /* see https://github.com/chartjs/Chart.js/issues/4156#issuecomment-295180128 */
    min-width: 0;
    min-height: 0;
}
</style>
