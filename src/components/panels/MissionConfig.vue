<template>
    <section class="panel-dl-wrapper">
        <dl>
            <dt>Location:</dt>
                <dd>Mars</dd>
            <dt>Duration:</dt>
                <dd>{{getConfiguration.duration.amount}} {{stringFormatter(getConfiguration.duration.units)}}</dd>
            <dt>Inhabitants:</dt>
                <dd>{{getConfiguration.humans.amount}}</dd>
            <dt>Food:</dt>
                <dd>{{getConfiguration.food.amount}}</dd>
            <dt>Crew Quarters:</dt>
                <dd>{{stringFormatter(getConfiguration.crewQuarters.type).split(' ').pop()}}</dd>
            <dt>Greenhouse:</dt>
                <dd>{{stringFormatter(getConfiguration.greenhouse.type).split(' ').pop()}}</dd>
            <dt>Solar PV Array:</dt>
                <dd>{{getConfiguration.powerGeneration.amount}}</dd>
            <dt>Batteries:</dt>
                <dd>{{getConfiguration.powerStorage.amount}}</dd>
            <dt>ECLSS:</dt>
                <dd>{{getConfiguration.eclss.amount}}</dd>
        </dl>
    </section>
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {StringFormatter} from '../../javascript/utils'

export default {
    panelTitle: 'Mission Configuration',
    computed:{
        ...mapGetters('wizard',['getConfiguration']),
    },
    methods:{
        stringFormatter: StringFormatter,
    },
}
</script>


<style lang="scss" scoped>

</style>
