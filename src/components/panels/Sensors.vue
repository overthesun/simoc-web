<template>
    <section class="panel-dl-wrapper">
        <template v-for="(bundle, id) in getSensorInfo" :key="`tmpl_${id}`">
            <div class="sensor-name">
                {{sensorName(bundle)}} <label class="sensor-id"> {{id}} </label>
            </div>
            <dl>
                <template v-for="(value, item) in sensorItems(bundle)" :key="`tmpl_${item}`">
                    <dt>{{value.label}}</dt>
                    <dd>{{sensorReading(getCurrentStepBuffer, id, item)}} {{value.unit}}</dd>
                </template>
            </dl>
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
        ...mapGetters('livedata', ['getSensorInfo', 'getReadings']),
    },
    methods: {
        sensorName(bundle) {
            const {sensor_name: name} = bundle

            return name
        },
        sensorType(bundle) {
            const {sensor_type: type} = bundle

            return type
        },
        sensorItems(bundle) {
            const {reading_info: readings} = bundle

            return readings
        },
        sensorReading(currentStepBuffer, sensorId, sensorItem) {
            const r = this.getReadings(currentStepBuffer)

            let value = '-'
            try {
                Object.entries(r).forEach(id => {
                    if (id[0] === sensorId) {
                        Object.entries(id[1]).forEach(item => {
                            if (item[0] === sensorItem) {
                                value = item[1].toFixed(2)
                            }
                        })
                    }
                })
            } catch (e) {
                console.log('Awaiting sensor readings...')
            }

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
