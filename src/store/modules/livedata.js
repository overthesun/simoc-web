/**
 * Live Data Store (livedata.js)
 *
 * This file contains the state for live data.
 *
 * Raw sensor data is sent from the backend, simoc-sam. The data received is stored here into
 * "live data" objects read by the Dashboard. The function parseData in the action block
 * assigns the state variables in this store by parsing the object formed from the raw
 * sensor data on the backend.
 *
 * @author  Ryan Meneses
 * @version 1.6.1
 * @since   March 15, 2022
 */
export default {
    state: {
        initBundleNum: null,  // initial bundle number received by this client
        sensorInfo: {},  // set from initial callback sensor-info sent by the server

        bundleNum: 0,  // n sent by the server
        readings: {},  // sensor readings from bundle sent by server
        timestamp: {},  // time each bundle of sensor readings were sent

        dataBundles: [],  // bundle of sensor readings
    },
    getters: {
        getInitBundleNum: state => state.initBundleNum,
        getSensorInfo: state => state.sensorInfo,

        getBundleNum: state => state.bundleNum,
        getReadings: state => bundleNum => state.readings[bundleNum],
        getTimestamp: state => bundleNum => state.timestamp[bundleNum],

        getDataBundles: state => state.dataBundles,
    },
    mutations: {
        /** Sets the initial bundle num detected by a new client. Used to start the
         *  Dashboard step_num (called 'n' in live-mode) from 0.
         */
        SETINITBUNDLENUM(state, value) {
            state.initBundleNum = value
        },
        /** Sets the sensor_info object sent by the server containing a list of all sensors
         *  that did or are currently receiving readings on the backend.
         */
        SETSENSORINFO(state, value) {
            Object.assign(state.sensorInfo, value)
        },
        /** Sets the bundleNum 'n' (called 'stepNum' in sim-mode) adjusted using the
         *  initial bundle num so that it increments from 0.
         */
        SETBUNDLENUM(state, value) {
            const {n: bundle_n} = value

            // Adjust bundleNum from initBundleNum to start scrubber at 0
            state.bundleNum = bundle_n - state.initBundleNum
        },
        /** Sets the readings object—a dict of sensors readings—sent by the backend with
         *  each sensor in the readings matching one in the sensorInfo object by ID.
         */
        SETREADINGS(state, value) {
            const {n: bundle_n} = value
            const {readings: r} = value

            state.readings[bundle_n - state.initBundleNum] = r
        },
        /** Sets the timestamp for each bundleNum 'n' and splitting it into a date and
         *  time dict—received with timestamp[n].date and timestamp[n].time.
         */
        SETTIMESTAMP(state, value) {
            const {n: bundle_n} = value
            const {timestamp: t} = value

            const dateTime = t.split(' ')
            state.timestamp[bundle_n - state.initBundleNum] = {
                date: dateTime[0],
                time: dateTime[1].split('.')[0],
            }
        },
        /** Sets the data bundles array, pushing all bundles—composed of bundleNum 'n',
         *  readings object, and timestamp—received by the client.
         */
        SETDATABUNDLES(state, value) {
            state.dataBundles.push(value)
        },
    },
    actions: {
        /** Parses each bundle sent by the backend updating the livedata store by passing
         *  the entire object and destructuring it in the associated variable mutator.
         */
        parseData({commit, getters}, bundle) {
            console.log(bundle)
            commit('SETDATABUNDLES', bundle)

            bundle.forEach(item => {
                commit('SETREADINGS', item)
                commit('SETTIMESTAMP', item)
                commit('SETBUNDLENUM', item)
            })
        },
    },
}
