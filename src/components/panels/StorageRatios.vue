<template>
    <div class="panel-graph">
        <select v-model="storage" required>
            <template v-for="(stor_group, stor_name) in getStorages">
                <option v-for="(stor, stor_id) in stor_group" v-if="Object.keys(stor).length > 2"
                        :value="stor_name + '/' + (stor_id+1)">
                    {{stringFormatter(stor_name)}} {{stor_id+1}}
                </option>
            </template>
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
    data() {
        return {
            storage: undefined,
        }
    },
    created() {
        // default on the first storage if we don't get anything (e.g. when using "Change panel")
        this.storage = this.panelSection || `${Object.keys(this.getStorages)[0]}/1`
    },
    props: {
        canvasNumber: 0,
        // these are passed by dashboard/Main.vue and
        // determine the panel index and the selected graph
        panelIndex: Number,
        panelSection: undefined,
    },
    components: {
        LevelsGraph,
    },
    computed: {
        ...mapGetters('dashboard', ['getStorageCapacities', 'getGameConfig']),
        getStorages() {
            return this.getGameConfig.storages
        },
    },
    methods: {
        stringFormatter: StringFormatter,
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
