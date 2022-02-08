<template>
    <section class="panel-dl-wrapper">
        <dl>
            <dt>CO2</dt>
            <dd>{{getAtmoCO2(getCurrentStepBuffer)}} ppm</dd>
            <dt>Temperature</dt>
            <dd>{{getAtmoTemp(getCurrentStepBuffer)}} °C</dd>
            <dt>Relative Humidity</dt>
            <dd>{{getAtmoHum(getCurrentStepBuffer)}}%</dd>
        </dl>
    </section>
</template>


<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
    panelTitle: 'SCD-30 NDIR Sensor',
    modes: ['live'],
    computed: {
        ...mapGetters('livedata', ['getAtmoCO2', 'getAtmoTemp', 'getAtmoHum']),
        ...mapGetters('dashboard', ['getCurrentStepBuffer']),
    },
}
</script>


<style lang="scss" scoped>

</style>
