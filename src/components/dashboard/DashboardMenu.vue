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
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useWizardStore} from '../../store/modules/WizardStore'
import {useModalStore} from '../../store/modules/ModalStore'
import {BaseMenu} from '../base'

export default {
    components: {
        BaseMenu,
    },
    setup() {
        const dashboard = useDashboardStore()
        const wizard = useWizardStore()
        const modal = useModalStore()
        const {
            isTimerRunning, activePanels, gameCurrencies, currentMode, kioskMode,
            terminated, menuActive, leaveWithoutConfirmation,
        } = storeToRefs(dashboard)
        const {configuration} = storeToRefs(wizard)
        const {
            getSimulationData, setStopped, startTimer, pauseTimer,
            getLayoutName, setDefaultPanels,
        } = dashboard
        const {confirm, alert} = modal
        return {
            isTimerRunning, activePanels, gameCurrencies, currentMode, kioskMode,
            terminated, menuActive, leaveWithoutConfirmation,
            getSimulationData, setStopped, startTimer, pauseTimer,
            getLayoutName, setDefaultPanels, configuration, confirm, alert,
        }
    },
    data() {
        return {
            timerWasRunning: null,  // the status of timer before opening the menu
        }
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
        // Stop Simulation button, this stops the timers and the simulation
        async stopSimulation() {
            // currently disabled
            this.pauseTimer()  // pause the step timer
            this.timerWasRunning = false  // make sure the timer doesn't restart
            this.setStopped(true)  // this will call DashboardView.stopSimulation
        },
        // Download Simulation button
        downloadSimData() {
            // create a json file with the sim data for the user to download
            // TODO: this is duplicated in the config menu
            if (!this.terminated) {
                this.alert('The simulation is still running,\n' +
                           'please wait until all the data is received.')
                return
            }
            const simdata = this.getSimulationData
            simdata.configuration = this.configuration
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
            const layout = this.getLayoutName
            localStorage.setItem(`panels-layout-${layout}`, panelsLayout)
        },
        // Reset Panels Layout button
        resetPanelsLayout() {
            const layout = this.getLayoutName
            localStorage.removeItem(`panels-layout-${layout}`)
            this.setDefaultPanels(layout)
        },
        // Logout button route
        async logout() {
            this.confirm({
                message: 'Stop the current simulation and log out?',
                confirmCallback: () => {
                    this.timerWasRunning = false  // make sure the timer doesn't restart
                    if (this.currentMode !== 'live') {  // live mode has no login/logout
                        try {
                            axios.get('/logout')
                        } catch (error) {
                            console.log(error)
                        }
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
