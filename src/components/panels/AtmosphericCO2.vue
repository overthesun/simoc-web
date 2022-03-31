<template>
    <section class="panel-dl-wrapper">
        <template v-if="getDataBundles.length === 0">
            <div class="no-data">[Awaiting data...]</div>
        </template>
        <template v-else />
    </section>
</template>


<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
    panelTitle: 'Atmospheric CO2',
    modes: ['live'],
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
