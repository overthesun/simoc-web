<template>
    <BaseMenu>
        <template #menu-title>
            Configuration Menu
        </template>
        <template v-if="!kioskMode" #menu-buttons>
            <DownloadConfig
                :is-valid="isValid"
                :config="configuration"
                :alert-user-on-invalid="false"
                file-name="simoc-config.json" />
            <UploadConfig :handle-file="handleUpload" />
            <button @click="resetConfigHandler">Reset Configuration</button>
            <Logout />
        </template>
        <template v-else #menu-buttons>
            <button @click="resetConfigHandler">Reset Configuration</button>
            <button @click="toEntry">To Welcome Screen</button>
        </template>
    </BaseMenu>
</template>

<script>
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useWizardStore} from '../../store/modules/WizardStore'
import {useModalStore} from '../../store/modules/ModalStore'
import {BaseMenu} from '../base'
import {DownloadConfig, UploadConfig, Logout} from '../menu'

export default {
    components: {
        BaseMenu,
        DownloadConfig,
        UploadConfig,
        Logout,
    },
    setup() {
        const dashboard = useDashboardStore()
        const wizard = useWizardStore()
        const modal = useModalStore()
        const {kioskMode, simLocation} = storeToRefs(dashboard)
        const {configuration, resetConfig} = storeToRefs(wizard)
        const {setConfiguration} = wizard
        const {confirm} = modal
        return {kioskMode, simLocation, configuration, resetConfig, setConfiguration, confirm}
    },
    computed: {
        isValid() {
            const {form} = this.$parent.$refs
            if (!form.checkValidity()) {
                form.reportValidity()
                return false
            } else {
                return true
            }
        },
    },
    methods: {
        handleUpload(json_config) {
            this.setConfiguration(json_config, this.simLocation)
        },
        resetConfigHandler() {
            this.confirm({
                message: 'Reset the current configuration?',
                confirmCallback: () => { this.resetConfig = true },
            })
        },

        // To Welcome Screen button
        toEntry() {
            this.$router.push('/')
        },
    },
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
