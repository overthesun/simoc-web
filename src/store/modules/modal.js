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
    text: '',
    color: null,
    callback: () => {},
})

export default {
    state: {
        modalActive: false,
        modalParams: {},
    },
    getters: {
        getModalActive: state => state.modalActive,
        getModalParams: state => state.modalParams,
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
                // so it should be sent to an empty function if left blank.
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
    },
    actions: {
        modalAlert({commit}, message) {
            commit('SETMODALPARAMS', {
                type: 'alert',
                message: message,
                buttons: [{text: 'Ok'}],
            })
        },
        modalConfirm({commit}, payload) {
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
    },
}
