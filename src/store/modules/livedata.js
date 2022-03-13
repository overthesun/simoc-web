/**
 * Live Data Store (livedata.js)
 *
 * This file contains the state for live data.
 *
 * Raw sensor data is sent from the backend simoc-sam. The data received is stored here into
 * live data objects read by the dashboard. The function parseData is responsible for assigning
 * the raw data into the proper state variable in the action block.
 *
 * @author  Ryan Meneses
 * @version 1.5
 * @since   March 1, 2022
 */
export default {
    state: {
        initBundleNum: null,  // Initial bundle number received by this client

        timestamp: {},  // time each bundle of sensor readings were sent
        bundleNum: 0,  // n sent by the server
        dataBundle: [],  // bundle of sensor readings
        sensorInfo: {},  // set from initial callback sensor-info sent by the server
    },
    getters: {
        getTimestamp: state => bundleNum => state.timestamp[bundleNum],
        getInitBundleNum: state => state.initBundleNum,
        getBundleNum: state => state.bundleNum,

        getSensorInfo: state => state.sensorInfo,
        getDataBundle: state => state.dataBundle,
    },
    mutations: {
        SETTIMESTAMP(state, value) {
            const {n: bundle} = value
            const {timestamp: t} = value

            const dateTime = t.split(' ')
            state.timestamp[bundle - state.initBundleNum] = {date: dateTime[0], time: dateTime[1]}
        },
        SETINITBUNDLENUM(state, value) {
            state.initBundleNum = value
        },
        SETBUNDLENUM(state, value) {
            const {n: bundle} = value

            // Adjust bundleNum from initBundleNum to start scrubber at 0
            state.bundleNum = bundle - state.initBundleNum
        },
        SETDATABUNDLE(state, value) {
            state.dataBundle.push(value)
        },
        SETSENSORINFO(state, value) {
            state.sensorInfo = value
        },
    },
    actions: {
        parseData({commit, getters}, data) {
            console.log(data)
            commit('SETDATABUNDLE', data)

            data.forEach(item => {
                commit('SETTIMESTAMP', item)
                commit('SETBUNDLENUM', item)
            })
        },
    },
}
