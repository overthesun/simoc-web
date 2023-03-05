
<!-- Menu screen presented to the user on successful login. -->

<template>
    <div class="entry-wrapper">
        <BaseEntry>
            <template #option-items>
                <div class="option-item option-item-active"> MAIN MENU </div>
            </template>
            <template #entry-main>
                <button form="login-form" class="btn-normal btn-mars" @click="toConfiguration('mars')">MARS</button>
                <button form="login-form" class="btn-normal btn-biosphere2" @click="toConfiguration('b2')">BIOSPHERE 2</button>
                <button form="login-form" class="btn-normal" @click="uploadSimData">LOAD SIMULATION DATA</button>
                <button class="btn-normal" @click="showSurvey">LEAVE FEEDBACK</button>
                <button :class="{'hidden': !showAgentEditor}" form="login-form" class="btn-normal"
                        @click="toAce">AGENT EDITOR</button>
                <button :class="{'hidden': !showLiveMode}" form="login-form" class="btn-normal"
                        @click="toLiveDashboard">LIVE MODE</button>
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
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useWizardStore} from '../../store/modules/WizardStore'
import {BaseEntry} from '../base'

export default {
    components: {
        BaseEntry,
    },
    setup() {
        const dashboard = useDashboardStore()
        const wizard = useWizardStore()
        const {
            maxStepBuffer, loadFromSimData, currentMode, kioskMode, parameters, isLive, simLocation,
        } = storeToRefs(dashboard)
        const {setSimulationData} = dashboard
        const {activeConfigType} = storeToRefs(wizard)
        const {setConfiguration, setLiveConfig} = wizard
        return {
            maxStepBuffer, loadFromSimData, currentMode, kioskMode, parameters, isLive, simLocation,
            setSimulationData, activeConfigType, setConfiguration,
            setLiveConfig,
        }
    },
    data() {
        return {
            showAgentEditor: false,
            showLiveMode: false,
        }
    },
    mounted() {
        window.addEventListener('keydown', this.keyListener)
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.keyListener)
    },
    methods: {
        ...mapMutations('modal', ['SETSURVEYWASPROMPTED']),
        ...mapActions('modal', ['alert', 'showSurvey']),
        // Sends the user to the configuration menu screen. See router.js
        toConfiguration(location) {
            // menuconfig is currently skipped, we default on Custom config
            // this.$router.push('menuconfig')
            this.simLocation = location
            this.activeConfigType = 'Custom'
            this.$router.push('configuration')
        },
        // Send the user to the ACE Configuration Editor
        toAce() {
            this.activeConfigType = 'Custom'
            this.$router.push('ace')
        },
        /** Routes the user to the live Dashboard. The minimum configuration required for any
         *  Dashboard instance to open without error is the min_step_num and a duration object
         *  composed of an 'amount' key-value pairing. Both of these values can be 0, but the
         *  wizard store parses those two keys. Note that in sim mode these key-values are set in
         *  the Configuration Menu which is rendered after the user selects New Configuration in
         *  this Menu, but in live mode that menu is bypassed and they must be manually set here
         *  before the Dashboard components can be rendered.
         */
        toLiveDashboard() {
            // duplicated in Login.vue
            this.currentMode = 'live'  // set 'live' mode
            this.parameters = {min_step_num: 0}  // create min_step_num parameter
            this.setLiveConfig({duration: {amount: 0}}, this.simLocation)  // set duration in wizard store
            this.$router.push('dashboard')
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
                const {configuration, currency_desc, ...simdata} = json_data
                const {location} = configuration
                this.simLocation = location
                this.setConfiguration(configuration, location)
                this.setSimulationData({simdata, currency_desc})
            } catch (error) {
                console.error(error)  // report full error in the console
                this.alert('An error occurred while reading the file.')
                return
            }
            this.currentMode = 'sim'
            this.isLive = false
            this.loadFromSimData = true
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
                e.preventDefault()  // prevent event from propagating to browser
                this.showAgentEditor = true
            }

            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault()  // prevent event from propagating to browser
                this.SETSURVEYWASPROMPTED(true)  // do not prompt with survey in kiosk mode
                this.kioskMode = true
                this.$router.push('/')
            }

            if (e.ctrlKey && e.key === 's') {
                e.preventDefault()  // prevent event from propagating to browser
                this.showLiveMode = true
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
