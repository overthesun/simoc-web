export default {
    state: {
        popupActive: false,
        popupMessage: null,
        confirmCallback: null,
    },
    getters: {
        getPopupActive: state => state.popupActive,
        getPopupMessage: state => state.popupMessage,
        getConfirmCallback: state => state.confirmCallback
    },
    mutations: {
        SETPOPUPACTIVE(state, value) {
            state.popupActive = value
        },
        SETPOPUPMESSAGE(state, value) {
            state.popupMessage = value
        },
        SETCONFIRMCALLBACK(state, value) {
            state.confirmCallback = value
        }
        },
    actions: {
        popupAlert({commit}, message) {
            commit('SETPOPUPMESSAGE', message)
            commit('SETPOPUPACTIVE', true)
        },
        popupConfirm({commit}, payload) {
            console.log("confirming")
            const {message, confirmCallback} = payload
            commit('SETPOPUPMESSAGE', message)
            commit('SETCONFIRMCALLBACK', confirmCallback)
            commit('SETPOPUPACTIVE', true)
        },
        executeCallback({state}) {
            state.confirmCallback()
        },
    }
}
