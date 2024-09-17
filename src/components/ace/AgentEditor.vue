<template>
    <div class="agent-editor">
        {{activeAgent}}
        <!-- Render agentData nicely -->
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
    },
    setup() {
        const ace = useAceStore()
        const {getAgentData} = ace
        return {getAgentData}
    },
    data() {
        return {
            agentData: null,
        }
    },
    watch: {
        activeAgent(val) {
            if (val) {
                this.agentData = this.getAgentData(val)
            } else {
                this.agentData = null
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.agent-editor {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: #f5f5f5;
}
</style>
