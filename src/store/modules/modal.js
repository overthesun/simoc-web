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

const getParams = () => ({
    type: null,
    logo: false,
    title: null,
    message: null,
    survey: false,
    join: false,
    buttons: [],
    onLoad: null,
    onUnload: null,
})

const getButton = () => ({
    type: null,
    text: '',
    callback: () => {},
})

export default {
    state: {
        modalActive: false,
        modalParams: {},

        // Prompt user to take survey once, the first time they navigate back from the dashboard.
        surveyWasPrompted: false,

        // Dashboard has gone idle, present timeout modal
        timeoutWasActivated: false,  //  Used to prevent back navigation to load timeout modal.
        timeoutCallback: null,  //  Timeout callback next() set in BaseDashboard.
        timer: null,  //  Built-in JavaScript function setInterval shared between components.
        time: 0,  // The total time to react if the Dashboard detects an idle state.
    },
    getters: {
        getModalActive: state => state.modalActive,
        getModalParams: state => state.modalParams,
        getSurveyWasPrompted: state => state.surveyWasPrompted,
        getTimeoutWasActivated: state => state.timeoutWasActivated,
        getTime: state => state.time,
    },
    mutations: {
        SETMODALACTIVE(state, value) {
            state.modalActive = value
        },
        SETMODALPARAMS(state, payload) {
            // Start with a blank list of params that the ModalWindow component can take.
            // Go through each argument in payload. If it's on the list, use its value.
            const params = getParams()
            Object.keys(payload).forEach(arg => {
                if (!(arg in params)) {
                    throw new Error(`invalid parameter passed to modal: ${arg}`)
                }
                // Validate buttons the same way. In particular, button.callback() is always called,
                // so it should be set to an empty function if no callback is provided.
                if (arg === 'buttons') {
                    const buttons = []
                    payload.buttons.forEach(button => {
                        const newButton = getButton()
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
            state.modalParams = params
        },
        RESETMODALPARAMS(state) {
            state.params = getParams()
        },
        SETSURVEYWASPROMPTED(state, value) {
            state.surveyWasPrompted = value
        },
        SETTIMEOUTWASACTIVATED(state, value) {
            state.timeoutWasActivated = value
        },
        // This mutator is called in the ModalWindow for modals of type timeout.
        STARTTIMER(state) {
            // Updates the time variable displayed in the ModalWindow decremented every 1 second.
            state.timer = setInterval(() => {
                if (state.time <= 0) {
                    clearInterval(state.timer)
                    state.modalActive = false
                    state.params = getParams()
                    state.timeoutCallback()
                } else {
                    state.time -= 1
                }
            }, 1000)
        },
        // This mutator is called in DashboardView when a user reacts to the idle state.
        STOPTIMER(state) {
            // Clear the current timer and hide the modal window.
            clearInterval(state.timer)
            state.modalActive = false
            state.params = getParams()
        },
        SETTIMEOUTCALLBACK(state, value) {
            state.timeoutCallback = value
        },
        SETTIME(state, value) {
            state.time = value
        },
    },
    actions: {
        // Show top-level navigation. Typically used by menu icon in nav bar.
        showMenu({commit}, message) {
            commit('SETMODALPARAMS', message)
        },
        // Show a text message with 'ok' button.
        alert({commit}, message) {
            commit('SETMODALPARAMS', {
                type: 'alert',
                message: message,
                buttons: [{text: 'Ok'}],
            })
        },
        // Show text with ok / cancel buttons, execute a callback function if user clicks 'ok'
        confirm({commit}, payload) {
            const {message, confirmCallback} = payload
            commit('SETMODALPARAMS', {
                type: 'confirm',
                message: message,
                buttons: [
                    {text: 'Cancel', type: 'warning'},
                    {text: 'Ok', callback: confirmCallback},
                ],
            })
        },
        // Show text with countdown, executes callback function if the time counts down to 0.
        timeout({commit}, payload) {
            const {message, time, timeoutCallback} = payload
            commit('SETMODALPARAMS', {
                type: 'timeout',
                message: message,
            })

            commit('SETTIMEOUTCALLBACK', timeoutCallback)
            commit('SETTIME', time)
        },
        // Show the user survey. Typically used by a 'Give Feedback' button.
        showSurvey({commit}, payload) {
            const {prompt, onUnload} = payload
            if (prompt) {
                commit('SETSURVEYWASPROMPTED', true)
            }
            commit('SETMODALPARAMS', {
                logo: true,
                title: 'Survey',
                survey: true,
                onUnload: onUnload,
            })
        },
    },
}
