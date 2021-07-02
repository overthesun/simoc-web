<template>
    <button  @click="uploadConfig">
        Upload Configuration
        <input type="file" accept="application/json" id="configInputFile" ref="configInputFile" @change="handleUpload" />
    </button>
</template>

<script>

export default {
    props: [
        'handleFile'
    ],
    methods: {
        uploadConfig: function() {
            this.$refs.configInputFile.click()
        },
        // ref: (both functions) https://blog.shovonhasan.com/using-promises-with-filereader/
        readUploadedFileAsText: function(inputFile) {
            const temporaryFileReader = new FileReader()

            return new Promise((resolve, reject) => {
                temporaryFileReader.onerror = () => {
                    temporaryFileReader.abort();
                    reject(new DOMException("Problem parsing input file."))
                };
                temporaryFileReader.onload = () => {
                    resolve(temporaryFileReader.result)
                };
                temporaryFileReader.readAsText(inputFile)
            })
        },
        handleUpload: async function(event) {
            const file = event.target.files[0]
            try {
                await this.readUploadedFileAsText(file).then(data => {
                    let parsed = JSON.parse(data)
                    this.handleFile(parsed)
                })
            } catch (e) {
                alert('An error occurred while reading the file.')
                console.warn(e.message)
            }
        }
    }
}
</script>

<style lang="scss">
#configInputFile {
    display: none;
}
</style>
