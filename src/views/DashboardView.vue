<template>
    <div class="base-dashboard-wrapper" :style="{ 'background-image': 'url(' + bgImage + ')' }">
        <router-view />
    </div>
</template>

<script>
import axios from 'axios'

import io from 'socket.io-client'

import {storeToRefs} from 'pinia'
import {idleMixin} from '../javascript/mixins'
import {useDashboardStore} from '../store/modules/DashboardStore'
import {useWizardStore} from '../store/modules/WizardStore'
import {useLiveStore} from '../store/modules/LiveStore'
import {useModalStore} from '../store/modules/ModalStore'
import b2Url from '@/assets/b2-bg.jpg'
import marsUrl from '@/assets/mars-bg.jpg'

export default {
    mixins: [idleMixin],

    beforeRouteLeave(to, from, next) {
        // Triggered when leaving the dashboard to go to another page.
        // This might happen when the user starts a new sim or logs off,
        // but also when clicking on the browser back button.
        // Cases where the user closes the tab or refreshes are handled
        // in DashboardView.

        // Ensure the menu on the Dashboard is closed before showing any modal.
        this.menuActive = false
        if (this.leaveWithoutConfirmation ||
            (this.kioskMode && this.countdownEnded)) {
            this.leaveWithoutConfirmation = false  // reset value
            next()  // proceed without asking questions
        } else {
            // Stop/close the countdown modal if it's still open
            // (e.g. when the user press the back button during the countdown)
            if (this.kioskMode) {
                this.stopCountdownTimer()
            }
            // Make user to confirm before exiting.
            const confirmExit = () => {
                this.confirm({
                    message: 'Terminate simulation and leave?  All unsaved data will be lost.',
                    confirmCallback: () => next(),
                })
            }
            // Prompt user to take the feedback survey *only* the first time (per session)
            if (!this.surveyWasPrompted && !this.kioskMode &&
                import.meta.env.MODE !== 'development') {
                // Remove the listener so user can add spaces in survey fields
                window.removeEventListener('keydown', this.keyListener)
                this.showSurvey({prompt: true, onUnload: () => {
                    // Re-add listener in case user decides to stay
                    window.addEventListener('keydown', this.keyListener)
                    confirmExit()
                }})
            } else {
                confirmExit()
            }
        }
    },

    setup() {
        const dashboard = useDashboardStore()
        const wizard = useWizardStore()
        const liveStore = useLiveStore()
        const modal = useModalStore()
        const {
            getStepsTimerID, stopped, terminated, parameters, isTimerRunning,
            currentStepBuffer, maxStepBuffer, loadFromSimData, timerID,
            menuActive, currentMode, kioskMode, leaveWithoutConfirmation, simLocation,
        } = storeToRefs(dashboard)
        const {getTotalMissionHours} = storeToRefs(wizard)
        const {bundleNum, initBundleNum} = storeToRefs(liveStore)
        const {surveyWasPrompted, countdownEnded} = storeToRefs(modal)
        const {
            setMinStepNumber, initGame, parseStep, startTimer, pauseTimer,
            stopTimer, setCurrentStepBuffer, setStopped,
        } = dashboard
        const {setLiveConfig} = wizard
        const {setHabitatInfo, setSensorInfo, parseData} = liveStore
        const {confirm, showSurvey, stopCountdownTimer} = modal
        return {
            getStepsTimerID, stopped, terminated, parameters, isTimerRunning,
            currentStepBuffer, maxStepBuffer, loadFromSimData, timerID,
            menuActive, currentMode, kioskMode, leaveWithoutConfirmation, simLocation,
            setMinStepNumber, initGame, parseStep, startTimer, pauseTimer,
            stopTimer, setCurrentStepBuffer, setStopped, getTotalMissionHours,
            setLiveConfig, bundleNum, initBundleNum,
            setHabitatInfo, setSensorInfo, parseData, surveyWasPrompted, countdownEnded,
            confirm, showSurvey, stopCountdownTimer,
        }
    },

    data() {
        return {
            socket: null,  // the websocket used to get the steps
        }
    },

    computed: {
        // Returns the imported static urls for the page backgrounds of mars and earth
        bgImage() {
            if (this.simLocation === 'b2') {
                return b2Url
            } else {
                return marsUrl
            }
        },
    },

    watch: {
        // this method pauses the current simulation if the current step
        // is at or beyond the amount of steps that are currently buffered
        currentStepBuffer() {
            // check that we have values in the buffer to avoid pausing
            // the timer when current/max are set to 0 at the beginning
            if ((this.currentMode !== 'live') &&  // Doesn't apply to live mode
                (this.maxStepBuffer > 1) &&
                (this.currentStepBuffer >= this.maxStepBuffer)) {
                this.pauseTimer()
            }
        },
        stopped() {
            // if the simulation got stopped, tell the server
            if (this.stopped) {
                this.killGame()
            }
        },
    },

    beforeMount() {
        // reinitialize everything, init a new game, and request steps num before mounting

        // Kill the timer if there is still one running somehow
        this.stopTimer()
        // do the same with the get_steps timer
        if (this.getStepsTimerID) {
            window.clearTimeout(this.getStepsTimerID)
        }
        // reset more variables
        // the buffer current should be 0 so its value is updated when step 1 is received
        this.timerID = null
        this.getStepsTimerID = null
        this.currentStepBuffer = 0
        this.menuActive = false
        this.setMinStepNumber(0)  // Currently unused
        this.setStopped(false)

        // TODO: we switched from using a timer to request steps via HTTP to
        // websockets, but for now all the old code is still there.
        // Once the websockets work properly, all that code can be removed.
        // The switch happens in this.requestStepsNum()

        // reset the websocket
        this.request_sent = false  // true if we already sent a req to get_steps
        this.tearDownWebSocket()

        if (this.currentMode === 'live') {
            console.log('Starting live dashboard')
            this.maxStepBuffer = 0  // Reset the max buffer value
            this.initBundleNum = null  // Reset initBundleNum to null
            this.setupLiveWebsocket()
        } else if (this.loadFromSimData) {
            // if we load simdata, we only need to set terminated to true
            this.terminated = true
        } else {
            // for new sims, reset a few more values, init the game, and request steps
            this.maxStepBuffer = 0  // Reset the max buffer value
            // init a new game, set game id, reset all data buffers
            this.initGame(this.parameters.game_id)

            console.log('Starting simulation', this.parameters.game_id)

            // Ask the user confirmation if they try to leave (by closing
            // the tab/window, by refreshing, or by navigating elsewhere)
            // and try to kill the game when they do.  Leaving via the
            // back button is handled in BaseDashboard.beforeRouteLeave
            window.addEventListener('beforeunload', this.confirmBeforeLeaving)
            window.addEventListener('unload', this.killGameOnUnload)
            // setup the websocket to get the requested steps
            this.setupWebsocket()
        }
        // after this, the Timeline component will be mounted
        // and it will start the timer that shows the steps
    },

    mounted() {
        // add keyboard shortcuts -- see the keyListener method below
        window.addEventListener('keydown', this.keyListener)
    },

    beforeUnmount() {
        // if the sim is still running upon leaving the page, stop it;
        // some methods in DashboardMenu.vue rely on this to stop the sim
        this.stopTimer()   // stop the step timer
        this.menuActive = false  // close the menu if it was open
        if (!this.terminated) {
            this.killGame()
        }
        // disconnect and destroy the websocket
        this.tearDownWebSocket()
        // remove these if when we leave the dashboard
        window.removeEventListener('beforeunload', this.confirmBeforeLeaving)
        window.removeEventListener('unload', this.killGameOnUnload)
        window.removeEventListener('keydown', this.keyListener)
    },

    methods: {
        setupWebsocket() {
            const socket = io()
            this.socket = socket
            // console.log('socket created:', this.socket)

            socket.on('connect', () => {
                // This is triggered when the websocket is first connected but also
                // if the websocket gets disconnected and reconnects automatically
                const req = {data: this.parameters}
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
                this.parseStep(msg.data)
                // console.log('Received and parsed', Object.keys(msg.data).length, 'steps')
            })
            socket.on('steps_sent', msg => {
                console.log(msg.message)
                this.terminated = true
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

        // This method opens a websocket and keeps it open until a user navigates
        // away from the dashboard. This method is called if current mode is 'live'.
        setupLiveWebsocket() {
            // Connect to the simoc-sam SocketIO Server
            const socket = io(`http://${window.location.hostname}:8081`)
            this.socket = socket
            console.log('Live socket created:', this.socket)
            socket.on('connect', msg => {
                console.log('Connected to server')
                console.log('Registering client')
                this.socket.emit('register-client')
            })
            socket.on('hab-info', config => {
                console.log('Received habitat info:', config)
                this.setHabitatInfo(config)
            })
            socket.on('sensor-info', info => {
                console.log('Received sensor info:', info)
                this.setSensorInfo(info)
                console.log('Requesting step data')
                this.socket.emit('send-step-data')
            })
            socket.on('step-batch', data => {
                // If initBundleNum is null set it to the first n sent in the bundle of data.
                // This indicates that a client has made an initial connection to the live dashboard.
                if (this.initBundleNum === null) {
                    console.log(`Initial bundle_num: ${data[0].n}`)
                    this.initBundleNum = data[0].n
                }
                // Send bundle to parseData in the livedata store for parsing
                this.parseData(data)
                this.setLiveConfig({duration: {amount: this.bundleNum}}, this.simLocation)  // Sets the totalMissionHours
                this.maxStepBuffer = this.bundleNum
            })
            socket.on('disconnect', msg => {
                console.log('Server disconnected')
                this.initBundleNum = null
                this.currentStepBuffer = 0
                this.maxStepBuffer = 0
                this.setMinStepNumber(0)
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
            const stepToParams = {step_num: this.getTotalMissionHours,
                                  game_id: this.parameters.game_id}
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
            const stepParams = this.parameters  // filter parameters stored in dashboard store

            if (!this.terminated) {
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
                this.getStepsTimerID = getStepsTimerID
            }
        },

        async updateStepBuffer(step_data) {
            // replaced by websockets

            // wait until all the steps have been parsed by parseStep
            // this also updates the min step number for the next request
            await this.parseStep(Object.values(step_data))

            // keep requesting steps until we retrieved them all, then terminate
            if (this.maxStepBuffer < parseInt(this.getTotalMissionHours, 10)) {
                this.stepBufferTimer()
            } else {
                this.terminated = true
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
            if (!this.loadFromSimData && this.currentMode !== 'live') {
                // tell the server to kill the game, unless we loaded simdata
                const params = {game_id: this.parameters.game_id}
                try {
                    axios.post('/kill_game', params)  // kill the game
                    console.log('Simulation stopped.')
                } catch (error) {
                    console.log(error)
                }
            }
            this.terminated = true  // terminate the sim
            // stop timer that sends requests to get_steps
            if (this.getStepsTimerID !== null) {
                window.clearTimeout(this.getStepsTimerID)
                this.getStepsTimerID = null
            }
        },

        killGameOnUnload() {
            // use sendBeacon to reliably send a kill_game during unload
            const params = {game_id: this.parameters.game_id}
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
            const sb = this.currentStepBuffer
            const setStep = v => {
                this.setCurrentStepBuffer(v)
            }
            switch (e.key) {
                case ' ':
                    if (this.isTimerRunning) {
                        this.pauseTimer()
                    } else {
                        this.startTimer()
                    }
                    break
                case 'ArrowLeft':
                    setStep(sb - 1)
                    break
                case 'ArrowRight':
                    setStep(sb + 1)
                    break
                case 'ArrowUp':
                    setStep(sb - 10)
                    break
                case 'ArrowDown':
                    setStep(sb + 10)
                    break
                case 'PageUp':
                    setStep(sb - 24)
                    break
                case 'PageDown':
                    setStep(sb + 24)
                    break
                case 'Home':
                    setStep(1)
                    break
                case 'End':
                    setStep(this.maxStepBuffer)
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
        background-attachment: fixed;
        background-size: cover;
        background-position: 50% 10%;
    }
</style>
