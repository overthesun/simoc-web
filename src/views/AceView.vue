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
                    v-bind:activeSection="activeSection"
                    v-bind:activeAgent="activeAgent"
                    v-bind:agentData="agentData"
                    v-on:agentData="modifyWorking($event)"
                />
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import {AceAgentNav,AceDisplay,AceHeader,AceSectionNav} from '../components/ace'
import agentDesc from "../../agent_desc.json"

export default {
    components: {
        'AceAgentNav': AceAgentNav,
        'AceDisplay': AceDisplay,
        'AceHeader': AceHeader,
        'AceSectionNav': AceSectionNav,
    },
    data() {
        return{
            // Maintain a working copy of the data and an unedited version for reset
            startingData: {},
            workingData: {},

            // Data to be passed as props
            sections: [],
            activeSection: null,
            activeAgent: null,
            agentData: null,
        };
    },
    created() {
        // Load default data
        this.startingData = agentDesc
        this.workingData = agentDesc  
        this.sections = Object.keys(agentDesc)
        this.activeSection = this.sections[0]
    },
    watch: {
        // Reset editor (to empty) when changing sections
        activeSection: function(newSection, oldSection) {
            this.activeAgent = null
        },

        // Load data to editor when agent is selected
        activeAgent: function(newAgent, oldAgent) {
            this.activeAgent = newAgent
            if (!newAgent) {
                this.agentData = null
            } else {
                this.agentData = this.workingData[this.activeSection][newAgent].data
            }
        }
    },
    computed: {
        agents: function() {
            if (!this.activeSection) {
                return ""
            } else {
                return Object.keys(this.startingData[this.activeSection])
            }
        },
    },
    methods: {
        // Update the working copy of the data
        modifyWorking: function(modified) {
            if (modified.section && modified.agent) {
                this.workingData[modified.section][modified.agent].data = modified.data
            }
        }
    },
};
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