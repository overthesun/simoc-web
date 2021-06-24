<template>
    <button @click="handleClick">Download Configuration</button>
</template>

<script>

export default {
    props: [
        'valid',
        'config',
        'fileName'
    ],
    methods: {
        handleClick: function() {
            // abort if parent declares invalid
            if (!this.valid) {
                console.log("Current form invalid")
                return
            }

            // check/add .json extension
            let nameExt = this.fileName.split('.')
            var cleanName = (nameExt.length < 2 || nameExt[nameExt.length - 1] !== 'json') 
                ? this.fileName + '.json' 
                : this.fileName

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
