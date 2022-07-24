<template>
    <div class="panel-graph">
        <select v-model="location" required>
            <option :selected="location === 'all'" value="all">All</option>
            <option value="Average">Average</option>
            <option v-for="(info, id) in currencySensorInfo" :key="id" :value="id">{{info.sensor_name}}</option>
            <!-- <option :selected="location === 'greenhouse'" value="greenhouse">Greenhouse</option>-->
        </select>
        <div>
            <AveragesGraph :id="'canvas-pc-' + canvasNumber" :plotted-value="location"
                           :currency="currency" :color="'#46f0f0'" :unit="'%'"
                           :currency-sensor-info="currencySensorInfo" />
        </div>
    </div>
</template>


<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {useLiveDataStore} from '@/store/modules/LiveDataStore'
import {AveragesGraph} from '../graphs'

export default {
    panelTitle: 'Relative Humidity',
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
    setup() {
        const liveData = useLiveDataStore()
        return {liveData}
    },
    data() {
        return {
            // default on 'all' and 'co2_ppm'
            // (e.g. when using "Change panel")
            location: this.panelSection ?? 'all',
            currency: 'rel_hum',
            currencySensorInfo: {},
        }
    },
    computed: {
        ...mapGetters('dashboard', ['getActivePanels']),
        getSensorInfo() {
            return this.liveData.sensorInfo
        },
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
        getSensorInfo() {
            this.refreshCurrencySensorInfo()
        },
    },
    mounted() {
        this.refreshCurrencySensorInfo()
    },
    methods: {
        refreshCurrencySensorInfo() {
            this.currencySensorInfo = {}
            Object.entries(this.getSensorInfo).forEach(([k, v]) => {
                if (Object.keys(v.reading_info).includes(this.currency)) {
                    this.currencySensorInfo[k] = v
                }
            })
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
