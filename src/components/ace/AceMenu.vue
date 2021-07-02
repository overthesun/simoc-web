<template>
    <BaseMenu>
        <template v-slot:menu-title>
            Ace Menu
        </template>
        <template v-slot:menu-buttons>
            <DownloadConfig 
                :isValid="getEditorValid" 
                :config="getActiveAgentDesc" 
                fileName="agent_desc.json" 
                :alertUserOnInvalid="true" />
            <UploadConfig :handleFile="handleUpload" />
            <button @click="resetConfig">Reset Configuration</button>
            <Logout name="logout" />
        </template>
    </BaseMenu>
</template>

<script>
import {mapState,mapGetters,mapMutations} from 'vuex'
import {BaseMenu} from '../base'
import {DownloadConfig,UploadConfig,Logout} from '../menu'

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
                isDefault: false
            })
        },
        resetConfig: function() {
            if (confirm('Reset the current configuration to the SIMOC default?')) {
                this.SETAGENTDESC({
                    agent_desc: this.getDefaultAgentDesc,
                    isDefault: false
                })
            }
        },
    }
}
</script>

<style lang="scss">

</style>
