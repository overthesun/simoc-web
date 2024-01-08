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
            <AgentGraph :id="'canvas-pc-' + canvasNumber"
                        :agent="agent" :category="category" :plotted-items="plottedItems"
                        :fullscreen="fullscreen" :nsteps="fullscreen ? getTotalMissionHours : 24"
                        @plotted-items-changed="updatePlottedItems" />
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
        panelSection: {type: String, default: undefined},
        plottedItems: {type: String, default: undefined},
        fullscreen: {type: Boolean, default: false},
    },
    emits: ['panel-section-changed'],
    setup() {
        const dashboard = useDashboardStore()
        const wizard = useWizardStore()
        const {activePanels, data} = storeToRefs(dashboard)
        const {parseAttributes} = dashboard
        const {getTotalMissionHours} = storeToRefs(wizard)
        return {activePanels, parseAttributes, getTotalMissionHours, activeData: data}
    },
    data() {
        return {
            agent: '',
            category: '',
            validCategories: ['storage', 'flows', 'growth', 'deprive', 'attributes'],
        }
    },
    computed: {
        agents() {
            return Object.keys(this.activeData).filter(a => (
                // Exclude agents without any valid categories, e.g. 'atmosphere_equalizer'
                this.validCategories.some(c => c in this.activeData[a])
            ))
        },
        categories() {
            // As of June 2023, 'growth' and 'deprive' were combined along with
            // all other dynamic variables in simoc_abm into the field
            // 'attributes', but we still want to treat them separately here
            // for clarity and ease of use. The 'parseAttributes' method was
            // added to the DashboardStore and is used here and in AgentGraph
            // for this purpose. Attributes not in the 'growth' or 'deprive'
            // categories are added to a new category just called 'attributes'.
            let categories = []
            if (this.agent in this.activeData) {
                const agentData = this.activeData[this.agent];
                ['storage', 'flows'].forEach(cat => {
                    if (agentData[cat]) {
                        categories.push(cat)
                    }
                })
                if (agentData.attributes) {
                    const attrCats = this.parseAttributes(Object.keys(agentData.attributes))
                    categories = categories.concat(Object.keys(attrCats))
                }
            }
            return categories
        },
    },
    watch: {
        agent(newVal, oldVal) {
            this.updateSection(newVal, oldVal)
        },
        category(newVal, oldVal) {
            this.updateSection(newVal, oldVal)
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
            const [activeAgent, activeCategory] = panel ? panel.split('|') : ['', '']
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

        updateSection(newVal, oldVal) {
            // tell dashboard/Main.vue that we changed panel section,
            // so that it can update the list of activePanels
            if (oldVal === undefined) {
                return  // don't emit when loading the panel for the first time
            }
            this.$emit('panel-section-changed', this.panelIndex,
                       `${this.agent}|${this.category}`, undefined)
        },
        updatePlottedItems(plottedItems) {
            this.$emit('panel-section-changed', this.panelIndex,
                       `${this.agent}|${this.category}`, plottedItems)
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
