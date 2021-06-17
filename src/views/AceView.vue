<!-- Container for all ace-related components -->

<template>
    <div class='ace-wrapper'>
        <div class='ace-main'>
        <div class='ace-header'>
            <AceHeader />
        </div>
        <div class='ace-section-nav'>
            <AceSectionNav 
                v-bind:sections="sections" 
                v-bind:activeSection="activeSection"
                v-on:setActiveSection="activeSection = $event"
            />
        </div>
        <div class='ace-body'>
            <div class="ace-agent-nav">
                <AceAgentNav 
                    v-bind:agents="agents" 
                    v-bind:activeAgent="activeAgent"
                    v-on:setActiveAgent="activeAgent = $event"
                />
            </div>
            <div class="ace-display">
                <AceDisplay 
                    v-bind:agentData="agentData"
                />
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import {AceAgentNav,AceDisplay,AceHeader,AceSectionNav} from '../components/ace'
import agent_desc from "../../agent_desc.json"

export default {
    components: {
        'AceAgentNav': AceAgentNav,
        'AceDisplay': AceDisplay,
        'AceHeader': AceHeader,
        'AceSectionNav': AceSectionNav
    },
    data() {
        return{
            startingData: {},
            sections: [],
            activeSection: "",
            activeAgent: "",
        }
    },
    created() {
        this.startingData = agent_desc
        this.sections = Object.keys(agent_desc)
        this.activeSection = this.sections[0]
    },
    computed: {
        agents: function() {
            if (!this.activeSection) {
                return ""
            } else {
                return Object.keys(this.startingData[this.activeSection])
            }
        },
        agentData: function() {
            if (!this.activeAgent) {
                return ""
            } else {
                return this.startingData[this.activeSection][this.activeAgent]
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .ace-wrapper{
        height: 100vh;
        width: 100vw;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        align-content: flex-start;
        justify-content: start;
    }

    .ace-main{
        padding: 20px 60px;
    }

    .ace-header{
        width: 100%;
    }

    .ace-body{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

    .ace-agent-nav{
        width: 200px;
        border: 1px solid #eee
    }

    .ace-display{
        width: 100%;
        border: 1px solid #eee;
    }

</style>

<style lang="scss">
    .btn-normal{
        margin: 2px 4px;
        border-radius: 8px;
        padding: 4px 16px;
        font-size: 14px;
        font-weight: 600;
        background-color: #0099ee;
        border:none;
        color: #eee;

        &:hover{
            cursor: pointer;
        }

        &:focus{
            outline:none;
        }
    }

    .btn-warning{
        background-color: red;
    }

</style>