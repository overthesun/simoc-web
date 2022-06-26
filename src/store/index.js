import Vuex from 'vuex'
import modules from './modules'

export default Vuex.createStore({
    modules,
    state: {
        gameID: '',
    },
    mutations: {
        SETGAMEID(state, value) {
            state.gameID = value
        },
    },
    actions: {},
    getters: {
        getGameID: state => state.gameID,
    },
})
