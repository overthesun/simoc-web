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

// The json-editor validation function is used to set a 
// flag in the vuex store. The navigation components use
// this flag to alert the user if they are changing screens
// with unsaved data.
//
// Because some fields are required, setting the editor to
// empty would result in a validation error. For thsi reason 
// we use the following placeholders to set 'empty' editor.
const editorNames = ['agentEditor', 'customEditor']
const editorPlaceholder = (editorName) => {
    switch (editorName) {
        case 'agentEditor': return {name: 'empty'}
        case 'customEditor': return []
        default: return {}
    }
}
const placeholderValues = editorNames.map(e => JSON.stringify(editorPlaceholder(e)))

export default {
    data() {
        return {
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
            var options = {
                schema: schema,
                theme: 'html',
                disable_properties: true,
                remove_empty_properties: true,
            }
            if (editorName === 'agentEditor') {
                options = {...options, 
                    required_by_default: false,
                    show_opt_in: true,
                    startval: editorPlaceholder('agentEditor')
                }
            } else if (editorName === 'customEditor') {
                options = {...options,
                    disable_collapse: true,
                    disable_edit_json: true,
                    array_controls_top: true,
                    form_name_root: "",
                    startval: editorPlaceholder('customEditor')
                }
            }
            this[editorName] = new JSONEditor(document.getElementById(editorName), options)
            this[editorName].on('change', () => {
                let value = this[editorName].getValue()
                let errors = this[editorName].validate()
                // If it's empty, set to valid
                if (placeholderValues.includes(JSON.stringify(value))) {
                    this.SETEDITORVALID(true)
                // If there's an error, set to invalid
                } else if (errors.length) {
                    this.SETEDITORVALID(false)
                    errors.forEach(error => {
                        console.log(error)
                    })
                // Otherwise, update state and set to valid
                } else {                    
                    let payload = {
                        section: this.activeSection,
                        agent: this.activeAgent,
                        data: this.unparseAgentData(value, editorName)
                    }
                    this.UPDATEAGENT(payload)
                    this.SETEDITORVALID(true)
                }
            })
        },

        // Reshape data from agent_desc to fit schema
        parseAgentData: function(data) {
            if (placeholderValues.includes(data)) {
                return {}
            } else if (this.customAgent) {
                // Convert currencies and global variables to array
                var asArray = []
                Object.keys(data).forEach(key => {
                    asArray.push({type: key, value: data[key]})
                })
                return asArray
            } else {
                // Move three sets of fields to the same level
                return {
                    name: this.activeAgent,
                    description: (Object.keys(data).includes('description')) ? data.description : "",
                    input: data.data.input,
                    output: data.data.output,
                    characteristics: data.data.characteristics
                }
            }
        },

        // Reshape editor data back to fit agent_desc
        unparseAgentData: function(data) {
            if (placeholderValues.includes(data)) {
                return {}
            } else if (this.customAgent) {
                var asObject = {}
                console.log(data)
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
            let active = (this.customAgent) ? 'customEditor' : 'agentEditor'
            let inactive = (this.customAgent) ? 'agentEditor' : 'customEditor'
            let newData = (newAgent) ? this.parseAgentData(this.agentData) : editorPlaceholder(active)
            this[active].setValue(newData)
            this[inactive].setValue(editorPlaceholder(inactive))
        },

        // TODO
        // Update agentEditor schema dynamically to match the currencies list.
        //
        // // Update currencies in schema when new currencies added
        // currencies: function(newCurrencies, oldCurrencies) {
        //     agent_schema.agent.definitions.type.enum = newCurrencies
        //     this.loadEditor('agentEditor', agent_schema.agent)
        // }
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
