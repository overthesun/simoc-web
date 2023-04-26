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
import {mapGetters, mapMutations} from 'vuex'
import {useModalStore} from '../../store/modules/ModalStore'
import {BaseMenu} from '../base'
import {DownloadConfig, UploadConfig, Logout} from '../menu'

export default {
    components: {
        BaseMenu: BaseMenu,
        DownloadConfig: DownloadConfig,
        UploadConfig: UploadConfig,
        Logout: Logout,
    },
    setup() {
        const modal = useModalStore()
        const {confirm} = modal
        return {confirm}
    },
    computed: {
        ...mapGetters('ace', ['getDefaultAgentDesc', 'getResetAgentDesc',
                              'getActiveAgentDesc', 'getEditorValid']),
    },
    methods: {
        ...mapMutations('ace', ['SETAGENTDESC']),

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
