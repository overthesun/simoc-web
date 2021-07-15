<template>
    <div>
        <div :class="{'hidden': (isBuilt)}" class="empty=msg">
            Loading editor schema...
        </div>
        <div :class="{'hidden': (activeAgent || !isBuilt)}" class="empty-msg">
            Select an agent to get started.
        </div>
        <div :class="{'hidden': activeAgent === null}" class="editor">
            <div id="agentEditor" :class="{'hidden': isCustomAgent}" />
            <div id="customEditor" :class="{'hidden': !isCustomAgent}" />
        </div>
    </div>
</template>

<script>
import {JSONEditor} from '@json-editor/json-editor'
import {mapState, mapGetters, mapMutations} from 'vuex'
import {formatEditor} from './formatEditor'

// The json-editor validation function is used to set a
// flag in the vuex store. The navigation components use
// this flag to alert the user if they are changing screens
// with unsaved data.
//
// Because some fields are required, setting the editor to
// empty would result in a validation error. For this reason
// we use the following placeholders to set 'empty' editor.
const editorNames = ['agentEditor', 'customEditor']
const editorPlaceholder = editorName => {
    switch (editorName) {
        case 'agentEditor':
            return {name: 'empty'}
        case 'customEditor':
            return []
        default:
            return {}
    }
}
const placeholderValues = editorNames.map(e => JSON.stringify(editorPlaceholder(e)))

