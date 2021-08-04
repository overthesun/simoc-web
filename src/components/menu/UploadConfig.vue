<template>
    <button @click="uploadConfig">
        {{buttonText}}
        <input id="configInputFile" ref="configInputFile" type="file"
               accept="application/json" @change="handleUpload">
    </button>
</template>

<script>
import {mapActions} from 'vuex'

export default {
    props: {
        handleFile: {type: Function, required: true},
        buttonText: {type: String, default: 'Upload Configuration'},
    },
    methods: {
        ...mapActions('modal', ['modalAlert']),

        uploadConfig() {
            this.$refs.configInputFile.click()
        },
        // ref: (both functions) https://blog.shovonhasan.com/using-promises-with-filereader/
        readUploadedFileAsText(inputFile) {
            const temporaryFileReader = new FileReader()

            return new Promise((resolve, reject) => {
                temporaryFileReader.onerror = () => {
                    temporaryFileReader.abort()
                    reject(new DOMException('Problem parsing input file.'))
                }
                temporaryFileReader.onload = () => {
                    resolve(temporaryFileReader.result)
                }
                temporaryFileReader.readAsText(inputFile)
            })
        },
        async handleUpload(event) {
            const file = event.target.files[0]
            try {
                await this.readUploadedFileAsText(file).then(data => {
                    const parsed = JSON.parse(data)
                    this.handleFile(parsed)
                })
            } catch (e) {
                this.modalAlert('An error occurred while reading the file.')
                console.warn(e.message)
            }
        },
    },
}
</script>

<style lang="scss">
#configInputFile {
    display: none;
}
</style>
