/**
 * Live Data Store (livedata.js)
 *
 * This file contains the state for live data. Global state management for version 1.6.1 uses
 * Vuex and Pinia for versions after 2.0.
 *
 * Raw sensor data is sent from the backend, simoc-sam. The data received is stored here into
 * "live data" objects read by the Dashboard. The function parseData in the action block
 * assigns the state variables in this store by parsing the object formed from the raw
 * sensor data on the backend.
 *
 * @author  Ryan Meneses
 * @version 2.0
 * @since   July 16, 2022
 */
import {defineStore} from 'pinia'

export const useLiveDataStore = defineStore('LiveDataStore', {
    state: () => ({
        initBundleNum: null,  // initial bundle number received by this client
        sensorInfo: {},  // set from initial callback sensor-info sent by the server

        bundleNum: 0,  // n sent by the server
        readings: {},  // sensor readings from bundle sent by server
        timestamp: {},  // time each bundle of sensor readings were sent

        dataBundles: [],  // bundle of sensor readings
    }),
    getters: {
        getInitBundleNum: state => state.initBundleNum,
        getSensorInfo: state => state.sensorInfo,

        getBundleNum: state => state.bundleNum,
        getReadings: state => bundleNum => state.readings[bundleNum],
        getTimestamp: state => bundleNum => state.timestamp[bundleNum],

        getDataBundles: state => state.dataBundles,
    },
    actions: {

    },
})
