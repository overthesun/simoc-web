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
 * @version 1.1
 * @since   January 29, 2022
 */
export default {
    state: {
        // The following atmospheric readings are set by the SCD-30 NDIR CO2 Sensor
        co2: {},
        relHum: {},
        temp: {},

        stepNum: 0,  // step_num sent by the server
        dataBatch: [],  // batch of sensor readings
    },
    getters: {
        // atmospheric state getters
        getCO2: state => stepNumber => state.co2[stepNumber],
        getRelHum: state => stepNumber => state.relHum[stepNumber],
        getTemp: state => stepNumber => state.temp[stepNumber],

        getDataBatch: state => state.dataBatch,
        getStepNum: state => state.stepNum,
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
                commit('SETCO2', item)
                commit('SETRELHUM', item)
                commit('SETTEMP', item)
                commit('SETSTEPNUM', item)
            })
        },
    },
}
