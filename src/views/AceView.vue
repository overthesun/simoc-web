<!-- Container for all entry related components -->

<template>
    <div>
        <TheTopBar />
        <div class="ace-view-container">
            <AgentSelector :active-agent="activeAgent" :set-active-agent="setActiveAgent" />
            <AgentEditor />
        </div>
    </div>
</template>

<script>
import {storeToRefs} from 'pinia'
import {useAceStore} from '../store/modules/AceStore'
import {TheTopBar} from '../components/bars'
import {AgentSelector, AgentEditor} from '../components/ace'

export default {
    components: {TheTopBar, AgentSelector, AgentEditor},
    setup() {
        const ace = useAceStore()
        const {loadDefaultAgentDesc, getAgentClasses, getAgentsInClass, getAgentData} = ace
        loadDefaultAgentDesc()
        const {agent_desc} = storeToRefs(ace)
        return {
            agent_desc, getAgentClasses, getAgentsInClass, getAgentData,
        }
    },
    data() {
        return {
            activeAgent: null,
        }
    },
    methods: {
        setActiveAgent(agentName) {
            this.activeAgent = agentName
        },
    },
}
</script>

<style lang="scss" scoped>
.ace-view-container {
    width: 100vw;
    height: 100vh;
    min-width: 100vw;
    min-height: 100vh;
    overflow:hidden;
    position:relative;
    background: transparent;
}
</style>
