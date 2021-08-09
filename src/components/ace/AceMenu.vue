<template>
    <BaseMenu>
        <template v-slot:menu-title>
            Agent Editor Menu
        </template>
        <template v-slot:menu-buttons>
            <DownloadConfig
                :is-valid="getEditorValid"
                :config="getActiveAgentDesc"
                :alert-user-on-invalid="true"
                file-name="agent_desc.json"
                button-text="Download Agent File" />
            <UploadConfig :handle-file="handleUpload" button-text="Upload Agent File" />
            <button @click="resetConfig">Reset Agent File</button>
            <button v-show="!getSurveyComplete" @click="showSurvey">Give Feedback</button>
            <Logout name="logout" />
        </template>
    </BaseMenu>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {BaseMenu} from '../base'
import {DownloadConfig, UploadConfig, Logout} from '../menu'

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
        ...mapGetters('modal', ['getSurveyComplete']),
    },
    methods: {
        ...mapMutations('ace', ['SETAGENTDESC']),
        ...mapActions('modal', ['confirm', 'showSurvey']),

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
