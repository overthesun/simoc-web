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
        atmoCO2: {},
        atmoHum: {},
        atmoTemp: {},

        stepNum: 0,  // step_num sent by the server
        dataBatch: [],  // batch of sensor readings
        sensorInfo: {},  // set from initial callback sensor-info sent by the server
    },
    getters: {
        // atmospheric state getters
        getAtmoCO2: state => stepNumber => state.atmoCO2[stepNumber],
        getAtmoHum: state => stepNumber => state.atmoHum[stepNumber],
        getAtmoTemp: state => stepNumber => state.atmoTemp[stepNumber],

        getDataBatch: state => state.dataBatch,
        getStepNum: state => state.stepNum,
        getSensorInfo: state => state.sensorInfo,
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
        SETSTEPNUM(state, value) {
            const {step_num: step} = value

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
                commit('SETATMOCO2', item)
                commit('SETATMOHUM', item)
                commit('SETATMOTEMP', item)
                commit('SETSTEPNUM', item)
            })
        },
    },
}
