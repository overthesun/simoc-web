<!-- Base menu component -->

<template>
    <div v-for="agentClass in agentClasses" :key="agentClass">
        <div>{{agentClass}}</div>
        <div v-for="agent in getAgentsInClass(agentClass)" :key="agent">
            <div>{{agent}}</div>
        </div>
    </div>
</template>

<script>
import {useAceStore} from '../../store/modules/AceStore'

export default {
    props: {
        activeAgent: {
            type: String,
            default: null,
        },
        setActiveAgent: {
            type: Function,
            default: null,
        },
    },
    setup() {
        const ace = useAceStore()
        const {getAgentClasses, getAgentsInClass} = ace
        return {getAgentClasses, getAgentsInClass}
    },
    data() {
        return {
            agentClasses: null,
        }
    },
    created() {
        this.agentClasses = this.getAgentClasses()
    },
}
</script>

<style lang="scss" scoped>
.agent-selector {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #f5f5f5;
}
</style>
