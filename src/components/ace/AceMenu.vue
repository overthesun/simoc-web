<template>
    <BaseMenu>
        <template v-slot:menu-title>
            Ace Menu
        </template>
        <template v-slot:menu-buttons>
            <button @click="downloadConfig">Download Configuration</button>
            <button  @click="uploadConfig">Upload Configuration</button>
            <input type="file" accept="application/json" id="configInputFile" ref="configInputFile" @change="handleConfig" />
            <button @click="resetConfig">Reset Configuration</button>
            <button class='btn-logout' @click="logout">Log Out</button>
        </template>
    </BaseMenu>
</template>

<script>
import axios from 'axios'
import { BaseMenu } from '../base'

export default {
    components: {
        "BaseMenu": BaseMenu
    },
    props: [
       'workingData'
    ],
    methods: {
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
            const config = this.workingData
            // https://stackoverflow.com/a/48612128
            const data = JSON.stringify(config)
            const blob = new Blob([data], {type: 'application/json'})
            const a = document.createElement('a')
            a.download = "agent_desc.json"
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
                this.$emit("uploadConfig", json_config)
            } catch (error) {
                alert('An error occurred while reading the file: ' + error)
                return
            }
        },
        resetConfig: function() {
            if (!confirm('Reset the current configuration?')) {
                return
            }
            this.$emit("resetConfig")
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
