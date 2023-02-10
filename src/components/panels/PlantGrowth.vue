<template>
    <section class="plant-growth-wrapper">
        <table class="plant-growth">
            <tr>
                <th>Plant Species</th>
                <th>Qty</th>
                <th title="Number of hours remaining until plant is harvested for food">Hrs to Harvest</th>
                <th title="Ratio of current stored biomass to maximum lifetime biomass under ideal growing conditions">% of Growth</th>
            </tr>
            <tr v-for="(item, index) in getPlants" :key="index">
                <td>{{stringFormatter(item.type)}}</td>
                <td>{{item.amount}}</td>
                <td>{{getAgentAge(item.type)}}</td>
                <td>{{getAgentGrowthPerc(item.type)}}</td>
            </tr>
        </table>
    </section>
</template>


<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useWizardStore} from '../../store/modules/WizardStore'
import {StringFormatter} from '../../javascript/utils'

export default {
    panelTitle: 'Greenhouse Plant Growth',
    setup() {
        const dashboard = useDashboardStore()
        const wizard = useWizardStore()
        const {currentStepBuffer} = storeToRefs(dashboard)
        const {getData} = dashboard
        const {configuration} = storeToRefs(wizard)
        return {currentStepBuffer, getData, configuration}
    },
    modes: ['sim'],
    computed: {
        getPlants() {
            // filter out plants that don't have a type set
            return this.configuration.plantSpecies.filter(plant => !!plant.type)
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
        getAgentAge(plant) {
            const age = this.getData([plant, 'growth', 'agent_step_num', this.currentStepBuffer])
            const lifetime = this.getData([plant, 'lifetime'])
            return lifetime - age
        }
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
