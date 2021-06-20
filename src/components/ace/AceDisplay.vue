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
    props: [
        'customFields'
    ],
    data() {
        return {
            workingSection: null,
            workingAgent: null,
            agentEditor: {},
        }
    },
    async mounted() {
        this.agentEditor = new JSONEditor(document.getElementById('agentEditor'),{
            schema: agent_schema.agent,
            theme: 'html',
            disable_properties: true,
            required_by_default: false,
            remove_empty_properties: true,
            show_opt_in: true,
            startval: {}
        });    
        this.customEditor = new JSONEditor(document.getElementById('customEditor'),{
            schema: agent_schema.custom,
            theme: 'html',
            disable_properties: true,
            remove_empty_properties: true,
            disable_collapse: true,
            disable_edit_json: true,
            array_controls_top: true,
            form_name_root: "",
            startval: {}
        });
    },
    computed: {
        ...mapGetters('ace', {
            agentData: 'getActiveAgentData',
            activeSection: 'getActiveSection',
            activeAgent: 'getActiveAgent'
        }),
        customAgent: function() {return this.isCustom(this.activeAgent)}
    },
    methods: {
        ...mapMutations('ace', ['UPDATEAGENT']),

        isCustom: function(agent) {
            return (this.customFields.includes(agent))
        }
    },
    watch: {
        agentData: function(newData, oldData) {
            var editorData = null

            // Return modified data
            if (this.isCustom(this.workingAgent)) {
                let asObject = {}
                this.customEditor.getValue().forEach(item => {
                    asObject[item.type] = item.value
                })
                editorData = asObject
            } else {
                let parsedData = this.agentEditor.getValue()
                editorData = {
                    data: {
                        input: parsedData.input,
                        output: parsedData.output,
                        cahracteristics: parsedData.characteristics
                    },
                    description: parsedData.description
                }
            }
            if (oldData) {
                if (JSON.stringify(editorData) !== JSON.stringify(oldData)) {
                    this.$emit("agentData", {
                        section: this.workingSection, 
                        agent: this.workingAgent, 
                        data: editorData
                    })
                };
            }

            // Update working
            if (newData) {
                this.workingSection = this.activeSection
                this.workingAgent = this.activeAgent
            } else {
                this.workingSection = null
                this.workingAgent = null
            }

            // Load the correct editor
            if (this.isCustom(this.activeAgent)) {
                this.agentEditor.setValue({})
                if (newData) {
                    var asArray = []
                    Object.keys(newData).forEach(key => {
                        asArray.push({type: key, value: newData[key]})
                    })
                    this.customEditor.setValue(asArray)
                } else {
                    this.customEditor.setValue({})
                }
            } else {
                this.customEditor.setValue({})
                if (newData) {
                    let parsedData = {
                        name: this.workingAgent,
                        description: newData.description,
                        input: newData.data.input,
                        output: newData.data.output,
                        characteristics: newData.data.characteristics
                    }
                    this.agentEditor.setValue(parsedData)
                } else {
                    this.agentEditor.setValue({})
                }
            }
        }
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

    .je-header {
        margin: 0;
    }

    // move content to the right of tab selector
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
