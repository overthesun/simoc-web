/*
This store contains data & functions related to the ModalWindow component
which are used by other components.

The main tasks of the store are:
1. Package the modal into useful FUNCTIONS: alert, confirm, showMenu, showSurvey.
   These are placed in the store so any component in the application can access
   them without having to pass props through every level.

2. VALIDATE arguments to these functions. <ModalWindow /> updates when modalParams
   is changed, so this effectively prevents any activity by that component unless
   there is a valid input.

3. Set/store the modalParams variable. This is effectively the 'arguments' passed
   to the ModalWindow component.

4. Store the modalActive variable. This is set by ModalWindow but used by other
   components, e.g. by BaseDashboard to pause the timer when modal is open.
*/
import {defineStore} from 'pinia'

export const useModalStore = defineStore('ModalStore', {
    state: () => ({
        modalActive: false,
        modalParams: {},

        // Prompt user to take survey once, the first time they navigate back from the dashboard.
        surveyWasPrompted: false,

        // Dashboard has gone idle, present timeout modal
        countdownEnded: false,  //  Used to prevent back navigation to load timeout modal.
        timeoutCallback: null,  //  Timeout callback next() set in BaseDashboard.
        timer: null,  //  Built-in JavaScript function setInterval shared between components.
        secondsLeft: 0,  // The total time to react if the Dashboard detects an idle state.

        defaultParams: {
            type: null,
            logo: false,
            title: null,
            message: null,
            survey: false,
            join: false,
            buttons: [],
            onLoad: null,
            onUnload: null,
        },

        defaultButton: {
            type: null,
            text: '',
            callback: () => {},
        },
    }),
    getters: {
        getCountdownIsRunning: state => state.secondsLeft !== null,
    },
    actions: {
        setModalParams(payload) {
            // Start with a blank list of params that the ModalWindow component can take.
            // Go through each argument in payload. If it's on the list, use its value.
            const params = {...this.defaultParams}
            Object.keys(payload).forEach(arg => {
                if (!(arg in params)) {
                    throw new Error(`invalid parameter passed to modal: ${arg}`)
                }
                // Validate buttons the same way. In particular, button.callback() is always called,
                // so it should be set to an empty function if no callback is provided.
                if (arg === 'buttons') {
                    const buttons = []
                    payload.buttons.forEach(button => {
                        const newButton = {...this.defaultButton}
                        Object.entries(button).forEach(([key, value]) => {
                            if (key in newButton) {
                                newButton[key] = value
                            }
                        })
                        buttons.push(newButton)
                    })
                    params.buttons = buttons
                } else {
                    params[arg] = payload[arg]
                }
            })
            this.modalParams = params
        },
        resetModalParams() {
            this.params = this.defaultParams
        },
        // This mutator is called in the ModalWindow for modals of type timeout.
        startCountdownTimer() {
            // Updates secondsLeft displayed in the ModalWindow decremented every 1 second.
            this.timer = setInterval(() => {
                if (this.secondsLeft <= 0) {
                    clearInterval(this.timer)
                    this.modalActive = false
                    this.params = this.defaultParams
                    this.timeoutCallback()
                } else {
                    this.secondsLeft -= 1
                }
            }, 1000)
        },
        // This mutator is called in DashboardView when a user reacts to the idle state.
        stopCountdownTimer() {
            // Clear the current timer and hide the modal window.
            clearInterval(this.timer)
            this.countdownEnded = false
            this.secondsLeft = null
            this.modalActive = false
            this.params = this.defaultParams
        },
        // Show top-level navigation. Typically used by menu icon in nav bar.
        showMenu(message) {
            this.setModalParams(message)
        },
        // Show a text message with 'ok' button.
        alert(message) {
            this.setModalParams({
                type: 'alert',
                message: message,
                buttons: [{text: 'Ok'}],
            })
        },
        // Show text with ok / cancel buttons, execute a callback function if user clicks 'ok'
        confirm(payload) {
            const {message, confirmCallback} = payload
            this.setModalParams({
                type: 'confirm',
                message: message,
                buttons: [
                    {text: 'Cancel', type: 'warning'},
                    {text: 'Ok', callback: confirmCallback},
                ],
            })
        },
        // Show text with countdown, executes callback function if secondsLeft counts down to 0.
        timeout(payload) {
            const {message, secondsLeft, timeoutCallback} = payload
            this.setModalParams({
                type: 'timeout',
                message: message,
            })
            this.timeoutCallback = timeoutCallback
            this.secondsLeft = secondsLeft
        },
        // Show the user survey. Typically used by a 'Give Feedback' button.
        showSurvey(payload) {
            const {prompt, onUnload} = payload
            if (prompt) {
                this.surveyWasPrompted = true
            }
            this.setModalParams({
                logo: true,
                title: 'Survey',
                survey: true,
                onUnload: onUnload,
            })
        },
    },
})
