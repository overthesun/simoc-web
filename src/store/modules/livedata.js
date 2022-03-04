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
 * @version 1.2
 * @since   March 1, 2022
 */
export default {
    state: {
        // The following atmospheric readings are set by the SCD-30 NDIR CO2 Sensor
        co2: {},
        relHum: {},
        temp: {},

        initStepNum: null,

        // The following are sensor objects
        BME688: {},  // Adafruit BME688 Temperature, Humidity, Pressure and Gas Sensor
        SGP30: {},  // Adafruit SGP30 Air Quality Sensor VOC and eCO2
        SCD30: {},  // Adafruit SCD30 NDIR CO2 Temperature and Humidity Sensor

        timestamp: {},  // time each batch of sensor readings were sent
        stepNum: 0,  // step_num sent by the server
        dataBatch: [],  // batch of sensor readings
        sensorInfo: {},  // set from initial callback sensor-info sent by the server
    },
    getters: {
        // atmospheric state getters
        getCO2: state => stepNumber => state.co2[stepNumber],
        getRelHum: state => stepNumber => state.relHum[stepNumber],
        getTemp: state => stepNumber => state.temp[stepNumber],

        // sensor getters
        getBME688: state => stepNumber => state.BME688[stepNumber],
        getSGP30: state => stepNumber => state.SGP30[stepNumber],
        getSCD30: state => stepNumber => state.SCD30[stepNumber],

        getTimestamp: state => stepNumber => state.timestamp[stepNumber],
        getInitStepNum: state => state.initStepNum,
        getStepNum: state => state.stepNum,

        getSensorInfo: state => state.sensorInfo,
        getDataBatch: state => state.dataBatch,
    },
    mutations: {
        SETCO2(state, value) {
            const {step_num: step} = value
            const {co2} = value

            state.co2[step] = co2
        },
        SETRELHUM(state, value) {
            const {step_num: step} = value
            const {rel_hum} = value

            state.relHum[step] = rel_hum
        },
        SETTEMP(state, value) {
            const {step_num: step} = value
            const {temp} = value

            state.temp[step] = temp
        },
        SETBME688(state, value) {
            const {step_num: step} = value
            const {bme688} = value

            state.BME688[step] = bme688
        },
        SETSGP30(state, value) {
            const {step_num: step} = value
            const {sgp30} = value

            state.SGP30[step] = sgp30
        },
        SETSCD30(state, value) {
            const {step_num: step} = value
            const {scd30} = value

            state.SCD30[step] = scd30
        },
        SETTIMESTAMP(state, value) {
            const {step_num: step} = value
            let {timestamp} = value

            const dateTime = timestamp.split(' ')
            timestamp = {date: dateTime[0], time: dateTime[1]}

            state.timestamp[step] = timestamp
        },
        SETINITSTEPNUM(state, value) {
            state.initStepNum = value
        },
        SETSTEPNUM(state, value) {
            let {step_num: step} = value

            // Adjust stepNum from initStepNum to start scrubber at 0
            step -= state.initStepNum

            state.stepNum = step
        },
        SETDATABATCH(state, value) {
            state.dataBatch.push(value)
        },
        SETSENSORINFO(state, value) {
            state.sensorInfo = value
        },
    },
    actions: {
        parseData({commit, getters}, data) {
            console.log(data)
            commit('SETDATABATCH', data)

            data.forEach(item => {
                commit('SETCO2', item)
                commit('SETRELHUM', item)
                commit('SETTEMP', item)
                commit('SETBME688', item)
                commit('SETSGP30', item)
                commit('SETSCD30', item)
                commit('SETTIMESTAMP', item)
                commit('SETSTEPNUM', item)
            })
        },
    },
}
