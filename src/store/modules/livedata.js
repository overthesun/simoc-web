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
 * @version 1.3
 * @since   March 1, 2022
 */
export default {
    state: {
        co2: {},  // Average CO2 reading over all sensors
        relHum: {},  // Average relative humidity reading over all sensors
        temp: {},  // Average temperature reading over all sensors

        initBundleNum: null,  // Initial bundle number received by this client

        BME688: {},  // Adafruit BME688 Temperature, Humidity, Pressure and Gas Sensor
        SGP30: {},  // Adafruit SGP30 Air Quality Sensor VOC and eCO2
        SCD30: {},  // Adafruit SCD30 NDIR CO2 Temperature and Humidity Sensor

        timestamp: {},  // time each bundle of sensor readings were sent
        bundleNum: 0,  // n sent by the server
        dataBundle: [],  // bundle of sensor readings
        sensorInfo: {},  // set from initial callback sensor-info sent by the server
    },
    getters: {
        // atmospheric state getters
        getCO2: state => bundleNum => state.co2[bundleNum],
        getRelHum: state => bundleNum => state.relHum[bundleNum],
        getTemp: state => bundleNum => state.temp[bundleNum],

        // sensor getters
        getBME688: state => bundleNum => state.BME688[bundleNum],
        getSGP30: state => bundleNum => state.SGP30[bundleNum],
        getSCD30: state => bundleNum => state.SCD30[bundleNum],

        getTimestamp: state => bundleNum => state.timestamp[bundleNum],
        getInitBundleNum: state => state.initBundleNum,
        getBundleNum: state => state.bundleNum,

        getSensorInfo: state => state.sensorInfo,
        getDataBundle: state => state.dataBundle,
    },
    mutations: {
        SETCO2(state, value) {
            const {n: bundle} = value
            const {co2} = value

            state.co2[bundle] = co2
        },
        SETRELHUM(state, value) {
            const {n: bundle} = value
            const {rel_hum} = value

            state.relHum[bundle] = rel_hum
        },
        SETTEMP(state, value) {
            const {n: bundle} = value
            const {temp} = value

            state.temp[bundle] = temp
        },
        SETBME688(state, value) {
            const {n: bundle} = value
            const {bme688} = value

            state.BME688[bundle] = bme688
        },
        SETSGP30(state, value) {
            const {n: bundle} = value
            const {sgp30} = value

            state.SGP30[bundle] = sgp30
        },
        SETSCD30(state, value) {
            const {n: bundle} = value
            const {scd30} = value

            state.SCD30[bundle] = scd30
        },
        SETTIMESTAMP(state, value) {
            const {n: bundle} = value
            let {timestamp} = value

            const dateTime = timestamp.split(' ')
            timestamp = {date: dateTime[0], time: dateTime[1]}

            state.timestamp[bundle] = timestamp
        },
        SETINITBUNDLENUM(state, value) {
            state.initBundleNum = value
        },
        SETBUNDLENUM(state, value) {
            let {n: bundle} = value

            // Adjust bundleNum from initBundleNum to start scrubber at 0
            bundle -= state.initBundleNum

            state.bundleNum = bundle
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
                commit('SETCO2', item)
                commit('SETRELHUM', item)
                commit('SETTEMP', item)
                commit('SETBME688', item)
                commit('SETSGP30', item)
                commit('SETSCD30', item)
                commit('SETTIMESTAMP', item)
                commit('SETBUNDLENUM', item)
            })
        },
    },
}
