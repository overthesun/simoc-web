/*
This store contains data & functions related to the ModalWindow component
which are used by other components.

The main tasks of the store are:
1. Package the modal into useful FUNCTIONS: modalMenu, alert, confirm.
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
    color: null,
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
    },
    getters: {
        getModalActive: state => state.modalActive,
        getModalParams: state => state.modalParams,
        getSurveyComplete: state => state.surveyComplete,
    },
    mutations: {
        SETMODALACTIVE(state, value) {
            state.modalActive = value
        },
        SETMODALPARAMS(state, payload) {
            // Start with a blank list of params that the ModalWindow component can take.
            // Go through each argument in payload. If it's on the list, use its value.
            const params = getParams()
            const used = []
            const unused = []
            Object.keys(payload).forEach(arg => {
                // Validate buttons the same way. In particular, button.callback() is always called,
                // so it should be set to an empty function if no callback is provided.
                if (arg === 'buttons') {
                    const buttons = []
                    payload.buttons.forEach(button => {
                        const newButton = getButton()
                        Object.keys(button).forEach(key => {
                            if (key in newButton) {
                                newButton[key] = button[key]
                            }
                        })
                        buttons.push(newButton)
                    })
                    if (buttons.length > 0) {
                        params.buttons = buttons
                        used.push(arg)
                    } else {
                        unused.push(arg)
                    }
                } else if (arg in params) {
                    params[arg] = payload[arg]
                    used.push(arg)
                } else {
                    unused.push(arg)
                }
            })
            if (used.length === 0) {
                console.log('No recognized params for modal')
            } else {
                state.modalParams = params
            }
        },
        RESETMODALPARAMS(state) {
            state.params = getParams()
        },
        SETSURVEYCOMPLETE(state, value) {
            state.surveyComplete = value
        },
    },
    actions: {
        showMenu({commit}, message) {
            commit('SETMODALPARAMS', message)
        },
        alert({commit}, message) {
            commit('SETMODALPARAMS', {
                type: 'alert',
                message: message,
                buttons: [{text: 'Ok'}],
            })
        },
        confirm({commit}, payload) {
            const {message, confirmCallback} = payload
            commit('SETMODALPARAMS', {
                type: 'confirm',
                message: message,
                buttons: [
                    {text: 'Ok', callback: confirmCallback},
                    {text: 'Cancel', color: 'warning'},
                ],
            })
        },
        showSurvey({commit}) {
            commit('SETMODALPARAMS', {
                logo: true,
                title: 'Survey',
                survey: true,
            })
        },
    },
}
