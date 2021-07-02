<template>
    <button @click="handleClick">Download Configuration</button>
</template>

<script>

export default {
    props: [
        'isValid',
        'config',
        'fileName',
        'alertUserOnInvalid'
    ],
    methods: {
        handleClick: function() {
            // abort if parent declares invalid
            if (!this.isValid) {
                if (this.alertUserOnInvalid) {
                    alert("Current form invalid")
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
    }
}
</script>

<style lang="scss">

</style>
