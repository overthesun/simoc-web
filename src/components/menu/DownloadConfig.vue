<template>
    <button @click="handleClick">{{buttonText}}</button>
</template>

<script>
import {mapActions} from 'vuex'

export default {
    props: {
        isValid: Boolean,
        config: {type: Function, required: true},
        fileName: {type: String, default: 'simoc_download.json'},
        alertUserOnInvalid: {type: Boolean, default: false},
        buttonText: {type: String, default: 'Download Configuration'},
    },
    methods: {
        ...mapActions('popup', ['popupAlert']),

        handleClick() {
            // abort if parent declares invalid
            if (!this.isValid) {
                if (this.alertUserOnInvalid) {
                    this.popupAlert('Current form invalid')
                }
                return
            }

            // check/add .json extension
            let cleanName = this.fileName
            if (cleanName.slice(-5) !== '.json') {
                cleanName += '.json'
            }

            // https://stackoverflow.com/a/48612128
            const data = JSON.stringify(this.config)
            const blob = new Blob([data], {type: 'application/json'})
            const a = document.createElement('a')
            a.download = cleanName
            a.href = window.URL.createObjectURL(blob)
            a.dataset.downloadurl = ['application/json', a.download, a.href].join(':')
            a.click()
        },
    },
}
</script>

<style lang="scss">

</style>