export default {
    data() {
        return {
            // Editor is built once when watcher gets a valid agentSchema
            isBuilt: false,
            // These fields don't use the agent schema
            customFields: ['global_variables', 'currencies_of_exchange'],
        }
    },
    computed: {
        ...mapGetters('ace', {
            agentSchema: 'getAgentSchema',
            currencies: 'getCurrencies',
            activeSection: 'getActiveSection',
            activeAgent: 'getActiveAgent',
            agentData: 'getActiveAgentData',
        }),
        isCustomAgent() {
            return this.customFields.includes(this.activeAgent)
        },
    },
    watch: {
        // Load editors once, if and when a valid agentSchema appears in the store.
        // ('agent_schema' and 'agent_desc' loaded async by parent component, AceView.vue)
        agentSchema(newSchema, oldSchema) {
            // Only build once
            if (this.isBuilt || Object.keys(newSchema).length === 0) {
                return
            }
            this.isBuilt = true
            const agent_schema = JSON.parse(JSON.stringify(newSchema))

            // Add 'currencies_of_exchange' list to schema
            // TODO: Update schema as list of currencies changes. JSON-editor
            // doesn't have a built-in function to update schema.
            agent_schema.agent.definitions.type.enum = this.currencies

            // Validate new currency names
            JSONEditor.defaults.custom_validators.push((schema, value, path) => {
                const errors = []
                if (path === 'root.name') {
                    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                        errors.push({
                            path: path,
                            property: 'format',
                            message: 'Agent names must be alphanumeric and/or "_"',
                        })
                    }
                }
                return errors
            })
            this.loadEditor('agentEditor', agent_schema.agent)
            this.loadEditor('customEditor', agent_schema.custom)
        },

        // Reload editor when activeAgent changes
        activeAgent(newAgent, oldAgent) {
            if (!this.agentData) {
                // After deleting an agent, activeAgent is set to null
                // and then (somehow?) set back to the deleted agent.
                // This section compensates for that.
                this.SETACTIVEAGENT(null)
                return
            }
            // Ignore agents before editor is built
            if (!this.isBuilt) {
                return
            }
            const custom = this.customFields.includes(newAgent)
            const active = (custom) ? 'customEditor' : 'agentEditor'
            let newData
            if (newAgent) {
                newData = this.parseAgentData(this.agentData)
            } else {
                newData = editorPlaceholder(active)
            }
            this[active].setValue(newData)

            const inactive = (custom) ? 'agentEditor' : 'customEditor'
            this[inactive].setValue(editorPlaceholder(inactive))
        },
    },
    methods: {
        ...mapMutations('ace', ['UPDATEAGENT', 'SETEDITORVALID',
                                'UPDATEAGENTNAME', 'SETACTIVEAGENT']),

        loadEditor(editorName, schema) {
            let options = {
                schema: schema,
                theme: 'html',
                disable_properties: true,
                remove_empty_properties: true,
            }
            if (editorName === 'agentEditor') {
                options = {
                    ...options,
                    required_by_default: false,
                    show_opt_in: true,
                    startval: editorPlaceholder('agentEditor'),
                }
            } else if (editorName === 'customEditor') {
                options = {
                    ...options,
                    disable_collapse: true,
                    disable_edit_json: true,
                    array_controls_top: true,
                    form_name_root: '',
                    startval: editorPlaceholder('customEditor'),
                }
            }
            this[editorName] = new JSONEditor(document.getElementById(editorName), options)
            this[editorName].on('change', () => {
                const value = this[editorName].getValue()
                const errors = this[editorName].validate()
                // If it's empty, set to valid
                if (placeholderValues.includes(JSON.stringify(value))) {
                    this.SETEDITORVALID(true)
                // If there's an error, set to invalid
                } else if (errors.length) {
                    this.SETEDITORVALID(false)
                // Otherwise, update state and set to valid
                } else {
                    this.SETEDITORVALID(true)
                    // Name value is one level up in the hierarchy, so update store
                    if (editorName !== 'customEditor' && value.name !== this.activeAgent) {
                        this.UPDATEAGENTNAME({
                            section: this.activeSection,
                            oldName: this.activeAgent,
                            newName: value.name,
                        })
                    }
                    // Update data
                    this.UPDATEAGENT({
                        section: this.activeSection,
                        agent: this.activeAgent,
                        data: this.unparseAgentData(value, editorName),
                    })
                }
                // Re-apply formatting as editor layout changes
                formatEditor(editorName)
            })
        },

        // Reshape data from agent_desc to fit schema
        parseAgentData(data) {
            if (placeholderValues.includes(data)) {
                return {}
            } else if (this.isCustomAgent) {
                // Convert currencies and global variables to array
                const asArray = []
                Object.keys(data).forEach(key => {
                    asArray.push({type: key, value: data[key]})
                })
                return asArray
            } else {
                // Move three sets of fields to the same level
                const dd = data.data
                const fields = Object.keys(dd)
                return {
                    name: this.activeAgent,
                    description: Object.keys(data).includes('description') ? data.description : '',
                    input: fields.includes('input') ? dd.input : {},
                    output: fields.includes('output') ? dd.output : {},
                    characteristics: fields.includes('characteristics') ? dd.characteristics : {},
                }
            }
        },

        // Reshape editor data back to fit agent_desc
        unparseAgentData(data) {
            if (placeholderValues.includes(data)) {
                return {}
            } else if (this.isCustomAgent) {
                const asObject = {}
                data.forEach(({type, value}) => {
                    asObject[type] = value
                })
                return asObject
            } else {
                return {
                    description: Object.keys(data).includes('description') ? data.description : '',
                    data: {
                        input: data.input,
                        output: data.output,
                        characteristics: data.characteristics,
                    },
                }
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.hidden {
    display: none;
}
</style>

<style lang="scss">
/*
Fields are updated dynamically by editor.
CSS wouldn't normally be applied after each update.
The added 'editor-xx' class (added by formatEditor())
and 3-level selector ensures they are updated with
each editor change.
*/
div div .je-indented-panel.editor-panel {
    margin: 0;
    padding-left: 0;
    border: 0;
}

div div .je-tabholder.editor-tabholder {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    margin-top: -28px;
    overflow-y: hidden;
    overflow-x: auto;
}

div div .je-tab.editor-tab {
    color: black;
    border-radius: 5px 5px 0 0;
    padding: 5px;
    font-size: 1em;
    font-weight: 400;
    line-height: 1em;
    border: 1px solid #eee;
    background-color: rgba(238, 238, 238, 0.6);
}

div div .content.editor-content {
    margin-top: 40px;
    padding: 16px;
    border: 1px solid #eee
}

div div button.editor-button {
    padding: 3px 8px;
    color: #eee;
    background-color: transparent;
    border: 1px solid #eee;
    border-radius: 3px;

    &:hover {
        cursor: pointer;
        background-color: rgba(238, 238, 238, 0.2);
    }
}

div div .je-form-input-label.editor-field, div h3 .editor-field {
    font-size: 1em;
    font-weight: 200;
    margin: 0;
}

.je-header {
    margin: 0;
}

.form-control {
    display: flex;
    flex-direction: row;
}

.je-form-input-label + input, .je-form-input-label + select {
    position: absolute;
    left: 200px;
}

.errmsg {
    position: absolute;
    left: 400px;
}
</style>
