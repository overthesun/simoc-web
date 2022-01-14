<template>
    <section class="panel-dl-wrapper">
        <dl v-if="info_section == 'atmo_readings'">
            <dt>CO2</dt>
            <dd>{{getAtmoCO2PPM()}} ppm</dd>
            <dt>Temperature</dt>
            <dd>{{getTemp()}} C°</dd>
            <dt>Humidity</dt>
            <dd>{{getHumidity()}}%</dd>
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
            info_section: 'atmo_readings',
        }
    },
    computed: {
        ...mapGetters('step', ['getAtmoCO2', 'getAtmoTemp', 'getAtmoHum']),
    },
    methods: {
        stringFormatter: StringFormatter,
        getAtmoCO2PPM() {
            return this.getAtmoCO2.value
        },
        getTemp() {
            return this.getAtmoTemp.value
        },
        getHumidity() {
            return this.getAtmoHum.value
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
