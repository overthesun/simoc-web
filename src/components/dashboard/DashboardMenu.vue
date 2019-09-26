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
            <button @click="savePanelsLayout">Save Panels Layout</button>
            <button @click="resetPanelsLayout">Reset Panels Layout</button>
            <button class='btn-disabled'>Save Session</button>
            <button class='btn-warning btn-logout'  @click="logout">Log Out</button>
        </template>
    </BaseMenu>
</template>


<script>
import axios from 'axios'
import {mapState,mapGetters,mapMutations} from 'vuex'
import {BaseMenu} from '../../components/base'
export default {
    data(){
        return{
            timerWasRunning: null,  // the status of timer before opening the menu
        }
    },
    components: {
       'BaseMenu': BaseMenu,
    },
    mounted: function() {
        // save the status of the timer and pause it when the menu is opened
        this.timerWasRunning = this.getIsTimerRunning
        this.PAUSETIMER()
    },
    computed:{
        ...mapGetters('dashboard',['getIsTimerRunning', 'getActivePanels']),
        ...mapGetters(['getGameID']),
    },
    // Called when the menu is closed, resumes the timer if it was running
    beforeDestroy: function() {
        if (this.timerWasRunning) {
            this.STARTTIMER()
        }
    },
    methods:{
        ...mapMutations('dashboard',['SETMENUACTIVE','SETSTOPPED','STARTTIMER','PAUSETIMER','SETDEFAULTPANELS']),

        // Stop Simulation button, this stops the timers and the simulation
        stopSimulation: async function() {
            this.PAUSETIMER()  // pause the step timer
            this.timerWasRunning = false  // make sure the timer doesn't restart
            this.SETSTOPPED(true)  // this will call DashboardView.stopSimulation
        },
        // Save Panels Layout button
        savePanelsLayout: function() {
            const panelsLayout = JSON.stringify(this.getActivePanels)
            localStorage.setItem('panels-layout', panelsLayout)
        },
        // Reset Panels Layout button
        resetPanelsLayout: function() {
            localStorage.removeItem('panels-layout')
            this.SETDEFAULTPANELS()
        },
        // Logout button route
        logout: async function(){
            if (!confirm('Stop the current simulation and log out?')) {
                return;
            }
            this.timerWasRunning = false  // make sure the timer doesn't restart
            try{
                axios.get('/logout')
            }catch(error){
                console.log(error)
            }
            // rely on DashboardView.beforeDestroy to stop the sim
            this.$router.push("entry")
        },

        // New Simulation button
        toConfiguration: function(){
            if (!confirm('Stop the current simulation and configure a new one?')) {
                return;
            }
            this.timerWasRunning = false  // make sure the timer doesn't restart
            // rely on DashboardView.beforeDestroy to stop the sim
            this.$router.push("menuconfig")
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
