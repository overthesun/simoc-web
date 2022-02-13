<template>
    <section class="panel-dl-wrapper">
        <dl>
            <dt>CO2</dt>
            <dd>{{getCO2(getStepNum)}} ppm</dd>
            <dt>Temperature</dt>
            <dd>{{getTemp(getStepNum)}} °C</dd>
            <dt>Relative Humidity</dt>
            <dd>{{getRelHum(getStepNum)}}%</dd>
        </dl>
    </section>
</template>


<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
    panelTitle: 'SCD-30 NDIR Sensor',
    modes: ['live'],
    computed: {
        ...mapGetters('livedata', ['getCO2', 'getTemp', 'getRelHum', 'getStepNum']),
    },
}
</script>


<style lang="scss" scoped>

</style>
