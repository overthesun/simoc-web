<template>
    <div class='base-dashboard-wrapper'>
        <router-view>
        </router-view>
    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import axios from 'axios'
import {StepTimer} from '../javascript/stepTimer'
export default {
    beforeMount:function(){
        // reinitialize everything, init a new game, and request steps num before mounting

        // Kill the timer if there is still one running somehow
        this.STOPTIMER()
        // do the same with the get_steps timer
        if (this.getGetStepsTimerID) {
            window.clearTimeout(this.getGetStepsTimerID)
        }
        // reset more variables
        // the buffer current should be 0 so its value is updated when step 1 is received
        this.SETTIMERID(undefined)          // Set the timerID to undefined
        this.SETGETSTEPSTIMERID(undefined)  // Set the getStepsTimerID to undefined
        this.SETBUFFERCURRENT(0)            // Reset the current buffer value
        this.SETBUFFERMAX(0)                // Reset the max buffer value
        this.SETMINSTEPNUMBER(0)            // Reset the starting step
        this.SETSTOPPED(false)              // Reset stopped and terminated flags

        // init a new game, set game id, reset all data buffers
        this.INITGAME(this.getGameID)
        // This sets the get_step parameter for the totalAgentMass filter.
        // TODO: this should actually be done in tandem with the configuration wizard plant updates.
        // This must be done after INITGAME or it will be reset
        this.SETPLANTSPECIESPARAM(this.getConfiguration)

        console.log('Starting simulation', this.getGameID)

        // make sure that to stop the sim when the user closes the tab
        window.addEventListener('beforeunload', this.killGame)
        // this starts the timer that asks the steps to the backend
        this.requestStepsNum()

        // after this, the Timeline component will be mounted
        // and it will start the timer that shows the steps
    },
    beforeDestroy: function() {
        // if the sim is still running upon leaving the page, stop it;
        // some methods in MainMenu.vue rely on this to stop the sim
        this.STOPTIMER()   // stop the step timer
        if (!this.getTerminated) {
            this.killGame()
        }
        // we don't need this anymore if the dashboard has been destroyed
        window.removeEventListener('beforeunload', this.killGame)
    },
    computed:{
        //Getterss from the vuex stores
        ...mapGetters('dashboard', ['getGetStepsTimerID','getStopped','getTerminated','getStepParams','getCurrentStepBuffer','getMaxStepBuffer']),
        ...mapGetters('wizard', ['getTotalMissionHours','getConfiguration']),
        ...mapGetters(['getGameID', 'getUseLocalHost']),
    },
    methods:{
        //
        ...mapMutations('dashboard',['SETPLANTSPECIESPARAM','PAUSETIMER','STOPTIMER','SETTIMERID','SETGETSTEPSTIMERID','SETBUFFERCURRENT','SETBUFFERMAX','SETMINSTEPNUMBER','SETSTOPPED','SETTERMINATED','INITGAME']),
        //Action used for paring the get_step response on completion of retrieval. SEE dashboard store.
        ...mapActions('dashboard',['parseStep']),

        requestStepsNum: async function(){
            // tell the backend how many steps we need for this game
            const localHost = "http://localhost:8000"
            const getStepToRoute = this.getUseLocalHost ? localHost + "/get_step_to" : "/get_step_to"

            // use the total number of mission hours as the number of steps to be calculated
            const stepToParams = {step_num:this.getTotalMissionHours, game_id:this.getGameID}
            const stepParams = this.getStepParams //Retrieve the parameters to used from the dashboard store
            try{
                await axios.post(getStepToRoute,stepToParams) //Begin creating the step buffer on the backend using the entire length of the simulation as the base
                this.stepBufferTimer() //If everything went retrieve the first batch of steps.
            }catch(error){
                console.log(error)
            }
        },

        stepBufferTimer: async function() {
            const localHost = "http://localhost:8000"
            const getStepsRoute = this.getUseLocalHost ? localHost +  "/get_steps" : "/get_steps"
            const stepParams = this.getStepParams  // filter parameters stored in dashboard store

            if (!this.getTerminated) {
                // if the sim is not terminated, set a timer that will
                // retrieve and parse a batch of step
                let getStepsTimerID = setTimeout(async () => {
                    try {
                        const response = await axios.post(getStepsRoute, stepParams)
                        this.updateStepBuffer(response.data.step_data)
                    }
                    catch (error) {
                        console.log(error)
                        this.stepBufferTimer()  // retry
                    }
                }, 2000)
                this.SETGETSTEPSTIMERID(getStepsTimerID)
            }
        },

        updateStepBuffer: async function(step_data) {
            // wait until all the steps have been parsed by parseStep
            // this also updates the min step number for the next request
            await this.parseStep(Object.values(step_data))

            // keep requesting steps until we retrieved them all, then terminate
            if (this.getMaxStepBuffer < parseInt(this.getTotalMissionHours)) {
                this.stepBufferTimer()
            }
            else {
                this.SETTERMINATED(true)
            }
        },

        killGame: async function() {
            // See https://github.com/kstaats/simoc-web/issues/51#issuecomment-524494720
            // for some background on this method.
            // Stop the get_steps timer and tell the server
            // to stop calculating steps
            const localHost = "http://localhost:8000"
            const path = "/kill_game"
            const killRoute = this.getUseLocalHost ? localHost + path : path

            this.SETTERMINATED(true)  // terminate the sim
            // stop timer that sends requests to get_steps
            if (this.getGetStepsTimerID != null) {
                window.clearTimeout(this.getGetStepsTimerID)
                this.SETGETSTEPSTIMERID(null)
            }

            const params = {game_id: this.getGameID}
            try{
                axios.post(killRoute, params)  // kill the game
                console.log('Simulation stopped.')
            }catch(error){
                console.log(error)
            }
        },

    },
    watch:{
        // this method pauses the current simulation if the current step
        // is at or beyond the amount of steps that are currently buffered
        getCurrentStepBuffer: function() {
            // check that we have values in the buffer to avoid pausing
            // the timer when current/max are set to 0 at the beginning
            if ((this.getMaxStepBuffer > 1) &&
                (this.getCurrentStepBuffer >= this.getMaxStepBuffer)) {
                this.PAUSETIMER()
            }
        },
        getStopped: function() {
            // if the simulation got stopped, tell the server
            if (this.getStopped) {
                this.killGame()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .base-dashboard-wrapper{
        width: 100vw;
        height: 100vh;
        min-width: 100vw;
        min-height: 100vh;
        overflow:hidden;
        position:relative;
    }
</style>
