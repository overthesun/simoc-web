<template>
    <section class="plant-growth-wrapper">
        <table class="plant-growth">
            <tr>
                <th>Plant Species</th>
                <th>Qty</th>
                <th title="Based on expected growth at earth-normal growing conditions. Other factors (e.g. CO2 concentrations > 350ppm) may cause actual growth to be greater than 100%.">% of Growth</th>
            </tr>
            <tr v-for="(item, index) in getPlants" :key="index">
                <td>{{stringFormatter(item.type)}}</td>
                <td>{{item.amount}}</td>
                <td>{{getAgentGrowthPerc(item.type)}}</td>
            </tr>
        </table>
    </section>
</template>


<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {StringFormatter} from '../../javascript/utils'

export default {
    panelTitle: 'Greenhouse Plant Growth',
    setup() {
        const dashboard = useDashboardStore()
        const {currentStepBuffer} = storeToRefs(dashboard)
        const {getData} = dashboard
        return {currentStepBuffer, getData}
    },
    modes: ['sim', 'kiosk'],
    computed: {
        ...mapGetters('wizard', ['getConfiguration']),
        getPlants() {
            // filter out plants that don't have a type set
            return this.getConfiguration.plantSpecies.filter(plant => !!plant.type)
        },
    },
    methods: {
        stringFormatter: StringFormatter,
        getAgentGrowthPerc(plant) {
            const agentGrowth = this.getData(
                [plant, 'growth', 'growth_rate', this.currentStepBuffer]
            )
            if (agentGrowth === undefined || agentGrowth === null) {
                return '[loading data...]'
            } else {
                const perc = agentGrowth * 100
                return `${perc.toFixed(4)}%`
            }
        },
    },
}
</script>


<style lang="scss" scoped>
.plant-growth-wrapper {
    overflow-y: auto;
}
.plant-growth {
    width: 100%;
}
.plant-growth th,
.plant-growth td {
    text-align: center;
    padding: 2px 0;
}

.plant-growth th:first-child,
.plant-growth td:first-child {
    text-align: left;
}
.plant-growth th:last-child,
.plant-growth td:last-child {
    text-align: right;
}

</style>
