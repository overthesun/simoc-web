<template>
    <BaseMenu>
        <template v-slot:menu-title>
            Configuration Menu
        </template>
        <template v-slot:menu-buttons>
            <button @click="downloadConfig">Download Configuration</button>
            <button  @click="uploadConfig">Upload Configuration</button>
            <input type="file" accept="application/json" id="configInputFile" ref="configInputFile" @change="handleConfig" />
            <button class='btn-outline-warning btn-disabled'>Reset To Default</button>
            <button class='btn-logout' @click="logout">Log Out</button>
        </template>
    </BaseMenu>
</template>

<script>
import axios from 'axios'
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {BaseMenu} from '../../components/base'

export default {
    components: {
       'BaseMenu': BaseMenu,
    },
    computed:{
        ...mapGetters('wizard', ['getConfiguration']),
    },
    methods: {
        ...mapMutations('wizard',['SETCONFIGURATION']),
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
        downloadConfig: function() {
            const form = this.$parent.$refs.form
            if (!form.checkValidity()) {
                form.reportValidity()
                return  // abort if the form is invalid
            }
            const config = this.getConfiguration
            // https://stackoverflow.com/a/48612128
            const data = JSON.stringify(config)
            const blob = new Blob([data], {type: 'application/json'})
            const a = document.createElement('a')
            a.download = "simoc-config.json"
            a.href = window.URL.createObjectURL(blob)
            a.dataset.downloadurl = ['application/json', a.download, a.href].join(':')
            a.click()
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
    }
}
</script>

<style lang="scss" scoped>
#configInputFile {
    display: none;
}
</style>
