<template>
    <BaseMenu>
        <template v-slot:menu-title>
            Configuration Menu
        </template>
        <template v-slot:menu-buttons>
            <DownloadConfig :valid="formValid" :config="getConfiguration" fileName="simoc-config.json" />
            <button  @click="uploadConfig">Upload Configuration</button>
            <input type="file" accept="application/json" id="configInputFile" ref="configInputFile" @change="handleConfig" />
            <button @click="resetConfig">Reset Configuration</button>
            <button class='btn-logout' @click="logout">Log Out</button>
        </template>
    </BaseMenu>
</template>

<script>
import axios from 'axios'
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {BaseMenu} from '../../components/base'
import {DownloadConfig} from '../../components/menu'

export default {
    components: {
       'BaseMenu': BaseMenu,
       'DownloadConfig': DownloadConfig
    },
    computed:{
        ...mapGetters('wizard', ['getConfiguration']),

        formValid: function() {
            const form = this.$parent.$refs.form
            if (!form.checkValidity()) {
                form.reportValidity()
                return  false
            } else {
                return true
            }
        }
    },
    methods: {
        ...mapMutations('wizard', ['SETRESETCONFIG']),
        ...mapActions('wizard', ['SETCONFIGURATION']),
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
                this.SETCONFIGURATION(json_config)
            } catch (error) {
                alert('An error occurred while reading the file: ' + error)
                return
            }
        },
        resetConfig: function() {
            if (!confirm('Reset the current configuration?')) {
                return
            }
            this.SETRESETCONFIG(true)
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
