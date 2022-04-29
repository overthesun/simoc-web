<template>
    <section class="panel-dl-wrapper">
        <template v-if="getDataBundles.length === 0">
            <div class="no-data">[Awaiting data...]</div>
        </template>
        <template v-else>
            <template v-for="(info, id) in getSensorInfo" :key="`tmpl_${id}`">
                <div class="sensor-name">{{info.sensor_name}}</div>
                <dl>
                    <dt>Sensor ID</dt>
                    <dd>{{id}}</dd>
                    <template v-for="(item, name) in sensorItems(info)" :key="`tmpl_${name}`">
                        <dt>{{item.label}}</dt>
                        <dd>{{sensorReading(getCurrentStepBuffer, id, name)}} {{item.unit}}</dd>
                    </template>
                </dl>
            </template>
        </template>
    </section>
</template>


<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
    panelTitle: 'Sensors',
    modes: ['live'],
    computed: {
        ...mapGetters('dashboard', ['getCurrentStepBuffer']),
        ...mapGetters('livedata', ['getSensorInfo', 'getReadings', 'getDataBundles']),
    },
    methods: {
        /** Extracts the sensor name from the sensorInfo object and returns it setting the
         *  sensor name viewable on the Sensors panel e.g. MockSensor
         *
         *  @param info The sensorInfo object form the livedata store.
         *  @returns {string} The name of the sensor.
         */
        sensorName(info) {
            const {sensor_name: name} = info

            return name
        },
        /** Extracts the sensor type from the sensorInfo object and returns it setting the
         *  sensor type viewable on the Sensors panel e.g. Mock
         *
         *  @param info The sensorInfo object form the livedata store.
         *  @returns {string} The type of the sensor.
         */
        sensorType(info) {
            const {sensor_type: type} = info

            return type
        },
        /** Extracts the sensor items from the sensorInfo object and returns it setting the
         *  sensor items viewable on the Sensors panel. e.g. {CO2, Temperature, Relative Humidity}
         *
         *  @param info The sensorInfo object form the livedata store.
         *  @returns {object} The items of the sensor.
         */
        sensorItems(info) {
            const {reading_info: items} = info

            return items
        },
        /** Gets a sensor's readings from the livedata store at the currentStepBuffer of the
         *  scrubber and returns a single item from the reading.
         *
         *  @param currentStepBuffer The step the scrubber is currently on.
         *  @param sensorId The unique ID of a sensor.
         *  @param itemName The item name from a sensor's reading.
         *  @returns {string|float} A dash '-' indicating no value or the value from the item.
         */
        sensorReading(currentStepBuffer, sensorId, itemName) {
            const r = this.getReadings(currentStepBuffer)

            let value = '-'
            Object.entries(r).forEach(reading => {
                if (reading[0] === sensorId) {
                    Object.entries(reading[1]).forEach(item => {
                        if (item[0] === itemName) {
                            value = item[1].toFixed(2)
                        }
                    })
                }
            })

            return value
        },
    },
}
</script>


<style lang="scss" scoped>
    .sensor-name + dl {
        margin-left: 16px;
        font-size: 14px;
    }

    .sensor-id {
        font-size: 12px;
    }
</style>
