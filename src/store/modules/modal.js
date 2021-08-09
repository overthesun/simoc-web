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

        // TODO: surveyComplete works on a session-by-session basis, so a logged-in user
        // will see the option every time they re-open the site. A more complete solution
        // is to record it in the user database, and move this variable to the top-level store
        // next to gameId.
        surveyComplete: false,

        // Prompt user to take survey once, the first time they navigate back from the dashboard.
        surveyWasPrompted: false,
    },
    getters: {
        getModalActive: state => state.modalActive,
        getModalParams: state => state.modalParams,
        getSurveyComplete: state => state.surveyComplete,
        getSurveyWasPrompted: state => state.surveyWasPrompted,
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
        SETSURVEYCOMPLETE(state, value) {
            state.surveyComplete = value
        },
        SETSURVEYWASPROMPTED(state, value) {
            state.surveyWasPrompted = value
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
                    {text: 'Ok', callback: confirmCallback},
                    {text: 'Cancel', type: 'warning'},
                ],
            })
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
