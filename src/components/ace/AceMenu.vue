<template>
    <BaseMenu>
        <template v-slot:menu-title>
            Ace Menu
        </template>
        <template v-slot:menu-buttons>
            <DownloadConfig :valid="getEditorValid" :config="getActiveAgentDesc" fileName="agent_desc.json" />
            <UploadConfig :handleFile="handleUpload" />
            <button @click="resetConfig">Reset Configuration</button>
            <Logout name="logout"/>
        </template>
    </BaseMenu>
</template>

<script>
import axios from 'axios'
import { BaseMenu } from '../base'
import { DownloadConfig,UploadConfig,Logout } from '../menu'
import {mapState,mapGetters,mapMutations} from 'vuex'

export default {
    components: {
        "BaseMenu": BaseMenu,
        "DownloadConfig": DownloadConfig,
        "UploadConfig": UploadConfig,
        "Logout": Logout 
    },
    computed: {
        ...mapGetters('ace', ['getDefaultAgentDesc', 'getResetAgentDesc', 'getActiveAgentDesc', 'getEditorValid'])
    },
    methods: {
        ...mapMutations('ace', ['SETAGENTDESC']),

        handleUpload: function(file) {
            this.SETAGENTDESC({
                agent_desc: file,
                def: false
            })
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
