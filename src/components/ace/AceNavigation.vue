<template>
    <div class="ace-nav-wrapper">
        <div v-for="section in sections" :key="section">
            <div 
                class='section' 
                :class="{'section-active': section === activeSection}" 
                @click="toggle(section)">
                {{ stringFormatter(section) }}
            </div>
            <div class="menu" :class="{'menu-open': isOpen[section]}" >
                <div v-for="agent in Object.keys(agentDesc[section])" :key="section+agent" class="agent-wrapper">
                    <div 
                        class="agent" 
                        @click="handleAgent(section, agent)" 
                        :class="{'agent-active': agent === activeAgent}">
                        <fa-layers 
                            class="fa-1x agent-icon-remove" 
                            @click="handleRemoveAgent(section, agent)" 
                            :class="{'hidden': section === 'simulation_variables'}">
                            <fa-icon :icon="['fas','trash']" mask="circle" transform="shrink-7" />
                        </fa-layers>
                        <span class="agent-label">{{ stringFormatter(agent) }}</span>
                    </div>
                </div>
                <fa-layers 
                    class="fa-1x agent-icon-add" 
                    @click="handleAddAgent(section)"
                    :class="{'hidden': section === 'simulation_variables'}">
                    <fa-icon :icon="['fas','plus-circle']" />
                </fa-layers>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations} from 'vuex'
import {StringFormatter} from '../../javascript/utils'

export default {
    data() {
        return{
            isOpen: {},
        }
    },
    computed: {
        ...mapGetters('ace', {
            agentDesc: 'getActiveAgentDesc',
            sections: 'getSections',
            activeSection: 'getActiveSection',
            activeAgent: 'getActiveAgent',
            editorValid: 'getEditorValid'
        }),
    },
    mounted() {
        this.sections.forEach(section => {
            this.$set(this.isOpen, section, false)
        })
    },
    methods: {
        ...mapMutations('ace',['SETACTIVEAGENT', 'SETACTIVESECTION', 'ADDAGENT', 'REMOVEAGENT']),

        stringFormatter: StringFormatter,

        toggle: function(section) {
            this.$set(this.isOpen, section, !this.isOpen[section])
        }, 

        handleAgent: function(section, agent) {
            if (!this.editorValid) {
                // If user doesn't confirm, return without changing screens
                if (!confirm("The current agent configuration is invalid. Revert changes?")) {
                    return
                }
            }
            this.SETACTIVESECTION(section)
            this.SETACTIVEAGENT(agent)
        },

        handleAddAgent: function(section) {
            this.ADDAGENT(section)
        },

        handleRemoveAgent: function(section, agent) {
            if (confirm(`Are you sure you want to remove '${agent}'?`)) {
                this.REMOVEAGENT({section: section, agent: agent})
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.hidden {
    display: none;
}

.ace-nav-wrapper {
    position: relative;
    width: inherit;
    overflow-y: auto;
    height: auto;
}

.section {
    padding: 5px 5px 5px 0;
    text-align: left;
    color: #eee;
    font-size: 1.2em;
    font-weight: 400;
    
    &:hover {
        cursor: pointer;
        background-color: rgba(238, 238, 238, 0.2);
    }

    &-active {
        color: lightgreen;
    }
}

.menu {
    max-height: 0;
    overflow: hidden;
    transition: 0.5s ease all; 

    &-open {
        max-height: 1000px; 
        overflow: hidden;
    }
} 

.agent {
    padding: 5px;
    text-align: left;
    color: #eee;
    font-size: 1em;
    font-weight: 200;
    padding: 5px 25px 5px 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    
    &:hover {
        cursor: pointer;
        background-color: rgba(238, 238, 238, 0.2);
    }

    &-active {
        font-weight: 400px;
        background-color: rgba(238, 238, 238, 0.4);
    }
}

.agent-label {
    width: 150px;
}

.agent-icon-add {
    color: rgba(238, 238, 238, 0.6);
    font-size: 1.5em; 
    margin: 5px;
    
    &:hover {
        color: #eee;
        cursor: pointer;
    }
}

.agent-icon-remove {
    color: rgba(238, 238, 238, 0.6);
    font-size: 1.5em;
    margin-right: 15px;

    &:hover {
        color: #eee;
        cursor: pointer;
    }
}
</style>
