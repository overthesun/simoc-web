<template>
    <BaseMenu>
        <template #menu-title>
            Configuration Menu
        </template>
        <template v-if="currentMode !== 'kiosk'" #menu-buttons>
            <DownloadConfig
                :is-valid="isValid"
                :config="getConfiguration"
                :alert-user-on-invalid="false"
                file-name="simoc-config.json" />
            <UploadConfig :handle-file="handleUpload" />
            <button @click="resetConfig">Reset Configuration</button>
            <Logout />
        </template>
        <template v-else #menu-buttons>
            <button @click="resetConfig">Reset Configuration</button>
            <button @click="toEntry">To Welcome Screen</button>
        </template>
    </BaseMenu>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
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
        const {currentMode} = storeToRefs(dashboard)
        return {currentMode}
    },
    computed: {
        ...mapGetters('wizard', ['getConfiguration']),

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
        ...mapMutations('wizard', ['SETRESETCONFIG']),
        ...mapActions('wizard', ['SETCONFIGURATION']),
        ...mapActions('modal', ['confirm']),
        handleUpload(json_config) {
            this.SETCONFIGURATION(json_config)
        },
        resetConfig() {
            this.confirm({
                message: 'Reset the current configuration?',
                confirmCallback: () => this.SETRESETCONFIG(true),
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
