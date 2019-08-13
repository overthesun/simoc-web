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
        // reinitialize everything before mounting
        this.SETGAMEID(this.getGameID)  //Set the game id for the get_step parameters

        // Kill the timer if there is still one running somehow
        this.STOPTIMER()
        // do the same with the get_steps timer
        if(this.getGetStepsTimerID){
            window.clearTimeout(this.getGetStepsTimerID)
        }
        console.log('Starting simulation', this.getGameID)
        this.SETTIMERID(undefined)          // Set the timerID to undefined
        this.SETGETSTEPSTIMERID(undefined)  // Set the getStepsTimerID to undefined
        this.SETBUFFERCURRENT(1)            // Reset the current buffer value
        this.SETBUFFERMAX(1)                // Reset the max buffer value
        this.SETMINSTEPNUMBER(1)            // Reset the starting step
        this.SETTERMINATED(false)           // Reset the termination conditions have been met flag
        //This sets the get_step paramter for the totalAgentMass filter. This should actually be done
        //in tandem with the configuration wizard plant updates.
        this.SETPLANTSPECIESPARAM(this.getConfiguration)
        this.initialSetup()

        /*
        //This is the timer object that will be called whenever the step number is increased.
        //It defaults to being called every second. Also this is not started until at least 100 steps have been buffered in.
        //See below methods for where the timer is started.
        let stepTimer = new StepTimer( () => {
            this.UPDATEBUFFERCURRENT(this.getCurrentStepBuffer+1)
        },1000)

        this.SETTIMERID(stepTimer) // The timer is set within the dashboard store
        */


        //stepTimer.resume()
    },
    computed:{
        //Getterss from the vuex stores
        ...mapGetters('dashboard',['getTimerID','getGetStepsTimerID','getIsTimerRunning','getUpdateTimer','getTerminated','getStepParams','getCurrentStepBuffer','getMaxStepBuffer','getTotalProduction','getTotalConsumption','getAirStorageRatio']),
        ...mapGetters(['getGameID']),
        ...mapGetters('wizard',['getTotalMissionHours','getConfiguration']),
        ...mapGetters(['getUseLocalHost']),

    },
    methods:{
        //
        ...mapMutations('dashboard',['SETPLANTSPECIESPARAM','STARTTIMER','SETTIMERID','SETGETSTEPSTIMERID','SETUPDATETIMER','SETBUFFERCURRENT','UPDATEBUFFERCURRENT','SETBUFFERMAX','SETGAMEID','SETMINSTEPNUMBER','SETNSTEPS','SETTERMINATED','PAUSETIMER','STOPTIMER']),
        //Action used for paring the get_step response on completion of retrieval. SEE dashboard store.
        ...mapActions('dashboard',['parseStep']),


        initialSetup: async function(){
            const localHost = "http://localhost:8000"
            const getStepToRoute = this.getUseLocalHost ? localHost + "/get_step_to" : "/get_step_to"

            const stepToParams = {step_num:this.getTotalMissionHours,game_id:this.getGameID} //Use the total number of mission hours as the number of steps to be calculated.
            const stepParams = this.getStepParams //Retrieve the parameters to used from the dashboard store
            try{
                await axios.post(getStepToRoute,stepToParams) //Begin creating the step buffer on the backend using the entire length of the simulation as the base
                this.stepBufferTimer() //If everything went retrieve the first batch of steps.
            }catch(error){
                console.log(error)
            }
        },

        stepBufferTimer: async function(){
            const localHost = "http://localhost:8000"
            const getStepsRoute = this.getUseLocalHost ? localHost +  "/get_steps" : "/get_steps"
            const stepParams = this.getStepParams //Filter parameters stored in dashboard store

            //If the termination conditiona hasn't been terminated yet.
            //Keep grabbing step batches
            if(!this.getTerminated){
                let getStepsTimerID = setTimeout( async () =>{
                    try{
                        const response = await axios.post(getStepsRoute,stepParams)  // Grab the batch of steps
                        this.updateStepBuffer(response.data.step_data)  // Call the function that will parse and reset the timer
                    }catch(error){
                        console.log(error)
                    }
                }, 500)
                this.SETGETSTEPSTIMERID(getStepsTimerID)
            }
        },

        updateStepBuffer: async function(step_data){
            //Add in termination condition check
            await this.parseStep(Object.values(step_data)) // Call the parseStep ACTION within dashboard to parse the steps. Wait until they have all been parsed.

            // keep requesting steps until we retrieved them all, then terminate
            if (this.getMaxStepBuffer < parseInt(this.getTotalMissionHours)) {
                this.stepBufferTimer()
            }
            else {
                this.SETTERMINATED(true)
            }
        },
    },
    watch:{
        // this method pauses the current simulation if the current step
        // is at or beyond the amount of steps that are currently buffered
        getCurrentStepBuffer: function() {
            if (this.getCurrentStepBuffer >= this.getMaxStepBuffer) {
                this.PAUSETIMER()
            }
        },
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
