<!-- Main menu component used within the dashboard
Some buttons are disabled as functionality hasn't been added yet to
use some of these features.
 -->
<template>
    <BaseMenu>
        <template v-slot:menu-title>
            Dashboard Menu
        </template>
        <template v-slot:menu-buttons>
            <button @click="toConfiguration">New Simulation</button>
            <button @click="stopSimulation">Stop Simulation</button>
            <button @click="downloadSimData">Download Simulation Data</button>
            <button @click="savePanelsLayout">Save Panels Layout</button>
            <button @click="resetPanelsLayout">Reset Panels Layout</button>
            <button v-if="!(getSurveyComplete)" @click="SETSURVEYACTIVE(true)">Give Feedback</button>
            <button class="btn-warning btn-logout" @click="logout">Log Out</button>
        </template>
    </BaseMenu>
</template>


<script>
import axios from 'axios'
import {mapState, mapGetters, mapMutations} from 'vuex'
import {BaseMenu} from '../base'

export default {
    components: {
        BaseMenu,
    },
    data() {
        return {
            timerWasRunning: null,  // the status of timer before opening the menu
        }
    },
    computed: {
        ...mapGetters('wizard', ['getConfiguration']),
        ...mapGetters('dashboard', ['getIsTimerRunning', 'getActivePanels',
                                    'getSimulationData', 'getSurveyComplete']),
        ...mapGetters(['getGameID']),
    },
    mounted() {
        // save the status of the timer and pause it when the menu is opened
        this.timerWasRunning = this.getIsTimerRunning
        this.PAUSETIMER()
    },
    // Called when the menu is closed, resumes the timer if it was running
    beforeDestroy() {
        if (this.timerWasRunning) {
            this.STARTTIMER()
        }
    },
    methods: {
        ...mapMutations('wizard', ['SETACTIVECONFIGTYPE']),
        ...mapMutations('dashboard', ['SETMENUACTIVE', 'SETSTOPPED', 'STARTTIMER', 'PAUSETIMER',
                                      'SETDEFAULTPANELS', 'SETLEAVEWITHOUTCONFIRMATION',
                                      'SETSURVEYACTIVE']),

        // Stop Simulation button, this stops the timers and the simulation
        async stopSimulation() {
            this.PAUSETIMER()  // pause the step timer
            this.timerWasRunning = false  // make sure the timer doesn't restart
            this.SETSTOPPED(true)  // this will call DashboardView.stopSimulation
        },
        // Download Simulation button
        downloadSimData() {
            // create a json file with the sim data for the user to download
            // TODO: this is duplicated in the config menu
            const simdata = this.getSimulationData
            simdata.configuration = this.getConfiguration
            // https://stackoverflow.com/a/48612128
            const data = JSON.stringify(simdata)
            const blob = new Blob([data], {type: 'application/json'})
            const a = document.createElement('a')
            a.download = 'simoc-simulation-data.json'
            a.href = window.URL.createObjectURL(blob)
            a.dataset.downloadurl = ['application/json', a.download, a.href].join(':')
            a.click()
        },
        // Save Panels Layout button
        savePanelsLayout() {
            const panelsLayout = JSON.stringify(this.getActivePanels)
            localStorage.setItem('panels-layout', panelsLayout)
        },
        // Reset Panels Layout button
        resetPanelsLayout() {
            localStorage.removeItem('panels-layout')
            this.SETDEFAULTPANELS()
        },
        // Logout button route
        async logout() {
            if (!window.confirm('Stop the current simulation and log out?')) {
                return
            }
            this.timerWasRunning = false  // make sure the timer doesn't restart
            try {
                axios.get('/logout')
            } catch (error) {
                console.log(error)
            }
            // the user already confirmed, don't ask twice
            this.SETLEAVEWITHOUTCONFIRMATION(true)
            // rely on DashboardView.beforeDestroy to stop the sim
            this.$router.push('entry')
        },

        // New Simulation button
        toConfiguration() {
            if (!window.confirm('Stop the current simulation and configure a new one?')) {
                return
            }
            this.timerWasRunning = false  // make sure the timer doesn't restart
            // menuconfig is currently skipped, we default on Custom config
            // this.$router.push("menuconfig")
            this.SETACTIVECONFIGTYPE('Custom')

            // the user already confirmed, don't ask twice
            this.SETLEAVEWITHOUTCONFIRMATION(true)
            // rely on DashboardView.beforeDestroy to stop the sim
            this.$router.push('menu')
        },
    },
}
</script>

<style lang="scss" scoped>
</style>
