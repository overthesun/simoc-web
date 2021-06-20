<template>
    <div>
        <div class="empty-msg" :class="{ 'empty-msg-hidden' : (activeAgent) }">
            Select an agent to get started.
        </div>
        <div class='editor' :class="{ 'hidden' : activeAgent === null }">
            <div id='agentEditor' :class="{ 'hidden' : customAgent }"></div>
            <div id='customEditor' :class="{ 'hidden' : !customAgent }"></div>
        </div>
    </div>
</template>

<script>
import agent_schema from "../../../agent_schema.json"
import { JSONEditor } from '@json-editor/json-editor'
import {mapState,mapGetters,mapMutations} from 'vuex'

export default {
    data() {
        return {
            agentEditor: {},
            customEditor: {},
            // These fields don't use the agent schema
            customFields: ['global_variables', 'currencies_of_exchange'],
        }
    },
    computed: {
        ...mapGetters('ace', {
            currencies: 'getCurrencies',
            activeSection: 'getActiveSection',
            activeAgent: 'getActiveAgent',
            agentData: 'getActiveAgentData'
        }),
        customAgent: function() {
            return this.customFields.includes(this.activeAgent)
        }
    },
    methods: {
        ...mapMutations('ace', ['UPDATEAGENT', 'SETEDITORVALID']),

        loadEditor: function(editorName, schema) {
            var editor = this[editorName]
            var options = {
                schema: schema,
                theme: 'html',
                disable_properties: true,
                remove_empty_properties: true,
                startval: {}
            }
            if (editorName === 'agentEditor') {
                options = {...options, 
                    required_by_default: false,
                    show_opt_in: true
                }
            } else if (editorName === 'customEditor') {
                options = {...options,
                    disable_collapse: true,
                    disable_edit_json: true,
                    array_controls_top: true,
                    form_name_root: "",
                }
            }
            editor = new JSONEditor(document.getElementById(editorName), options)
            editor.on('change', () => {
                let errors = editor.validate()
                if (errors.length) {
                    // set invalid flag for navigation
                    this.SETEDITORVALID(false)

                    // TODO
                    // Editor is set to empty {} when switching screens, which
                    // fires an error.
                    // 
                    // errors.forEach(error => {
                    //     console.log(error)
                    // })
                } else {
                    // remove flag
                    this.SETEDITORVALID(true)

                    // update state
                    let payload = {
                        section: this.activeSection,
                        agent: this.activeAgent,
                        data: this.unparseAgentData(editor.getValue())
                    }
                    this.UPDATEAGENT(payload)
                }
            })
        },

        // Reshape data from agent_desc to fit schema
        parseAgentData: function(data) {
            if (Object.keys(data).length === 0) {
                return {}
            } else if (this.customAgent) {
                // Convert to array
                var asArray = []
                Object.keys(data).forEach(key => {
                    asArray.push({type: key, value: data[key]})
                })
                return asArray
            } else {
                // Three sets of fields moved to the same level
                return {
                    name: this.activeAgent,
                    description: (Object.keys(data).includes('description')) ? data.description : "",
                    input: data.data.input,
                    output: data.data.output,
                    characteristics: data.data.characteristics
                }
            }
        },

        // Reshape editor data to fit agent_desc
        unparseAgentData: function(data) {
            if (Object.keys(data).length === 0) {
                return {}
            } else if (this.customAgent) {
                var asObject = {}
                data.forEach(({type, value}) => {
                    asObject[type] = value
                })
                return asObject
            } else {
                return {
                    description: (Object.keys(data).includes('description')) ? data.description : "",
                    data: {
                        input: data.input,
                        output: data.output,
                        characteristics: data.characteristics
                    }
                }
            }
        }
    },
    mounted() {
        // currencies injected into schema
        agent_schema.agent.definitions.type.enum = this.currencies
        this.loadEditor('agentEditor', agent_schema.agent)
        this.loadEditor('customEditor', agent_schema.custom)
    },
    watch: {
        // Reload editor when activeAgent changes
        activeAgent: function(newAgent, oldAgent) {
            let newData = (newAgent) ? this.parseAgentData(this.agentData) : {}
            let active = (this.customAgent) ? 'customEditor' : 'agentEditor'
            let inactive = (this.customAgent) ? 'agentEditor' : 'customEditor'
            this[active].setValue(newData)
            this[inactive].setValue({})
        },
    },
}
</script>

<style lang="scss" scoped>

    .hidden {
        display: none;
    }

    .empty-msg {
        width: 100%;
        size: 14px;
        text-align: center;

        &-hidden{
            display: none;
        }
    }

</style>

<style lang="scss">
    // For the json-editor

    .je-header {
        margin: 0;
    }

    .content {
        margin-left: 120px;
    }

    .je-tab {
        color: black;
        font-weight: 400;
        background-color: #eee;
    }

    .form-control {
        display: flex;
        flex-direction: row;
    }

    .je-form-input-label + input{
        position: absolute;
        left: 200px;
    }

    .je-form-input-label + select{
        position: absolute;
        left: 200px;
    }

    .json-editor-btc-collapse { background-color: transparent }

    .json-editor-btn-subtract { display: none; }

    .json-editor-btntype-deleteall { display: none;}

</style>
