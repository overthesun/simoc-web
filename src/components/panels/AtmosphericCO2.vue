<template>
    <div class="panel-graph">
        <select v-model="location" required>
            <option :selected="location === 'crew_quarters'" value="crew_quarters">Crew Quarters</option>
            <!-- <option :selected="location === 'greenhouse'" value="greenhouse">Greenhouse</option>-->
        </select>
        <div>
            <AveragesGraph :id="'canvas-pc-' + canvasNumber" :plotted-value="location"
                           :currency="'co2'" :unit="unit" />
        </div>
        <div class="graph-units">
            <select v-model="unit" required>
                <option :selected="unit === 'co2_ppm'" value="co2_ppm">ppm</option>
                <!-- <option :selected="unit === 'co2_ccm'" value="co2_ccm">ccm</option>-->
            </select>
        </div>
    </div>
</template>


<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {AveragesGraph} from '../graphs'

export default {
    panelTitle: 'Atmospheric CO2',
    modes: ['live'],
    components: {
        AveragesGraph,
    },
    props: {
        canvasNumber: {type: Number, required: true},
        // these are passed by dashboard/Main.vue and
        // determine the panel index and the selected graph
        panelIndex: {type: Number, required: true},
        panelSection: {type: String, default: null},
    },
    emits: ['panel-section-changed'],
    data() {
        return {
            // default on 'crew_quarters' and 'co2_ppm'
            // (e.g. when using "Change panel")
            location: this.panelSection ?? 'crew_quarters',
            unit: this.panelSection ?? 'co2_ppm',
        }
    },
    computed: {
        ...mapGetters('dashboard', ['getActivePanels']),
    },
    watch: {
        location() {
            // tell dashboard/Main.vue that we changed panel section,
            // so that it can update the list of activePanels
            this.$emit('panel-section-changed', this.panelIndex, this.location)
        },
        getActivePanels() {
            // update section when the user clicks on the reset panels button of the dashboard menu
            this.location = this.getActivePanels[this.panelIndex].split(':')[1]
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

.graph-units select {
    display: grid;
    grid-template-rows: auto 1fr;
    width: 15%;
}

.panel-graph select + div {
    /* see https://github.com/chartjs/Chart.js/issues/4156#issuecomment-295180128 */
    min-width: 0;
    min-height: 0;
}
</style>