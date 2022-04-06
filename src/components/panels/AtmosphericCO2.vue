<template>
    <div class="panel-graph">
        <select v-model="location" required>
            <option :selected="location === 'crew_quarters'" value="crew_quarters">Crew Quarters</option>
            <!-- <option :selected="location === 'greenhouse'" value="greenhouse">Greenhouse</option>-->
        </select>
        <div>
            <AveragesGraph :id="'canvas-pc-' + canvasNumber" :plotted-value="location" :unit="unit" />
        </div>
        <div class="graph-units">
            <select v-model="unit" required>
                <option :selected="unit === 'co2_ppm'" value="co2_ppm">ppm</option>
                <!-- <option :selected="unit === 'co2_ccm'" value="co2_ccm">ccm</option>-->
            </select>
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
