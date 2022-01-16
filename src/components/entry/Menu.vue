
<!-- Menu screen presented to the user on successful login. -->

<template>
    <div class="entry-wrapper">
        <BaseEntry>
            <template #option-items>
                <div class="option-item option-item-active"> MAIN MENU </div>
            </template>
            <template #entry-main>
                <button form="login-form" class="btn-normal" @click="toConfiguration">NEW CONFIGURATION</button>
                <button form="login-form" class="btn-normal" @click="uploadSimData">LOAD SIMULATION DATA</button>
                <button class="btn-normal" @click="showSurvey">LEAVE FEEDBACK</button>
                <button :class="{'hidden': !showAgentEditor}" form="login-form" class="btn-normal"
                        @click="toAce">AGENT EDITOR</button>
                <button :class="{'hidden': !showSensorMode}" form="login-form" class="btn-normal"
                        @click="toLiveDashboard">SENSOR MODE</button>
                <input id="simDataInputFile" ref="simDataInputFile" type="file"
                       accept="application/json" @change="handleSimData">
            </template>
            <template #entry-button>
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
            showSensorMode: false,
        }
    },
    mounted() {
        window.addEventListener('keydown', this.keyListener)
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.keyListener)
    },
    methods: {
        ...mapMutations('dashboard', ['SETSIMULATIONDATA', 'SETLOADFROMSIMDATA', 'SETBUFFERMAX',
                                      'SETSAMCONFIG', 'SETLOADFROMLIVEDATA', 'SETCURRENTMODE']),
        ...mapMutations('wizard', ['SETACTIVECONFIGTYPE']),
        ...mapActions('wizard', ['SETCONFIGURATION', 'SETINITLIVECONFIG']),
        ...mapActions('modal', ['alert', 'showSurvey']),
        // Sends the user to the configuration menu screen. See router.js
        toConfiguration() {
            // menuconfig is currently skipped, we default on Custom config
            // this.$router.push('menuconfig')
            this.SETCURRENTMODE('sim') // set 'sim' mode
            this.SETACTIVECONFIGTYPE('Custom')
            this.$router.push('configuration')
        },
        // Send the user to the ACE Configuration Editor
        toAce() {
            this.SETACTIVECONFIGTYPE('Custom')
            this.$router.push('ace')
        },
        // Send the user to the live Dashboard with a default initial configuration and data
        toLiveDashboard() {
            this.SETCURRENTMODE('live') // set 'live' mode

            try {
                this.SETINITLIVECONFIG() // wizard is being set
                this.SETSAMCONFIG() // game_config is being set
            } catch (error) {
                console.error(error)  // report full error in the console
                this.alert('An error occurred while reading the file.')
                return
            }
            this.SETLOADFROMSIMDATA(false)
            this.SETLOADFROMLIVEDATA(true)
            this.$router.push('dashboard')
        },
        // TODO: Duplicated code; replace with /menu/Upload.vue
        uploadSimData() {
            this.SETCURRENTMODE('sim') // set 'sim' mode
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
                this.alert('An error occurred while reading the file.')
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
            if (e.ctrlKey && e.key === 'a') {
                this.showAgentEditor = true
            } else if (e.ctrlKey && e.key === 's') {
                this.showSensorMode = true
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
