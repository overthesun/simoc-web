<template>
    <BaseMenu>
        <template v-slot:menu-title>
            Configuration Menu
        </template>
        <template v-slot:menu-buttons>
            <DownloadConfig
                :is-valid="isValid"
                :config="getConfiguration"
                :alert-user-on-invalid="false"
                file-name="simoc-config.json" />
            <UploadConfig :handle-file="handleUpload" />
            <button @click="resetConfig">Reset Configuration</button>
            <button v-if="!(getSurveyComplete)" @click="SETSURVEYACTIVE(true)">Give Feedback</button>
            <Logout />
        </template>
    </BaseMenu>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {BaseMenu} from '../base'
import {DownloadConfig, UploadConfig, Logout} from '../menu'

export default {
    components: {
        BaseMenu,
        DownloadConfig,
        UploadConfig,
        Logout,
    },
    computed: {
        ...mapGetters('wizard', ['getConfiguration']),
        ...mapGetters('dashboard', ['getSurveyActive', 'getSurveyComplete']),

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
        ...mapMutations('dashboard', ['SETSURVEYACTIVE']),
        ...mapActions('wizard', ['SETCONFIGURATION']),
        handleUpload(json_config) {
            this.SETCONFIGURATION(json_config)
        },
        resetConfig() {
            if (!window.confirm('Reset the current configuration?')) {
                return
            }
            this.SETRESETCONFIG(true)
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
