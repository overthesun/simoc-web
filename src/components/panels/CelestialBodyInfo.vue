<template>
    <section class="panel-dl-wrapper">
        <dl>
            <dt>Celestial Body:</dt>
                <dd>{{stringFormatter(getConfiguration.location)}}</dd>
            <dt>Day length:</dt>
                <dd>24h 37m 23s</dd>
            <dt>Surface Temperature:</dt>
                <dd>210K | -63C</dd>
            <dt>Solar Gain:</dt>
                <dd>500 W/m<sup>2</sup></dd>
            <dt>Atmospheric Pressure:</dt>
                <dd>0.636 kPa</dd>
            <dt>Gravity:</dt>
                <dd>3.71 m/s<sup>2</sup></dd>
        </dl>
    </section>
</template>


<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {StringFormatter} from '../../javascript/stringFormatter'

export default {
    panelTitle: 'Celestial Body Information',
    computed:{
        ...mapGetters('wizard', ['getConfiguration']),
    },
    methods:{
        stringFormatter: StringFormatter,
    },
}
</script>


<style lang="scss" scoped>

</style>
