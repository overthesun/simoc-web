import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex)
export default new Vuex.Store({
    modules,
    state: {
        gameID: "",
    },
    mutations: {
        SETGAMEID: function(state, value) {
            state.gameID = value
        },
    },
    actions: {},
    getters: {
        getGameID: state => state.gameID,
    },
})
