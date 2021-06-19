<!-- Container for all ace-related components -->

<template>
    <div class='ace-wrapper'>
        <TheTopBar />
        <!-- Show the ACE menu component when getMenuActive is true. -->
        <AceMenu v-if="getMenuActive" />

        <div class='ace-main'>
            <header>ADVANCED CONFIGURATION EDITOR</header> 

            <hr class="rule">

            <AceSectionNav
                v-bind:sections="sections" 
                v-bind:activeSection="activeSection"
                v-on:setActiveSection="activeSection = $event"
            />

            <AceAgentNav
                v-bind:agents="agents" 
                v-bind:activeAgent="activeAgent"
                v-on:setActiveAgent="activeAgent = $event"
            />

            <hr class="rule">

            <AceDisplay
                v-bind:activeSection="activeSection"
                v-bind:activeAgent="activeAgent"
                v-bind:agentData="agentData"
                v-on:agentData="modifyWorking($event)"
            />
        </div>
    </div>
</template>

<script>
import {TheTopBar} from '../components/bars'
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {AceMenu,AceAgentNav,AceDisplay,AceHeader,AceSectionNav} from '../components/ace'
import agentDesc from '../../agent_desc.json'

export default {
    components: {
        'TheTopBar': TheTopBar,
        'AceMenu': AceMenu,
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
        ...mapGetters('dashboard', ['getMenuActive']),

        // Return agents based on selected section
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
        min-height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-content: flex-start;
        justify-content: flex-start;
    }

    .ace-main{
        // Copied '.configuration-wrapper' from BaseConfiguration.vue
        position: relative;
        height: 100%;
        width: 80vw;
        max-width: 1200px;
        margin: auto;
        margin-top: 20px;
        // display: grid;
        // grid-template-columns: 50% 50%;
        // grid-template-rows: minmax(0,1fr);
        box-sizing: border-box;
        background-color: #1e1e1eaa;
        border: 1px solid #666;
        border-radius: 5px;

        // Added for ACE
        padding:16px;
    }

    // Copied from BaseConfiguration.vue
    header {
        font-family: "Nasalization", "Open Sans", sans-serif;
        font-weight: 200;
        font-size: 22px;
        display:flex;
        justify-content:flex-start;
        align-items:center;
        position:relative;

        //Added for ACE
        height: auto;

    }

    .rule {
        margin-top: 8px;
        color: #999
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