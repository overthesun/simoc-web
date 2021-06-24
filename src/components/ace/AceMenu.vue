<template>
    <BaseMenu>
        <template v-slot:menu-title>
            Ace Menu
        </template>
        <template v-slot:menu-buttons>
            <DownloadConfig :valid="getEditorValid" :config="getActiveAgentDesc" fileName="agent_desc.json" />
            <button  @click="uploadConfig">Upload Configuration</button>
            <input type="file" accept="application/json" id="configInputFile" ref="configInputFile" @change="handleConfig" />
            <button @click="resetConfig">Reset Configuration</button>
            <button class='btn-logout' @click="logout">Log Out</button>
        </template>
    </BaseMenu>
</template>

<script>
import axios from 'axios'
import { BaseMenu } from '../base'
import { DownloadConfig } from '../menu'
import {mapState,mapGetters,mapMutations} from 'vuex'

export default {
    components: {
        "BaseMenu": BaseMenu,
        "DownloadConfig": DownloadConfig
    },
    computed: {
        ...mapGetters('ace', ['getDefaultAgentDesc', 'getResetAgentDesc', 'getActiveAgentDesc', 'getEditorValid'])
    },
    methods: {
        ...mapMutations('ace', ['SETAGENTDESC']),

        logout: async function() {
            if (!confirm('Do you want to log out?')) {
                return;
            }
            try {
                axios.get('/logout')
            } catch(error) {
                console.log(error)
            }
            this.$router.push("entry")
        },

        downloadConfig: function() {
            const config = this.getActiveAgentDesc
            // https://stackoverflow.com/a/48612128
            const data = JSON.stringify(config)
            const blob = new Blob([data], {type: 'application/json'})
            const a = document.createElement('a')
            a.download = "agent_desc.json"
            a.href = window.URL.createObjectURL(blob)
            a.dataset.downloadurl = ['application/json', a.download, a.href].join(':')
            a.click()
        },
        uploadConfig: function() {
            this.$refs.configInputFile.click()
        },
        handleConfig: function(e) {
            const files = e.target.files
            const config = files[0]
            const reader = new FileReader()
            reader.onload = ((file) => this.readConfig)(config)
            reader.readAsText(config)
        },
        readConfig: function(e) {
            try {
                const json_config = JSON.parse(e.target.result)
                this.SETAGENTDESC({
                    agent_desc: json_config,
                    def: false
                })
            } catch (error) {
                alert('An error occurred while reading the file: ' + error)
                return
            }
        },
        resetConfig: function() {
            if (confirm('Reset the current configuration to the SIMOC default?')) {
                this.SETAGENTDESC({
                    agent_desc: this.getDefaultAgentDesc,
                    def: false
                })
                return
            }
        },
    }
}
</script>

<style lang="scss">
#configInputFile {
    display: none;
}
.reference-link{
    text-decoration: none;
    color: lightgreen;
    font-weight: 600;

    &:visited{
        color: lightgreen;
    }
}

</style>
