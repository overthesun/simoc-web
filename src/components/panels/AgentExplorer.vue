<template>
    <div class="panel-graph">
        <div>
            <select v-model="agent" required>
                <option v-for="a in agents" :selected="agent === a" :value="a"
                        :key="`agent-exp-option-${a}`">{{stringFormatter(a)}}</option>
            </select>
            <select v-model="category" required>
                <option v-for="s in categories" :selected="category === s" :value="s"
                        :key="`agent-exp-option-${s}`">{{stringFormatter(s)}}</option>
            </select>
        </div>
        <div v-if="(agent && category)">
            <AgentGraph :id="'canvas-pc-' + canvasNumber" :agent="agent" :category="category"
                         :fullscreen="fullscreen" :nsteps="fullscreen ? getTotalMissionHours : 24" />
        </div>
    </div>
</template>

<script>
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useWizardStore} from '../../store/modules/WizardStore'
import {AgentGraph} from '../graphs'
import {StringFormatter} from '../../javascript/utils'

export default {
    panelTitle: 'Agent Explorer',
    modes: ['sim', 'kiosk'],
    components: {
        AgentGraph,
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
        const {activePanels, data} = storeToRefs(dashboard)
        const {getTotalMissionHours} = storeToRefs(wizard)
        return {activePanels, getTotalMissionHours, activeData: data}
    },
    data() {
        return {
            agent: '',
            category: '',
        }
    },
    computed: {
        agents() {
            return Object.keys(this.activeData)
        },
        categories() {
            let categories = ['storage', 'flows', 'growth', 'deprive']
            if (this.agent in this.activeData) {
                categories = categories.filter(s => s in this.activeData[this.agent])
            }
            return categories
        }
    },
    mounted() {
        const [_, activeAgent, activeCategory] = this.activePanels[this.panelIndex].split(':', 2)
        if (activeAgent) {
            this.agent = activeAgent
        } else {
            this.agent = this.agents.length > 0 ? this.agents[0] : ''
        }
        if (activeCategory) {
            this.category = activeCategory
        } else {
            this.category = this.categories.length > 0 ? this.categories[0] : ''
        }
    },
    methods: {
        stringFormatter: StringFormatter,

        updateSection() {
            // tell dashboard/Main.vue that we changed panel section,
            // so that it can update the list of activePanels
            this.$emit('panel-section-changed', this.panelIndex, `${this.agent}:${this.category}`)
        }
    },
    watch: {
        agent() {
            this.updateSection()
        },
        category() {
            this.updateSection()
        },
        activePanels() {
            // update section when the user clicks on the reset panels button of the dashboard menu
            console.log(this.activePanels[this.panelIndex])
            this.agent = this.activePanels[this.panelIndex].split(':')[1]
            this.category = this.activePanels[this.panelIndex].split(':')[2]
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
