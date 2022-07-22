<template>
    <BaseMenu>
        <template #menu-title>
            Configuration Menu
        </template>
        <template #menu-buttons>
            <DownloadConfig
                :is-valid="isValid"
                :config="getConfiguration"
                :alert-user-on-invalid="false"
                file-name="simoc-config.json" />
            <UploadConfig :handle-file="handleUpload" />
            <button @click="resetConfig">Reset Configuration</button>
            <Logout />
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
        BaseMenu,
        DownloadConfig,
        UploadConfig,
        Logout,
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
