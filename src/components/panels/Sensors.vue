<template>
    <section class="panel-dl-wrapper">
        <div v-if="getCurrentStepBuffer < 0" class="storage-name">[Loading data ...]</div>
        <template v-for="(sensors_obj, sensors_name) in sensors(getCurrentStepBuffer)" v-else>
            <template v-for="(sensor_obj, sensor_name) in sensors_obj" :key="`tmpl_${sensors_name}/${sensor_name}`">
                <div class="storage-name">
                    {{stringFormatter(sensors_name)}} {{sensor_name}}
                </div>
                <dl>
                    <template v-for="(value, name) in sensor_obj" :key="`tmpl_${name}`">
                        <dt>{{label2name(name)}}</dt>
                        <dd>{{value.value}} {{value.unit}}</dd>
                    </template>
                </dl>
            </template>
        </template>
    </section>
</template>


<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {StringFormatter} from '../../javascript/utils'

export default {
    panelTitle: 'Sensors',
    modes: ['live'],
    computed: {
        ...mapGetters('dashboard', ['getCurrentStepBuffer']),
        ...mapGetters('livedata', ['getSensorInfo']),
    },
    methods: {
        stringFormatter: StringFormatter,
        sensors(step) {
            // TODO: Create sensorInfo object in livedata and determine its struct to iterate over
            // const storage = this.getSensorInfo(step)

            // TODO: Delete this test object after above TODO is complied with
            const storage = {'': {
                SCD30: {
                    co2_ppm: {value: (Math.random() * 1000).toFixed(2), unit: 'ppm'},
                    temp: {value: (Math.random() * 25).toFixed(2), unit: '°C'},
                    rel_hum: {value: (Math.random() * 100).toFixed(2), unit: '%'},
                },
            }}

            return storage
        },
        label2name(label) {
            return {
                co2_ppm: 'Carbon Dioxide (CO₂)',
                temp: 'Temperature',
                rel_hum: 'Relative Humidity',
            }[label]
        },
    },
}
</script>


<style lang="scss" scoped>
.storage-name + dl {
  margin-left: 16px;
}
</style>
