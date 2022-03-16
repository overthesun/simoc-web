<template>
    <section class="panel-dl-wrapper">
        <template v-for="(bundle, id) in getSensorInfo" :key="`tmpl_${id}`">
            <div class="sensor-name">
                {{sensorName(bundle)}} <label class="sensor-id"> {{id}} </label>
            </div>
            <dl>
                <template v-for="(value, key) in sensorReadings(bundle)" :key="`tmpl_${key}`">
                    <dt>{{value.label}}</dt>
                    <dd>{{(Math.random() * 100).toFixed(2)}} {{value.unit}}</dd>
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
        sensorReadings(bundle) {
            const {reading_info: readings} = bundle

            return readings
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
