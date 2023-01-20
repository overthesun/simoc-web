<!-- Main menu component used within the dashboard
Some buttons are disabled as functionality hasn't been added yet to
use some of these features.
 -->
<template>
    <BaseMenu>
        <template #menu-title>
            Dashboard Menu
        </template>
        <template v-if="!kioskMode" #menu-buttons>
            <button @click="toConfiguration">New Simulation</button>
            <!--<button @click="stopSimulation">Stop Simulation</button>-->
            <button @click="downloadSimData">Download Simulation Data</button>
            <button @click="savePanelsLayout">Save Panels Layout</button>
            <button @click="resetPanelsLayout">Reset Panels Layout</button>
            <button class="btn-warning btn-logout" @click="logout">Log Out</button>
        </template>
        <template v-else #menu-buttons>
            <button @click="toConfiguration">New Mission</button>
            <button @click="toEntry">To Welcome Screen</button>
        </template>
    </BaseMenu>
</template>


<script>
import axios from 'axios'
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useWizardStore} from '../../store/modules/WizardStore'
import {BaseMenu} from '../base'

export default {
    components: {
        BaseMenu,
    },
    setup() {
        const dashboard = useDashboardStore()
        const wizard = useWizardStore()
        const {
            isTimerRunning, activePanels, gameCurrencies, currentMode,
            kioskMode, menuActive, leaveWithoutConfirmation,
        } = storeToRefs(dashboard)
        const {
            getSimulationData, setStopped, startTimer, pauseTimer,
            setDefaultPanels,
        } = dashboard
        const {configuration, activeConfigType} = storeToRefs(wizard)
        return {
            isTimerRunning, activePanels, gameCurrencies, currentMode, kioskMode,
            menuActive, leaveWithoutConfirmation, getSimulationData, setStopped,
            startTimer, pauseTimer, setDefaultPanels, configuration, activeConfigType,
        }
    },
    data() {
        return {
            timerWasRunning: null,  // the status of timer before opening the menu
        }
    },
    computed: {
        ...mapGetters(['getGameID']),
    },
    mounted() {
        // save the status of the timer and pause it when the menu is opened
        this.timerWasRunning = this.isTimerRunning
        this.pauseTimer()
    },
    // Called when the menu is closed, resumes the timer if it was running
    beforeUnmount() {
        if (this.timerWasRunning) {
            this.startTimer()
        }
    },
    methods: {
        ...mapActions('modal', ['confirm']),

        // Stop Simulation button, this stops the timers and the simulation
        async stopSimulation() {
            this.pauseTimer()  // pause the step timer
            this.timerWasRunning = false  // make sure the timer doesn't restart
            this.setStopped(true)  // this will call DashboardView.stopSimulation
        },
        // Download Simulation button
        downloadSimData() {
            // create a json file with the sim data for the user to download
            // TODO: this is duplicated in the config menu
            const simdata = this.getSimulationData
            simdata.configuration = this.configuration
            simdata.currency_desc = this.gameCurrencies
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
            const panelsLayout = JSON.stringify(this.activePanels)
            const layout = this.currentMode === 'live' ? 'live' : 'sim'
            localStorage.setItem(`panels-layout-${layout}`, panelsLayout)
        },
        // Reset Panels Layout button
        resetPanelsLayout() {
            const layout = this.currentMode === 'live' ? 'live' : 'sim'
            localStorage.removeItem(`panels-layout-${layout}`)
            this.setDefaultPanels(this.currentMode)
        },
        // Logout button route
        async logout() {
            this.confirm({
                message: 'Stop the current simulation and log out?',
                confirmCallback: () => {
                    this.timerWasRunning = false  // make sure the timer doesn't restart
                    try {
                        axios.get('/logout')
                    } catch (error) {
                        console.log(error)
                    }
                    // the user already confirmed, don't ask twice
                    this.leaveWithoutConfirmation = true
                    // rely on DashboardView.beforeDestroy to stop the sim
                    this.$router.push('entry')
                },
            })
        },

        // New Simulation button
        toConfiguration() {
            this.confirm({
                message: 'Stop the current simulation and configure a new one?',
                confirmCallback: () => {
                    this.timerWasRunning = false  // make sure the timer doesn't restart
                    // menuconfig is currently skipped, we default on Custom config
                    // this.$router.push("menuconfig")
                    this.activeConfigType = 'Custom'

                    // the user already confirmed, don't ask twice
                    this.leaveWithoutConfirmation = true
                    // rely on DashboardView.beforeDestroy to stop the sim
                    if (!this.kioskMode) {
                        this.$router.push('menu')
                    } else {
                        this.$router.push('configuration')
                    }
                },
            })
        },

        // To Welcome Screen button
        toEntry() {
            this.$router.push('/')
        },
    },
}
</script>

<style lang="scss" scoped>
</style>
