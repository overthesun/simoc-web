<template>
    <div class="panel-graph">
        <div>
            <AveragesGraph :id="'line-chart-co2'" :plotted-value="'x'" :unit="'ppm'" />
        </div>
    </div>
</template>


<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {AveragesGraph} from '../graphs'

export default {
    panelTitle: 'Atmospheric CO2',
    modes: ['live'],
    components: {
        AveragesGraph,
    },
    computed: {
        ...mapGetters('dashboard', ['getCurrentStepBuffer']),
        ...mapGetters('livedata', ['getSensorInfo', 'getReadings', 'getDataBundles']),
    },
    methods: {

    },
}
</script>


<style scoped>

</style>
