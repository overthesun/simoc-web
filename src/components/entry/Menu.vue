
<!-- Menu screen presented to the user on successful login. -->

<template>
    <div class="entry-wrapper">
        <BaseEntry>
            <template v-slot:option-items>
                <div class="option-item option-item-active"> MAIN MENU </div>
            </template>
            <template v-slot:entry-main>
                <button form="login-form" class="btn-normal" @click="toConfiguration">NEW CONFIGURATION</button>
                <button form="login-form" class="btn-normal" @click="uploadSimData">LOAD SIMULATION DATA</button>
                <button :class="{'hidden': !showAgentEditor}" form="login-form" class="btn-normal"
                        @click="toAce">AGENT EDITOR</button>
                <input id="simDataInputFile" ref="simDataInputFile" type="file"
                       accept="application/json" @change="handleSimData">
            </template>
            <template v-slot:entry-button>
                <div class="btn-wrapper">
                    <button form="login-form" class="btn-warning" @click="logout">Log Out</button>
                </div>
            </template>
        </BaseEntry>

    </div>
</template>

<script>
import axios from 'axios'
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {BaseEntry} from '../base'

export default {
    components: {
        BaseEntry,
    },
    data() {
        return {
            showAgentEditor: false,
        }
    },
    mounted() {
        window.addEventListener('keydown', this.keyListener)
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.keyListener)
    },
    methods: {
        ...mapMutations('dashboard', ['SETSIMULATIONDATA', 'SETLOADFROMSIMDATA', 'SETBUFFERMAX']),
        ...mapMutations('wizard', ['SETACTIVECONFIGTYPE']),
        ...mapActions('wizard', ['SETCONFIGURATION']),
        ...mapActions('popup', ['popupAlert']),
        // Sends the user to the configuration menu screen. See router.js
        toConfiguration() {
            // menuconfig is currently skipped, we default on Custom config
            // this.$router.push('menuconfig')

            this.SETACTIVECONFIGTYPE('Custom')
            this.$router.push('configuration')
        },
        // Send the user to the ACE Configuration Editor
        toAce() {
            this.SETACTIVECONFIGTYPE('Custom')
            this.$router.push('ace')
        },
        // TODO: Duplicated code; replace with /menu/Upload.vue
        uploadSimData() {
            this.$refs.simDataInputFile.click()
        },
        handleSimData(e) {
            const {files} = e.target
            const simdata = files[0]
            const reader = new FileReader()
            reader.onload = (file => this.readSimData)(simdata)
            reader.readAsText(simdata)
        },
        // read uploaded file, set vars, and go to the dashboard
        readSimData(e) {
            try {
                const json_data = JSON.parse(e.target.result)
                this.SETCONFIGURATION(json_data.configuration)
                this.SETSIMULATIONDATA(json_data)
                this.SETBUFFERMAX(json_data.steps)
            } catch (error) {
                console.error(error)  // report full error in the console
                this.popupAlert('An error occurred while reading the file.')
                return
            }
            this.SETLOADFROMSIMDATA(true)
            this.$router.push('dashboard')
        },

        // TODO: Duplicated code; replace with /menu/Logout.vue
        async logout() {
            try {
                axios.get('/logout')
            } catch (error) {
                console.log(error)
            }
            this.$router.push('entry')
        },
        // Adapted from '../views/DashboardView.vue'
        keyListener(e) {
            let key_matched = true
            switch (e.key) {
                case 'a':
                    this.showAgentEditor = true
                    break
                default:
                    key_matched = false  // no key matched
                    break
            }
            if (key_matched) {
                e.preventDefault()
            }
        },
    },
}
</script>

<style lang="scss" scoped>
#simDataInputFile {
    display: none;
}

.hidden {
    display: none;
}

    .entry-wrapper{
        height:100%;
        width:100%;
        display:flex;
        justify-content:center;
        align-items:center;
        flex-direction:column;
        box-sizing:border-box;
        position:relative;
    }

    .btn-warning{
        background-color: #ff3100;
    }
</style>
