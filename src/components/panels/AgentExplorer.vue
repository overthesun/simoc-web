<template>
    <div class="panel-graph">
        <div>
            <select required @change="handleSelectAgent($event)">
                <option v-for="a in agents" :key="`${panelIndex}-select-agent-${a}`" :selected="agent === a"
                        :value="a">{{stringFormatter(a)}}</option>
            </select>
            <select v-model="category" required>
                <option v-for="c in categories" :key="`${panelIndex}-select-cat-${c}`" :selected="category === c"
                        :value="c">{{stringFormatter(c)}}</option>
            </select>
        </div>
        <div v-if="(agent && category)" class="chart-area">
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
    modes: ['sim'],
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
            validCategories: ['storage', 'flows', 'growth', 'deprive'],
        }
    },
    computed: {
        agents() {
            return Object.keys(this.activeData).filter(a => {
                // Exclude agents without any valid categories, e.g. 'atmosphere_equalizer'
                return this.validCategories.some(c => c in this.activeData[a])
            })
        },
        categories() {
            if (this.agent in this.activeData) {
                return this.validCategories.filter(c => c in this.activeData[this.agent])
            } else {
                return []
            }
        },
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
            this.setFromActivePanels()
        },
    },
    mounted() {
        this.setFromActivePanels()
    },
    methods: {
        stringFormatter: StringFormatter,

        setFromActivePanels() {
            const panel = this.activePanels[this.panelIndex].split(':')[1]
            const [activeAgent, activeCategory] = panel ? panel.split('/') : ['', '']
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

        handleSelectAgent(e) {
            const agent = e.target.value
            this.agent = agent
            this.category = this.validCategories.find(c => c in this.activeData[agent])
        },

        updateSection() {
            // tell dashboard/Main.vue that we changed panel section,
            // so that it can update the list of activePanels
            this.$emit('panel-section-changed', this.panelIndex, `${this.agent}/${this.category}`)
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
.chart-area {
    /* see https://github.com/chartjs/Chart.js/issues/4156#issuecomment-295180128 */
    min-width: 0;
    min-height: 0;
}
</style>
