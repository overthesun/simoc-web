<template>
    <div class="panel-graph">
        <select v-model="storage" required>
            <option v-for="[stor_name, stor_id] in getMultiCurrencyStorages"
                    :key="`${stor_name}/${stor_id}`" :value="`${stor_name}/${stor_id}`">
                {{stringFormatter(stor_name)}} {{stor_id}}
            </option>
        </select>
        <div>
            <LevelsGraph :id="'canvas-storage-levels-' + canvasNumber" :plotted-storage="storage" />
        </div>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
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
    },
    emits: ['panel-section-changed'],
    data() {
        return {
            storage: undefined,
        }
    },
    computed: {
        ...mapGetters('dashboard', ['getStorageCapacities', 'getGameConfig']),
        getMultiCurrencyStorages() {
            const {storages} = this.getGameConfig
            // The storages var looks like:
            // {air_storage: {0: {atmo_o2:..., atmo_co2,...}, 1: {...}}, food_storage: {...}, ...}
            // Some storages (e.g. power_storage) only have 1 currency in the inner object,
            // so it doesn't make much sense to calculate the ratios for those storages.
            // This function takes all the storages that have at least 2 currencies,
            // adds them to the filtered var, and returns them.
            const filtered = []
            Object.entries(storages).forEach(([stor_name, stor_group]) => {
                stor_group.forEach((stor, stor_id) => {
                    // each stor has an additional id key, so we need >2 keys to have
                    // two currencies (one id key + two or more currency keys)
                    if (Object.keys(stor).length > 2) {
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
