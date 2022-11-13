import {defineStore} from 'pinia'
/**
 * Live Data Store (LiveStore.js)
 *
 * This file contains the state for live data.
 *
 * Raw sensor data is sent from the backend, simoc-sam. The data received is
 * stored here into "live data" objects read by the Dashboard. The function
 * parseData in the action block assigns the state variables in this store by
 * parsing the object formed from the raw sensor data on the backend.
 *
 * @author  Ryan Meneses
 * @version 1.6.1
 * @since   March 15, 2022
 */
export const useLiveStore = defineStore('LiveStore', {
    state: () => ({
        initBundleNum: null,  // initial bundle number received by this client
        sensorInfo: {},  // set from initial callback sensor-info sent by the server

        bundleNum: 0,  // n sent by the server
        readings: {},  // sensor readings from bundle sent by server
        timestamp: {},  // time each bundle of sensor readings were sent

        dataBundles: [],  // bundle of sensor readings
    }),
    actions: {
        getReadings(bundleNum) {
            return this.readings[bundleNum]
        },
        getTimestamp(bundleNum) {
            return this.timestamp[bundleNum]
        },
        /** Sets the sensor_info object sent by the server containing a list of all sensors
         *  that did or are currently receiving readings on the backend. Use spread syntax
         *  so that if sensors are removed from the sensorInfo object sent by simoc-samm,
         *  the info is still available to display past info.
         */
        setSensorInfo(value) {
            this.sensorInfo = {...this.sensorInfo, ...value}
            console.log(`Set sensor info to ${this.sensorInfo}`)
        },
        /** Sets the bundleNum 'n' (called 'stepNum' in sim-mode) adjusted using the
         *  initial bundle num so that it increments from 0.
         */
        setBundleNum(value) {
            const {n: bundle_n} = value

            // Adjust bundleNum from initBundleNum to start scrubber at 0
            this.bundleNum = bundle_n - this.initBundleNum
        },
        /** Sets the readings object—a dict of sensors readings—sent by the backend with
         *  each sensor in the readings matching one in the sensorInfo object by ID.
         */
        setReadings(value) {
            const {n: bundle_n} = value
            const {readings: r} = value

            this.readings[bundle_n - this.initBundleNum] = r
        },
        /** Sets the timestamp for each bundleNum 'n' and splitting it into a date and
         *  time dict—received with timestamp[n].date and timestamp[n].time.
         */
        setTimestamp(value) {
            const {n: bundle_n} = value
            const {timestamp: t} = value

            const dateTime = t.split(' ')
            this.timestamp[bundle_n - this.initBundleNum] = {
                date: dateTime[0],
                time: dateTime[1].split('.')[0],  // Remove milliseconds from time
            }
        },
        /** Sets the data bundles array, pushing all bundles—composed of bundleNum 'n',
         *  readings object, and timestamp—received by the client.
         */
        setDataBundles(value) {
            this.dataBundles.push(value)
        },
        /** Parses each bundle sent by the backend updating the livedata store by passing
         *  the entire object and destructuring it in the associated variable mutator.
         */
        parseData(bundles) {
            console.log(bundles)
            this.setDataBundles(bundles)

            bundles.forEach(item => {
                this.setReadings(item)
                this.setTimestamp(item)
                this.setBundleNum(item)
            })
        },
    },
})
