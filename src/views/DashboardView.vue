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

import io from 'socket.io-client'

export default {
    data(){
        return{
            socket: null,  // the websocket used to get the steps
        }
    },
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
        this.SETMINSTEPNUMBER(0)            // Reset the starting step
        this.SETSTOPPED(false)              // Reset stopped and terminated flags

        // TODO: we switched from using a timer to request steps via HTTP to
        // websockets, but for now all the old code is still there.
        // Once the websockets work properly, all that code can be removed.
        // The switch happens in this.requestStepsNum()

        // reset the websocket
        this.tearDownWebSocket()

        // if we load the simulation data, there's nothing else to do, otherwise
        // we have to reset a few more values, init the game, and request steps
        if (!this.getLoadFromSimData) {
            this.SETBUFFERMAX(0)  // Reset the max buffer value
            // init a new game, set game id, reset all data buffers
            this.INITGAME(this.getGameID)
            // This sets the get_step parameter for the agentGrowth filter.
            // TODO: this should actually be done in tandem with the configuration wizard plant updates.
            // This must be done after INITGAME or it will be reset
            this.SETPLANTSPECIESPARAM(this.getConfiguration)

            console.log('Starting simulation', this.getGameID)

            // make sure that to stop the sim when the user closes the tab
            window.addEventListener('beforeunload', this.killGame)
            // this starts the timer that asks the steps to the backend
            this.requestStepsNum()
        }
        // after this, the Timeline component will be mounted
        // and it will start the timer that shows the steps
    },
    beforeDestroy: function() {
        // if the sim is still running upon leaving the page, stop it;
        // some methods in DashboardMenu.vue rely on this to stop the sim
        this.STOPTIMER()   // stop the step timer
        this.SETMENUACTIVE(false)  // close the menu if it was open
        if (!this.getTerminated) {
            this.killGame()
        }
        // disconnect and destroy the websocket
        this.tearDownWebSocket()
        // we don't need this anymore if the dashboard has been destroyed
        window.removeEventListener('beforeunload', this.killGame)
    },
    computed:{
        //Getterss from the vuex stores
        ...mapGetters('dashboard', ['getGetStepsTimerID','getStopped','getTerminated','getStepParams','getCurrentStepBuffer','getMaxStepBuffer','getLoadFromSimData']),
        ...mapGetters('wizard', ['getTotalMissionHours','getConfiguration']),
        ...mapGetters(['getGameID']),
    },
    methods:{
        //
        ...mapMutations('dashboard',['SETPLANTSPECIESPARAM','PAUSETIMER','STOPTIMER','SETTIMERID','SETGETSTEPSTIMERID','SETBUFFERCURRENT','SETBUFFERMAX','SETMINSTEPNUMBER','SETSTOPPED','SETTERMINATED','INITGAME','SETMENUACTIVE']),
        //Action used for paring the get_step response on completion of retrieval. SEE dashboard store.
        ...mapActions('dashboard',['parseStep']),

        setupWebsocket: function() {
            const socket = this.socket = io()
            console.log('socket created:', socket)

            socket.on('connect', () => {
                console.log('websocket connected')
                const req = {data: this.getStepParams}
                // before using websockets, we requested a batch of n_steps steps,
                // but now this is no longer necessary since we request them all at once,
                // so the store should be updated to match getTotalMissionHours,
                // or getting rid of n_steps altogether
                req['data']['n_steps'] = this.getTotalMissionHours
                socket.emit('get_steps', req)
                console.log('requested', this.getTotalMissionHours, 'steps')
            })
            socket.on('step_data_handler', (msg) => {
                console.log('step_data_handler called, received:', msg)
                this.parseStep(Object.values(msg.data))
                console.log('Received and parsed', Object.keys(msg.data).length, 'steps')
            })
            socket.on('steps_retrieved', (msg) => {
                console.log(msg.message)
                // disconnect once we got all the steps
                socket.emit('disconnect_request')
            })
            socket.on('user_connected', (msg) => {
                console.log(msg.message)
            })
            socket.on('user_disconnected', (msg) => {
                console.log(msg.message)
                // close the socket once the server ack'ed the disconnect_request
                this.tearDownWebSocket()
            })
        },

        tearDownWebSocket: function() {
            console.log('Closing the websocket')
            if (this.socket !== null) {
                if (this.socket.connected) {
                    this.socket.disconnect()
                }
                this.socket = null
            }
        },

        requestStepsNum: async function(){
            // tell the backend how many steps we need for this game

            // use the total number of mission hours as the number of steps to be calculated
            const stepToParams = {step_num:this.getTotalMissionHours, game_id:this.getGameID}
            try{
                // begin creating the step buffer on the backend using the entire length of the simulation as the base
                await axios.post('/get_step_to', stepToParams)
                // TODO: the stepBufferTimer() function has been replaced by websocket and can now be removed
                // this.stepBufferTimer() // If everything went retrieve the first batch of steps.
                this.setupWebsocket()  // setup the websocket to get the requested steps
            }catch(error){
                console.log(error)
            }
        },

        stepBufferTimer: async function() {
            // replaced by websockets
            const stepParams = this.getStepParams  // filter parameters stored in dashboard store

            if (!this.getTerminated) {
                // if the sim is not terminated, set a timer that will
                // retrieve and parse a batch of step
                let getStepsTimerID = setTimeout(async () => {
                    try {
                        const response = await axios.post('/get_steps', stepParams)
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
            // replaced by websockets

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
            this.SETTERMINATED(true)  // terminate the sim
            // stop timer that sends requests to get_steps
            if (this.getGetStepsTimerID != null) {
                window.clearTimeout(this.getGetStepsTimerID)
                this.SETGETSTEPSTIMERID(null)
            }

            const params = {game_id: this.getGameID}
            try{
                axios.post('/kill_game', params)  // kill the game
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
