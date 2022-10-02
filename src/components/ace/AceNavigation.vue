<template>
    <div class="ace-nav-wrapper">
        <div v-for="section in sections" :key="section">
            <div :class="{'section-active': section === activeSection}"
                 class="section" @click="toggle(section)">
                {{stringFormatter(section)}}
            </div>
            <div :class="{'menu-open': isOpen[section]}" class="menu">
                <div v-for="agent in Object.keys(agentDesc[section])" :key="section+agent" class="agent-wrapper">
                    <div :class="{'agent-active': agent === activeAgent}"
                         class="agent" @click="handleAgent(section, agent)">
                        <fa-layers :class="{'hidden': section === 'simulation_variables'}"
                                   class="fa-1x agent-icon-remove" @click="handleRemoveAgent(section, agent)">
                            <fa-icon :icon="['fa-solid','trash']" mask="circle" transform="shrink-7" />
                        </fa-layers>
                        <span class="agent-label">{{stringFormatter(agent)}}</span>
                    </div>
                </div>
                <fa-layers :class="{'hidden': section === 'simulation_variables'}"
                           class="fa-1x agent-icon-add" @click="handleAddAgent(section)">
                    <fa-icon :icon="['fa-solid','circle-plus']" />
                </fa-layers>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {StringFormatter} from '../../javascript/utils'

export default {
    data() {
        return {
            isOpen: {},
        }
    },
    computed: {
        ...mapGetters('ace', {
            agentDesc: 'getActiveAgentDesc',
            sections: 'getSections',
            activeSection: 'getActiveSection',
            activeAgent: 'getActiveAgent',
            editorValid: 'getEditorValid',
        }),
    },
    mounted() {
        this.sections.forEach(section => {
            this.isOpen[section] = !this.isOpen[section]
        })
    },
    methods: {
        ...mapMutations('ace', ['SETACTIVEAGENT', 'SETACTIVESECTION', 'ADDAGENT', 'REMOVEAGENT']),
        ...mapActions('modal', ['confirm']),

        stringFormatter: StringFormatter,

        toggle(section) {
            this.isOpen[section] = !this.isOpen[section]
        },

        handleAgent(section, agent) {
            const revert = () => {
                this.SETACTIVESECTION(section)
                this.SETACTIVEAGENT(agent)
            }
            if (!this.editorValid) {
                this.confirm({
                    message: 'The current agent configuration is invalid. Revert changes?',
                    confirmCallback: () => revert(),
                })
            } else {
                revert()
            }
        },

        handleAddAgent(section) {
            this.ADDAGENT(section)
        },

        handleRemoveAgent(section, agent) {
            this.confirm({
                message: `Are you sure you want to remove '${agent}'?`,
                confirmCallback: () => this.REMOVEAGENT({section, agent}),
            })
        },
    },
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
