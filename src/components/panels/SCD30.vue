<template>
    <section class="panel-dl-wrapper">
        <dl v-if="info_section == 'mission-status'">
            <dt>CO2</dt>
            <dd>{{getAtmoCO2PPM()}} ppm</dd>
            <dt>Temperature</dt>
            <dd>{{getTemp()}}</dd>
            <dt>Humidity</dt>
            <dd>{{getHumidity()}}</dd>
        </dl>
    </section>
</template>


<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {StringFormatter} from '../../javascript/utils'

export default {
    panelTitle: 'SCD-30 NDIR Sensor',
    data() {
        return {
            info_section: 'mission-status',
        }
    },
    computed: {
        ...mapGetters('step', ['getAtmoCO2']),
    },
    methods: {
        stringFormatter: StringFormatter,
        getAtmoCO2PPM() {
            console.log('HERE')
            return this.getAtmoCO2.value
        },
        getTemp() {
            return 0
        },
        getHumidity() {
            return 0
        },
    },
}
</script>


<style lang="scss" scoped>
#mission-info-select {
  width: 50%;
  margin-bottom: 1em;
}
</style>
