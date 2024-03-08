<template>
    <div class="panel-graph">
        <div>
            <select v-model="selected_hostname" required>
                <option disabled selected value="">Select host</option>
                <option v-for="host_name in hostSensorInfo" :key="host_name" :value="host_name">{{host_name}}</option>
            </select>
            <select v-model="selected_sensorname" required>
                <option disabled selected value="">Select sensor</option>
                <option v-for="(sensor_name) in sensorSensorInfo" :key="sensor_name"
                        :value="sensor_name">{{sensor_name}}</option>
            </select>
            <select v-model="selected_currency" required>
                <option disabled selected value="">Select reading</option>
                <option v-for="(info, curr) in getValidInfo()" :key="curr"
                        :value="curr">{{info.label}}</option>
            </select>
        </div>
        <div>
            <LiveReadings :id="'canvas-pc-' + canvasNumber" :plotted-value="selected_currency"
                          :currency="currency" :color="'#0066ff'" :unit="getUnit()"
                          :hostname="selected_hostname" :sensorname="selected_sensorname"
                          :currency-sensor-info="currencySensorInfo"
                          :fullscreen="fullscreen" :nsteps="fullscreen?4320:60" />
        </div>
    </div>
</template>


<script>
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useLiveStore} from '../../store/modules/LiveStore'
import {LiveReadings} from '../graphs'

export default {
    panelTitle: 'Sensors Readings',
    modes: ['live'],
    components: {
        LiveReadings,
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
        const liveStore = useLiveStore()
        const {activePanels} = storeToRefs(dashboard)
        const {sensorInfo} = storeToRefs(liveStore)
        return {activePanels, sensorInfo}
    },
    data() {
        return {
            selected_hostname: '',
            selected_sensorname: '',
            selected_currency: this.panelSection ?? 'all',
            currency: 'temperature',
            hostSensorInfo: [],
            sensorSensorInfo: [],
            currencySensorInfo: {},
        }
    },
    watch: {
        selected_hostname() {
            this.updateSection()
        },
        selected_sensorname() {
            this.updateSection()
        },
        selected_currency() {
            this.updateSection()
        },
        activePanels() {
            this.setFromActivePanels()
        },
        sensorInfo() {
            this.refreshSensorInfo()
        },
    },
    mounted() {
        this.setFromActivePanels()
        this.refreshSensorInfo()
    },
    methods: {
        updateSection() {
            // tell dashboard/Main.vue that we changed panel section,
            // so that it can update the list of activePanels
            this.$emit('panel-section-changed', this.panelIndex,
                       `${this.selected_hostname}/${this.selected_sensorname}/` +
                       `${this.selected_currency}`)
        },
        setFromActivePanels() {
            console.log(this.activePanels[this.panelIndex])
            // update section when the user clicks on the reset panels button of the dashboard menu
            const selections = this.activePanels[this.panelIndex].split(':')[1]
            const [hostname, sensor, currency] = selections ? selections.split('/') : ['', '', '']
            this.selected_hostname = hostname
            this.selected_sensorname = sensor
            this.selected_currency = currency
        },
        refreshSensorInfo() {
            this.currencySensorInfo = {}
            console.log('si', this.sensorInfo)
            Object.entries(this.sensorInfo).forEach(([sensor_id, info]) => {
                  console.log('kv1', sensor_id , info)
                const [host, sensor] = sensor_id.split('.')
                if (!this.hostSensorInfo.includes(host)) {
                    this.hostSensorInfo.push(host)
                }
                if (!this.sensorSensorInfo.includes(sensor)) {
                    this.sensorSensorInfo.push(sensor)
                }
                Object.entries(info.reading_info).forEach(([name, rinfo]) => {
                  console.log('kv2', name , rinfo)
                    if (!(name in this.currencySensorInfo)) {
                        this.currencySensorInfo[name] = rinfo
                    }
                })
            })
        },
        getSensorId() {
            if (!this.selected_hostname.length || !this.selected_sensorname.length) {
                return undefined
            }
            return `${this.selected_hostname}.${this.selected_sensorname}`
        },
        getValidInfo() {
            const sensor_id = this.getSensorId()
            if (sensor_id === undefined || !this.selected_currency.length ||
                !Object.keys(this.sensorInfo).length) {
                return {}
            }
            return this.sensorInfo[sensor_id].reading_info
        },
        getUnit() {
            const info = this.getValidInfo()
            if (this.selected_currency in info) {
                const curr_info = info[this.selected_currency]
                return ` ${curr_info.unit}`
            } else {
                return ''
            }
        },
    },
}
</script>


<style lang="scss" scoped>
.panel-graph {
  display: grid;
  grid-template-rows: auto 1fr;
}
.panel-graph div {
  /*margin: 0 auto;*/
}
.panel-graph select {
  width: 33%;
}
.panel-graph select + div {
  /* see https://github.com/chartjs/Chart.js/issues/4156#issuecomment-295180128 */
  min-width: 0;
  min-height: 0;
}
</style>
