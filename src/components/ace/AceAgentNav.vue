<template>
    <div class='agent-nav'>
        <div v-for='agent in getActiveAgents' :key='agent' class='agent-group'>
            <button 
                class='btn-agent' 
                @click="handleChangeAgent(agent)"
                :class="{ 'btn-agent-active' : agent === getActiveAgent}"
            >{{ formatAgent(agent) }}</button>
            <div class="remove-agent-group" :class="{'hidden' : getActiveSection === 'simulation_variables'}">
                <span title='Remove Agent' class="fa-1x remove-agent-icon">
                    <fa-icon icon="trash" @click="handleRemoveAgent(agent)" />
                </span>
                <div id="circle"></div>
            </div>
        </div>
        <span title='Add Agent' class="fa-2x add-agent-icon" :class="{'hidden' : getActiveSection === 'simulation_variables'}">
            <fa-icon icon="plus-circle" @click="handleAddAgent" />
        </span>
    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations} from 'vuex'

export default {
    computed: {
        ...mapGetters('ace', ['getActiveSection', 'getActiveAgents', 'getAgents', 'getActiveAgent', 'getEditorValid'])
    },
    methods: {
        ...mapMutations('ace', ['SETACTIVEAGENT', 'ADDAGENT', 'REMOVEAGENT']),

        handleChangeAgent: function(agent) {
            let valid = this.getEditorValid
            if (!valid) {
                if (confirm("The current agent configuration is invalid. Abandon changes?")) {
                    this.SETACTIVEAGENT(agent)
                }
            } else {
                this.SETACTIVEAGENT(agent)
            }
        },

        handleAddAgent: function(agent) {
            console.log("Add agent")
            this.ADDAGENT(this.getActiveSection)
        },

        handleRemoveAgent: function(agent) {
            if (confirm("Are you sure you want to remove this agent?")) {
                this.REMOVEAGENT({
                    section: this.getActiveSection, 
                    agent: agent
                })
            }
        },

        formatAgent: function(text) {
            let split = text.split("_")
            let cased = split.map(word => word.charAt(0).toUpperCase() + word.slice(1))
            return cased.join(" ")
        }
    }
}
</script>

<style lang="scss" scoped>

    .hidden {
        display: none;
    }

    .agent-nav {
        font-family: "Roboto", sans-serif;
        font-size: 14px;
        display: flex;
        flex-wrap: wrap;
        margin: 0;
        padding: 0;
        // box-sizing: border-box;
    }

    .agent-group {
        position: relative;
    }

    .btn-agent {
        position: relative;
        font-size: 14px;
        font-weight: 800; 
        padding: 5px 10px;
        margin: 3px 3px;
        border: none;
        border-radius: 12px;
        color: black;
        background-color: rgb(154,154, 154);
        box-sizing: border-box;
        z-index: 15;

        &:hover{
            background-color: #eee;
            cursor: pointer;
            z-index: 5;
        }

        &-active{
            background-color: lightgreen;
        }
    }

    .remove-agent-group {
        position: absolute;
        right: 8px;
        top: 8px;
        z-index: 10;
        &:hover{
            z-index: 20;
            cursor: pointer;
        }
    }

    #circle {
        position: absolute;
        background: rgb(154,154, 154);
        border-radius: 50%;
        top: -2px;
        right: -2px;
        width: 20px;
        height: 20px;
        z-index: 10;
        :hover > & {
            background: #eee
        }
    }

    .remove-agent-icon {
        position: absolute;
        right: -2px;
        top: 0px;
        color: black;
        height: 0.8em;
        width: 0.8em;
        margin: 0 5px;
        z-index: 100;
    }

    .add-agent-icon {
        color: rgba(238, 238, 238, 0.6);
        height: 1em;
        width: 1em;
        margin-left: 5px;

        &:hover{
            color: #eee;
            cursor: pointer;
        }
    }
</style>