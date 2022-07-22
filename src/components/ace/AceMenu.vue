<template>
    <BaseMenu>
        <template #menu-title>
            Agent Editor Menu
        </template>
        <template #menu-buttons>
            <DownloadConfig
                :is-valid="getEditorValid"
                :config="getActiveAgentDesc"
                :alert-user-on-invalid="true"
                file-name="agent_desc.json"
                button-text="Download Agent File" />
            <UploadConfig :handle-file="handleUpload" button-text="Upload Agent File" />
            <button @click="resetConfig">Reset Agent File</button>
            <Logout name="logout" />
        </template>
    </BaseMenu>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import BaseMenu from '@/components/base/BaseMenu.vue'
import DownloadConfig from '@/components/menu/DownloadConfig.vue'
import UploadConfig from '@/components/menu/UploadConfig.vue'
import Logout from '@/components/menu/Logout.vue'

export default {
    components: {
        BaseMenu: BaseMenu,
        DownloadConfig: DownloadConfig,
        UploadConfig: UploadConfig,
        Logout: Logout,
    },
    computed: {
        ...mapGetters('ace', ['getDefaultAgentDesc', 'getResetAgentDesc',
                              'getActiveAgentDesc', 'getEditorValid']),
    },
    methods: {
        ...mapMutations('ace', ['SETAGENTDESC']),
        ...mapActions('modal', ['confirm']),

        handleUpload(file) {
            this.SETAGENTDESC({
                agent_desc: file,
                isDefault: false,
            })
        },
        resetConfig() {
            this.confirm({
                message: 'Reset the current configuration to the SIMOC default?',
                confirmCallback: () => {
                    this.SETAGENTDESC({
                        agent_desc: this.getDefaultAgentDesc,
                        isDefault: false,
                    })
                },
            })
        },
    },
}
</script>

<style lang="scss">

</style>
