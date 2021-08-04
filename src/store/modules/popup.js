export default {
    state: {
        modalActive: false,
        modalMessage: null,
        confirmCallback: null,
    },
    getters: {
        getModalActive: state => state.modalActive,
        getModalMessage: state => state.modalMessage,
        getConfirmCallback: state => state.confirmCallback,
    },
    mutations: {
        SETMODALACTIVE(state, value) {
            state.modalActive = value
        },
        SETMODALMESSAGE(state, value) {
            state.modalMessage = value
        },
        SETCONFIRMCALLBACK(state, value) {
            state.confirmCallback = value
        },
    },
    actions: {
        modalAlert({commit}, message) {
            commit('SETMODALMESSAGE', message)
            commit('SETMODALACTIVE', true)
        },
        modalConfirm({commit}, payload) {
            const {message, confirmCallback} = payload
            // TODO: add 'keepTimerPaused' arg for using functions from survey PR
            commit('SETMODALMESSAGE', message)
            commit('SETCONFIRMCALLBACK', confirmCallback)
            commit('SETMODALACTIVE', true)
        },
        executeCallback({state}) {
            state.confirmCallback()
        },
    },
}
