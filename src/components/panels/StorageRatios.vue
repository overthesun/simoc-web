<template>
    <div class="panel-graph">
        <select v-model="storage" required>
            <option v-for="[stor_name, stor_id] in getMultiCurrencyStorages"
                    :key="`${stor_name}/${stor_id}`" :value="`${stor_name}/${stor_id}`">
                {{stringFormatter(stor_name)}} {{stor_id}}
            </option>
        </select>
        <div>
            <LevelsGraph :id="'canvas-storage-levels-' + canvasNumber" :plotted-storage="storage"
                         :storages-mapping="storagesMapping" />
        </div>
    </div>
</template>

<script>
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {StringFormatter} from '../../javascript/utils'
import {LevelsGraph} from '../graphs'

export default {
    panelTitle: 'Storage Ratios',
    modes: ['sim', 'kiosk'],
    components: {
        LevelsGraph,
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
        const {gameConfig, currencyDict} = storeToRefs(dashboard)
        return {gameConfig, currencyDict}
    },
    data() {
        return {
            storage: undefined,
            storagesMapping: {},
        }
    },
    computed: {
        getMultiCurrencyStorages() {
            const {storages} = this.gameConfig
            const allCurrencies = Object.keys(this.currencyDict)
            // The storages var looks like:
            // {air_storage: {0: {o2:..., co2,...}, 1: {...}}, food_storage: {...}, ...}
            // Some storages (e.g. power_storage) only have 1 currency in the inner object,
            // so it doesn't make much sense to calculate the ratios for those storages.
            // This function takes all the storages that have at least 2 currencies,
            // adds them to the filtered var, and returns them.
            const filtered = []
            Object.entries(storages).forEach(([stor_name, stor_group]) => {
                stor_group.forEach((stor, stor_id) => {
                    // TODO: Revert ABM Workaround
                    // each stor has an additional id key, so we need >2 keys to have
                    // two currencies (one id key + two or more currency keys)
                    const currencies = Object.keys(stor).filter(c => allCurrencies.includes(c))
                    if (currencies.length > 2) {
                        filtered.push([stor_name, stor_id+1])
                    }
                })
            })
            return filtered
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
        this.storage = this.panelSection ?? this.getMultiCurrencyStorages[0].join('/')
        Object.entries(this.gameConfig.storages).forEach(([storage_name, storage]) => {
            if (storage[0].storageType) {
                this.storagesMapping[storage_name] = storage[0].storageType[0]
            } else {
                this.storagesMapping[storage_name] = storage_name
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
