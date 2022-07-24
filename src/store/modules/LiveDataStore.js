/**
 * Live Data Store (LiveDataStore.js)
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
 * @version 2.1
 * @since   July 24, 2022
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
        getReading: state => bundleNum => state.readings[bundleNum],
        getTimestamp: state => bundleNum => state.timestamp[bundleNum],
    },
    actions: {
        /** Parses each bundle sent by the backend updating this store by passing the
         *  entire object and destructuring it in the associated state variable setters.
         */
        parseData(bundles) {
            console.log(bundles)
            this.dataBundles.push(bundles)

            bundles.forEach(item => {
                this.setReadings(item)
                this.setTimestamp(item)
                this.setBundleNum(item)
            })
        },
        /** Sets the readings object—a dict of sensors readings—sent by the backend with
         *  each sensor in the readings matching one in the sensorInfo object by ID.
         */
        setReadings(item) {
            const {n: bundle_n} = item
            const {readings: r} = item

            this.readings[bundle_n - this.initBundleNum] = r
        },
        /** Sets the timestamp for each bundleNum 'n' and splitting it into a date and
         *  time dict—received with timestamp[n].date and timestamp[n].time.
         */
        setTimestamp(item) {
            const {n: bundle_n} = item
            const {timestamp: t} = item

            const dateTime = t.split(' ')
            this.timestamp[bundle_n - this.initBundleNum] = {
                date: dateTime[0],
                time: dateTime[1].split('.')[0],  // Remove milliseconds from time
            }
        },
        /** Sets the bundleNum 'n' (called 'stepNum' in sim-mode) adjusted using the
         *  initial bundle num so that it increments from 0.
         */
        setBundleNum(item) {
            const {n: bundle_n} = item

            // Adjust bundleNum from initBundleNum to start scrubber at 0
            this.bundleNum = bundle_n - this.initBundleNum
        },
    },
})
