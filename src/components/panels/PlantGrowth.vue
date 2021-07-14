<template>
    <section class="plant-growth-wrapper">
        <table class="plant-growth">
            <tr>
                <th>Plant Species</th>
                <th>Qty</th>
                <th>% of Growth</th>
            </tr>
            <tr v-for="(item,index) in getConfiguration.plantSpecies"
                v-if="item.type != ''" :key="index">
                <td>{{stringFormatter(item.type)}}</td>
                <td>{{item.amount}}</td>
                <td>{{getAgentGrowthPerc(index)}}</td>
            </tr>
        </table>
    </section>
</template>


<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {StringFormatter} from '../../javascript/utils'

export default {
    panelTitle: 'Greenhouse Plant Growth',
    computed: {
        ...mapGetters('wizard', ['getConfiguration']),
        ...mapGetters('dashboard', ['getAgentGrowth', 'getCurrentStepBuffer', 'getAgentType']),
    },
    methods: {
        stringFormatter: StringFormatter,
        getAgentGrowthPerc(index) {
            const agentGrowth = this.getAgentGrowth(this.getCurrentStepBuffer)
            if (agentGrowth === undefined) {
                return '[loading data...]'
            } else {
                const perc = agentGrowth[this.getConfiguration.plantSpecies[index].type] * 100
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
