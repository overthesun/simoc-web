<template>
    <div>
        <div class="empty-msg" :class="{ 'empty-msg-hidden' : (activeAgent) }">
            Select an agent to get started.
        </div>
        <div class='editor' :class="{ 'hidden' : activeAgent === null }">
            <div id='editor_holder'></div>
        </div>
    </div>
</template>

<script>
import agent_schema from "../../../agent_schema.json"
import { JSONEditor } from '@json-editor/json-editor'

export default {
    props: [
        'activeSection',
        'activeAgent',
        'agentData'
    ],
    data() {
        return {
            workingSection: null,
            workingAgent: null,
            editor: {}
        }
    },
    async mounted() {
        this.editor = new JSONEditor(document.getElementById('editor_holder'),{
            schema: agent_schema,
            theme: 'html',
            disable_properties: true,
            required_by_default: false,
            remove_empty_properties: true,
            show_opt_in: true,
            startval: {}
        });    

    },
    watch: {
        agentData: function(newData, oldData) {

            // Return modified data
            if (oldData) {
                let editorData = this.editor.getValue()
                if (JSON.stringify(editorData) !== JSON.stringify(oldData)) {
                    this.$emit("agentData", {
                        section: this.workingSection, 
                        agent: this.workingAgent, 
                        data: editorData
                    })
                };
            }

            // Record working section
            if (newData) {
                this.workingSection = this.activeSection
                this.workingAgent = this.activeAgent
            } else {
                this.workingSection = null
                this.workingAgent = null
            }

            // Load editor
            this.editor.setValue(newData ? newData : {})
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

    // make rows horizontal
    .row {
        margin: 0;
        padding: 0;
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

    .json-editor-btntype-deleteall { display: none;
    }

</style>
