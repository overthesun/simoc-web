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
 * @since   February 1, 2022
 */
export default {
    state: {
        // The following atmospheric readings are set by the SCD-30 NDIR CO2 Sensor
        atmoCO2: {},
        atmoHum: {},
        atmoTemp: {},

        // The following are sensor objects
        BME688: {},  // Adafruit BME688 Temperature, Humidity, Pressure and Gas Sensor
        SGP30: {},  // Adafruit SGP30 Air Quality Sensor VOC and eCO2
        SCD30: {},  // Adafruit SCD30 NDIR CO2 Temperature and Humidity Sensor

        timestamp: {},  // time each batch of sensor readings were sent
        stepNum: 0,  // step_num sent by the server
        dataBatch: [],  // batch of sensor readings
    },
    getters: {
        // atmospheric state getters
        getAtmoCO2: state => stepNumber => state.atmoCO2[stepNumber],
        getAtmoHum: state => stepNumber => state.atmoHum[stepNumber],
        getAtmoTemp: state => stepNumber => state.atmoTemp[stepNumber],

        // sensor getters
        getBME688: state => stepNumber => state.BME688[stepNumber],
        getSGP30: state => stepNumber => state.SGP30[stepNumber],
        getSCD30: state => stepNumber => state.SCD30[stepNumber],

        getTimestamp: state => stepNumber => state.timestamp[stepNumber],
        getDataBatch: state => state.dataBatch,
        getStepNum: state => state.stepNum,
    },
    mutations: {
        SETATMOCO2(state, value) {
            const {step_num: step} = value
            const {co2_ppm} = value

            state.atmoCO2[step] = co2_ppm
        },
        SETATMOHUM(state, value) {
            const {step_num: step} = value
            const {hum_perc} = value

            state.atmoHum[step] = hum_perc
        },
        SETATMOTEMP(state, value) {
            const {step_num: step} = value
            const {temp} = value

            state.atmoTemp[step] = temp
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
            const {timestamp} = value

            state.timestamp[step] = timestamp
        },
        SETSTEPNUM(state, value) {
            const {step_num: step} = value

            state.stepNum = step
        },
        SETDATABATCH(state, value) {
            state.dataBatch.push(value)
        },
    },
    actions: {
        parseData({commit, getters}, data) {
            console.log(data)
            commit('SETDATABATCH', data)

            data.forEach(item => {
                commit('SETATMOCO2', item)
                commit('SETATMOHUM', item)
                commit('SETATMOTEMP', item)
                commit('SETBME688', item)
                commit('SETSGP30', item)
                commit('SETSCD30', item)
                commit('SETTIMESTAMP', item)
                commit('SETSTEPNUM', item)
            })
        },
    },
}
