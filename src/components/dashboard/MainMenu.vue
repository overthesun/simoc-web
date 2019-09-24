<!-- Main menu component used within the dashboard
Some buttons are disabled as functionality hasn't been added yet to
use some of these features.
 -->

<template>
    <div class='main-menu-wrapper' @click="close">
        <div class='menu-wrapper'>
            <header class='header'>
                <img src='../../assets/simoc-logo.svg' class='simoc-logo'/>
                <span class='simoc-logo-title'>SIMOC</span>
            </header>
            <div class='main-options'>
                <div class='option-item option-item-active'>Main Menu</div>
            </div>
            <main class='main-menu'>
                <button class='btn-normal' @click="toConfiguration">New Simulation</button>
                <button class='btn-normal' @click="stopSimulation">Stop Simulation</button>
                <button class='btn-normal' @click="savePanelsLayout">Save Panels Layout</button>
                <button class='btn-normal' @click="resetPanelsLayout">Reset Panels Layout</button>
                <button class='btn-normal btn-disabled'>Save Session</button>
                <button class='btn-outline-warning' @click="close">Close Menu</button>
                <button class='btn-warning btn-logout'  @click="logout">Log Out</button>
            </main>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import {mapState,mapGetters,mapMutations} from 'vuex'
export default {
    data(){
        return{
            timerWasRunning: null,  // the status of timer before opening the menu
        }
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
    methods:{
        ...mapMutations('dashboard',['SETMENUACTIVE','SETSTOPPED','STARTTIMER','PAUSETIMER','SETDEFAULTPANELS']),

        // Called when the menu is closed, resumes the timer
        close: function() {
            this.SETMENUACTIVE(false)
            if (this.timerWasRunning) {
                // restart the timer if it was running
                this.STARTTIMER()
            }
        },
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
        toConfiguration: async function(){
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
    .main-menu-wrapper{
        position:absolute;
        z-index:200;
        height: 100vh;
        width: 100vw;
        background-color: rgba(#999,.55);
        display:flex;
        justify-content:center;
        align-items:center;
    }

    .main-menu{
        display:flex;
        justify-content:flex-start;;
        align-items:center;
        flex-direction: column;
    }

    .menu-wrapper{
        width: 480px;
        height: 600px;
        max-height: 600px;
        background-color: #1e1e1e;
        z-index:1000;
        padding:16px;
        box-sizing:border-box;
        display:flex;
        justify-content:flex-start;
        align-items:center;
        flex-direction:column;
    }

    .header{
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom: 32px;
    }

    .simoc-logo{
        width: auto;
        height: 48px;
        margin-right:8px;
    }

    .simoc-logo-title{
        font-family: "Nasalization", "Open Sans", sans-serif;
        font-weight: 400;
        font-size: 22px;
    }

    .main-options{
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom: 48px;
    }

    .option-item{
        box-sizing:border-box;
        margin: 0px 16px;
        font-weight: 600;
        font-size: 24px;
        position: relative;

        &:hover{
            cursor:pointer;
        }

        &:after{
            box-sizing:border-box;
            position: absolute;
            right: 0;
            top: 100%;
            content:"";
            width: 0;
            border-bottom: 2px solid lightgreen;
            transition: width .2s ease;
        }

        &-active:after{
            width: 100%;
            left:0;
        }
    }

.btn-normal{
        width: 256px;
        height: 40px;
        min-height: 40px;
        margin-bottom: 12px;
        border-radius: 5px;
        font-size: 16px;
        font-weight: 600;
        background-color: #0099ee;
        border:none;
        color: #eee;

        &:hover{
            cursor: pointer;
        }

        &:focus{
            outline:none;
        }
    }

    .btn-disabled{
        background-color: transparent !important;
        border: 1px solid #999 !important;
        color: #999 !important;

        &:hover{
            cursor:not-allowed !important;
        }

        &:focus{
            outline:none !important;
        }
    }

    .btn-logout{
        margin-top: auto;
    }

    .btn-outline-warning{
        width: 256px;
        height: 40px;
        min-height: 40px;
        margin-bottom: 12px;
        border-radius: 5px;
        font-size: 16px;
        font-weight: 600;
        background-color: transparent;
        border:2px solid #ff3100;
        color: #eee;

        &:hover{
            cursor: pointer;
        }

        &:focus{
            outline:none;
        }
    }

    .btn-warning{
        width: 256px;
        height: 40px;
        min-height: 40px;
        border-radius: 5px;
        font-size: 16px;
        font-weight: 600;
        background-color: #ff3100;
        border:none;
        color: #eee;
        margin-top:auto;
        &:hover{
            cursor: pointer;
        }

        &:focus{
            outline:none;
        }
    }

</style>
