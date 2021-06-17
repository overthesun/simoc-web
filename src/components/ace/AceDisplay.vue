<template>
    <div class='columns' :class="{ 'hidden' : activeAgent === null }">
        <div class='column col-md-12' id='editor_holder'></div>
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
    }
}
</script>

<style lang="scss" scoped>

    .hidden {
        display: none;
    }

</style>
