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
 * @version 1.0
 * @since   January 23, 2022
 */
export default {
    state: {
        // The following atmospheric readings are set by the SCD-30 NDIR CO2 Sensor
        atmoCO2: {},
        atmoHum: {},
        atmoTemp: {},

        stepNum: 0,  // step_num sent by the server
        dataBatch: [],  // batch of sensor readings
    },
    getters: {
        // atmospheric state getters
        getAtmoCO2: state => state.atmoCO2,
        getAtmoHum: state => state.atmoHum,
        getAtmoTemp: state => state.atmoTemp,
        getdataBatch: state => state.dataBatch,
    },
    mutations: {
        setStepNum(state, value) {
            state.stepNum = value
        },
        setAtmoCO2(state, value) {
            state.atmoCO2 = {
                value: value,
                unit: 'ppm',
            }
        },
        setAtmoHum(state, value) {
            state.atmoHum = {
                value: value,
                unit: '%',
            }
        },
        setAtmoTemp(state, value) {
            state.atmoTemp = {
                value: value,
                unit: '°C',
            }
        },
    },
    actions: {
        parseData({commit, getters}, data) {
            console.log(data)
            data.forEach(item => {
                Object.keys(item).forEach(value => {
                    switch (value) {
                        case 'step_num':
                            // console.log(`step_num[${item.step_num}]:  ${item.step_num}`)
                            commit('setStepNum', item.step_num)
                            break
                        case 'co2_ppm':
                            // console.log(`co2_ppm[${item.step_num}]:   ${item.co2_ppm}`)
                            commit('setAtmoCO2', item.co2_ppm)
                            break
                        case 'hum_perc':
                            // console.log(`hum_perc[${item.step_num}]:  ${item.hum_perc}`)
                            commit('setAtmoHum', item.hum_perc)
                            break
                        case 'temp':
                            // console.log(`temp[${item.step_num}]:      ${item.temp}`)
                            commit('setAtmoTemp', item.temp)
                            break
                        default:
                            console.log('Data not found')
                    }
                })
            })
        },
    },
}
