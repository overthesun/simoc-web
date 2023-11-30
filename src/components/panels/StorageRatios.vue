<template>
    <div class="panel-graph">
        <select v-model="storage" required>
            <option v-for="stor_name in getMultiCurrencyStorages"
                    :key="stor_name" :value="stor_name">
                {{stringFormatter(stor_name)}}
            </option>
        </select>
        <div>
            <LevelsGraph :id="'canvas-storage-levels-' + canvasNumber" :plotted-storage="storage"
                         :storages-mapping="storagesMapping" :fullscreen="fullscreen"
                         :nsteps="fullscreen?getTotalMissionHours:24" />
        </div>
    </div>
</template>

<script>
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useWizardStore} from '../../store/modules/WizardStore'
import {StringFormatter} from '../../javascript/utils'
import {LevelsGraph} from '../graphs'

export default {
    panelTitle: 'Storage Ratios',
    modes: ['sim'],
    components: {
        LevelsGraph,
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
        const {gameConfig, currencyDict} = storeToRefs(dashboard)
        const {getTotalMissionHours} = storeToRefs(wizard)
        return {gameConfig, currencyDict, getTotalMissionHours}
    },
    data() {
        return {
            storage: undefined,
            storagesMapping: {},
        }
    },
    computed: {
        getMultiCurrencyStorages() {
            // Return a list of agents that store at least 2 different currencies.
            return Object.entries(this.gameConfig.agents)
                    .filter(([agent, agent_data]) => Object.keys(agent_data.capacity).length > 1)
                    .map(([agent, agent_data]) => agent)
        },
    },
    watch: {
        storage() {
            // tell dashboard/Main.vue that we changed panel section,
            // so that it can update the list of activePanels
            this.$emit('panel-section-changed', this.panelIndex, this.storage)
        },
        getActivePanels() {
            // update section when the user clicks on the reset panels button of the dashboard menu
            this.storage = this.getActivePanels[this.panelIndex].split(':')[1]
        },
    },
    created() {
        // default on the first storage if we don't get anything (e.g. when using "Change panel")
        const storages = this.getMultiCurrencyStorages
        this.storage = this.panelSection ?? storages[0]
        // Create a mapping between storage names and storage types for coloring purposes
        storages.forEach(agent_id => {
            if (['water_storage', 'nutrient_storage'].includes(agent_id)) {
                this.storagesMapping[agent_id] = agent_id
            } else {
                this.storagesMapping[agent_id] = 'air_storage'
            }
        })
    },
    methods: {
        stringFormatter: StringFormatter,
    },
}
</script>

<style lang="scss">
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
