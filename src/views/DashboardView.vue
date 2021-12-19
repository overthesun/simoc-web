<template>
    <div class="base-dashboard-wrapper">
        <router-view />
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import axios from 'axios'

import io from 'socket.io-client'

export default {
    data() {
        return {
            socket: null,  // the websocket used to get the steps
        }
    },

    computed: {
        // getters from the vuex stores
        ...mapGetters('dashboard', ['getGetStepsTimerID', 'getStopped', 'getTerminated',
                                    'getIsTimerRunning', 'getStepParams', 'getCurrentStepBuffer',
                                    'getMaxStepBuffer', 'getLoadFromSimData',
                                    'getLoadFromLiveData', 'getGameConfig']),
        ...mapGetters('wizard', ['getTotalMissionHours', 'getConfiguration']),
        ...mapGetters(['getGameID']),
    },

    watch: {
        // this method pauses the current simulation if the current step
        // is at or beyond the amount of steps that are currently buffered
        getCurrentStepBuffer() {
            // check that we have values in the buffer to avoid pausing
            // the timer when current/max are set to 0 at the beginning
            if ((this.getMaxStepBuffer > 1) &&
                (this.getCurrentStepBuffer >= this.getMaxStepBuffer)) {
                this.PAUSETIMER()
            }
        },
        getStopped() {
            // if the simulation got stopped, tell the server
            if (this.getStopped) {
                this.killGame()
            }
        },
    },

    beforeMount() {
        // TODO: Ryan, Refactor lines 51-74--place these in the first if-block on line 78 as they
        //  are related to setting up the sim dashboard. Currently, the mock data used by the live
        //    dashboard needs lines 51-74 so that it is properly reset but the actual data that
        //    the live dashboard is to receive will not contain these values

        // reinitialize everything, init a new game, and request steps num before mounting

        // Kill the timer if there is still one running somehow
        this.STOPTIMER()
        // do the same with the get_steps timer
        if (this.getGetStepsTimerID) {
            window.clearTimeout(this.getGetStepsTimerID)
        }
        // reset more variables
        // the buffer current should be 0 so its value is updated when step 1 is received
        this.SETTIMERID(null)          // Set the timerID to null
        this.SETGETSTEPSTIMERID(null)  // Set the getStepsTimerID to null
        this.SETBUFFERCURRENT(0)       // Reset the current buffer value
        this.SETMINSTEPNUMBER(0)       // Reset the starting step
        this.SETSTOPPED(false)         // Reset stopped and terminated flags

        // TODO: we switched from using a timer to request steps via HTTP to
        // websockets, but for now all the old code is still there.
        // Once the websockets work properly, all that code can be removed.
        // The switch happens in this.requestStepsNum()

        // reset the websocket
        this.request_sent = false  // true if we already sent a req to get_steps
        this.tearDownWebSocket()

        if (this.getLoadFromLiveData) {
        // This block is executed when loadFromLiveData is true. It navigates the
        // user to a dashboard view of live sensor readings
            this.SETBUFFERMAX(0)  // Reset the max buffer value
            console.log('Starting live dashboard')
            this.openWebSocket()

            // if we load the simulation data, there's nothing else to do, otherwise
            // we have to reset a few more values, init the game, and request steps
        } else if (!this.getLoadFromSimData) {
            this.SETBUFFERMAX(0)  // Reset the max buffer value
            // if we load from initial live data, we have to reconfigure the Dashboard View to
            // present components relevant to the live view

            // init a new game, set game id, reset all data buffers
            this.INITGAME(this.getGameID)
            // This sets the get_step parameter for the agentGrowth filter.
            // TODO: this should actually be done in tandem with the config wizard plant updates.
            // This must be done after INITGAME or it will be reset
            this.SETPLANTSPECIESPARAM(this.getConfiguration)

            console.log('Starting simulation', this.getGameID)

            // Ask the user confirmation if they try to leave (by closing
            // the tab/window, by refreshing, or by navigating elsewhere)
            // and try to kill the game when they do.  Leaving via the
            // back button is handled in BaseDashboard.beforeRouteLeave
            window.addEventListener('beforeunload', this.confirmBeforeLeaving)
            window.addEventListener('unload', this.killGameOnUnload)
            // setup the websocket to get the requested steps

            //   this function includes step setup for calculating sim data.
            this.setupWebsocket()

            // after this, the Timeline component will be mounted
            // and it will start the timer that shows the steps
        }
    },

    mounted() {
        // add keyboard shortcuts -- see the keyListener method below
        window.addEventListener('keydown', this.keyListener)
    },

    beforeUnmount() {
        // If the mounted dashboard is running a sim, kill the game. The live dashboard is still
        // collecting data even if the user is not watching the dashboard. It should not tell
        // the server to kill the process.

        // if the sim is still running upon leaving the page, stop it;
        // some methods in DashboardMenu.vue rely on this to stop the sim
        this.STOPTIMER()   // stop the step timer
        this.SETMENUACTIVE(false)  // close the menu if it was open
        if (!this.getTerminated) {
            this.killGame()
        }
        // disconnect and destroy the websocket
        this.tearDownWebSocket()
        // remove these if when we leave the dashboard
        window.removeEventListener('beforeunload', this.confirmBeforeLeaving)
        window.removeEventListener('unload', this.killGameOnUnload)
        window.removeEventListener('keydown', this.keyListener)

        // Ensure loadFromLiveData is false when user navigates from live dashboard
        // so the conditional allows the user to access the sim dashboard as desired.
        if (this.getLoadFromLiveData) {
            console.log('* Navigating from the live dashboard...')
            this.SETLOADFROMLIVEDATA(false)
        }
    },

    methods: {
        ...mapMutations('dashboard', ['STARTTIMER', 'PAUSETIMER', 'STOPTIMER', 'SETTIMERID',
                                      'SETGETSTEPSTIMERID', 'SETMINSTEPNUMBER', 'INITGAME',
                                      'SETBUFFERCURRENT', 'UPDATEBUFFERCURRENT', 'SETBUFFERMAX',
                                      'SETSTOPPED', 'SETTERMINATED', 'SETMENUACTIVE',
                                      'SETPLANTSPECIESPARAM', 'SETLOADFROMLIVEDATA']),
        // getStepBatch Getter receives the entire batch of step_data from the store which
        // can be sent to parseStep in the dashboard store. See store/modules/step.js
        ...mapGetters('step', ['getStepBatch']),
        // Action used for parsing the get_step response on completion of retrieval.
        // See the store/modules/dashboard.js.
        ...mapActions('dashboard', ['parseStep']),
        // parseData Action parses the sensor data sent from the simoc-sam to create step_data.
        // See store/modules/step.js
        ...mapActions('step', ['parseData']),

        setupWebsocket() {
            const socket = io()
            this.socket = socket
            // console.log('socket created:', this.socket)

            socket.on('connect', () => {
                // This is triggered when the websocket is first connected but also
                // if the websocket gets disconnected and reconnects automatically
                const req = {data: this.getStepParams}
                // TODO: before using websockets, we requested a batch of n_steps steps,
                // but now this is no longer necessary since we request them all at once,
                // so the store should be updated to match getTotalMissionHours,
                // or getting rid of n_steps altogether
                req.data.n_steps = this.getTotalMissionHours
                // the req includes the min_step_num -- in case of reconnection,
                // it will requests steps starting from the last received + 1
                this.socket.emit('get_steps', req)
                console.log('Requesting', this.getTotalMissionHours,
                            this.request_sent?'steps again':'steps')
                this.request_sent = true
            })
            socket.on('step_data_handler', msg => {
                // console.log('step_data_handler called, received:', msg)
                this.parseStep(Object.values(msg.data))
                // console.log('Received and parsed', Object.keys(msg.data).length, 'steps')
            })
            socket.on('steps_sent', msg => {
                console.log(msg.message)
                // disconnect once we got all the steps
                this.tearDownWebSocket()
            })
            socket.on('user_connected', msg => {
                console.log(msg.message)
            })
            socket.on('disconnect', msg => {
                console.log('Websocket disconnected')
            })
        },
        // openWebSocket: This method opens a websocket and keeps it open until a user navigates
        // away from the dashboard. This method is called if loadFromLiveData is true.
        openWebSocket() {
            // To connect to the simoc-sam, specify the port here
            const socket = io('http://localhost:8081')

            this.socket = socket
            console.log('Live socket created:', this.socket)

            socket.on('connect', msg => {
                console.log('Connected to server')
                console.log('Registering client')

                this.socket.emit('register-client')
            })
            socket.on('hab-info', config => {
                // TODO: Set sam-config here using meta data from simoc-sam
                // TODO: or Get whole sam-config here
                console.log('Received habitat info:', config)
                console.log('Requesting step data')

                this.socket.emit('send-step-data')
            })
            socket.on('step-batch', data => {
                console.log(`Received a batch of ${data.length} step from the server:`)

                // send batch to parseData in the step store for parsing
                this.parseData(data)
                this.parseStep(this.getStepBatch())
            })
            socket.on('disconnect', msg => {
                console.log('Server disconnected')
            })
        },

        tearDownWebSocket() {
            if (this.socket !== null) {
                if (this.socket.connected) {
                    console.log('Disconnecting user')
                    this.socket.emit('user_disconnected')
                    this.socket.disconnect()
                }
                this.socket = null
            }
        },

        async requestStepsNum() {
            // tell the backend how many steps we need for this game

            // use the total number of mission hours as the number of steps to be calculated
            const stepToParams = {step_num: this.getTotalMissionHours, game_id: this.getGameID}
            try {
                // begin creating the step buffer on the backend using
                // the entire length of the simulation as the base
                await axios.post('/get_step_to', stepToParams)
                // TODO: the stepBufferTimer() function has been replaced by websocket
                // and can now be removed.
                // this.stepBufferTimer() // If everything went retrieve the first batch of steps.
                this.setupWebsocket()  // setup the websocket to get the requested steps
            } catch (error) {
                console.log(error)
            }
        },

        async stepBufferTimer() {
            // replaced by websockets
            const stepParams = this.getStepParams  // filter parameters stored in dashboard store

            if (!this.getTerminated) {
                // if the sim is not terminated, set a timer that will
                // retrieve and parse a batch of step
                const getStepsTimerID = setTimeout(async() => {
                    try {
                        const response = await axios.post('/get_steps', stepParams)
                        this.updateStepBuffer(response.data.step_data)
                    } catch (error) {
                        console.log(error)
                        this.stepBufferTimer()  // retry
                    }
                }, 2000)
                this.SETGETSTEPSTIMERID(getStepsTimerID)
            }
        },

        async updateStepBuffer(step_data) {
            // replaced by websockets

            // wait until all the steps have been parsed by parseStep
            // this also updates the min step number for the next request
            await this.parseStep(Object.values(step_data))

            // keep requesting steps until we retrieved them all, then terminate
            if (this.getMaxStepBuffer < parseInt(this.getTotalMissionHours, 10)) {
                this.stepBufferTimer()
            } else {
                this.SETTERMINATED(true)
            }
        },

        confirmBeforeLeaving(event) {
            // Use standard browser modal to ask the user before leaving
            event.preventDefault()
            event.returnValue = 'All unsaved data will be lost.'
            return 'All unsaved data will be lost.'
        },

        async killGame() {
            // See https://github.com/kstaats/simoc-web/issues/51#issuecomment-524494720
            // for some background on this method.
            // Stop the get_steps timer and tell the server
            // to stop calculating steps.
            if (!this.getLoadFromSimData) {
                // tell the server to kill the game, unless we loaded simdata
                const params = {game_id: this.getGameID}
                try {
                    axios.post('/kill_game', params)  // kill the game
                    console.log('Simulation stopped.')
                } catch (error) {
                    console.log(error)
                }
            }
            this.SETTERMINATED(true)  // terminate the sim
            // stop timer that sends requests to get_steps
            if (this.getGetStepsTimerID !== null) {
                window.clearTimeout(this.getGetStepsTimerID)
                this.SETGETSTEPSTIMERID(null)
            }
        },

        killGameOnUnload() {
            // use sendBeacon to reliably send a kill_game during unload
            const params = {game_id: this.getGameID}
            const status = navigator.sendBeacon('/kill_game', JSON.stringify(params))
            if (status) {
                console.log('Simulation terminated.')
            }
        },

        keyListener(e) {
            // Listen for these keypresses on the keyboard:
            //   spacebar: play/pause
            //   left/right arrows: ±1 step
            //   down/up arrows: ±10 steps
            //   pagedown/pageup arrows: ±24 steps
            //   home/end: first/last step
            //   +/-: increase/decrease speed*
            //
            // * since the logic of the speed is more complex,
            //   this is handled in the SpeedControl component
            //
            // console.log('key:', e.key)

            let key_matched = true
            switch (e.key) {
                case ' ':
                    if (this.getIsTimerRunning) {
                        this.PAUSETIMER()
                    } else {
                        this.STARTTIMER()
                    }
                    break
                case 'ArrowLeft':
                    this.UPDATEBUFFERCURRENT(this.getCurrentStepBuffer-1)
                    break
                case 'ArrowRight':
                    this.UPDATEBUFFERCURRENT(this.getCurrentStepBuffer+1)
                    break
                case 'ArrowUp':
                    this.UPDATEBUFFERCURRENT(this.getCurrentStepBuffer-10)
                    break
                case 'ArrowDown':
                    this.UPDATEBUFFERCURRENT(this.getCurrentStepBuffer+10)
                    break
                case 'PageUp':
                    this.UPDATEBUFFERCURRENT(this.getCurrentStepBuffer-24)
                    break
                case 'PageDown':
                    this.UPDATEBUFFERCURRENT(this.getCurrentStepBuffer+24)
                    break
                case 'Home':
                    this.UPDATEBUFFERCURRENT(1)
                    break
                case 'End':
                    this.UPDATEBUFFERCURRENT(this.getMaxStepBuffer)
                    break
                default:
                    key_matched = false  // no key matched
                    break
            }
            if (key_matched) {
                e.preventDefault()
            }
        },
    },
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
