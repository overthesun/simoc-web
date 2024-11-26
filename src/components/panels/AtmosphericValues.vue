<template>
    <section class="panel-dl-wrapper">
        <CardList :data="activeData" />
    </section>
</template>


<script>
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {StringFormatter} from '../../javascript/utils'
import {CardList} from '../basepanel'

export default {
    panelTitle: 'Atmospheric Values',
    components: {
        CardList,
    },
    modes: ['sim'],
    setup() {
        const dashboard = useDashboardStore()
        const {humanAtmosphere, currentStepBuffer, currencyDict, gameConfig} = storeToRefs(dashboard)
        const {getData, getUnit} = dashboard
        return {humanAtmosphere, currentStepBuffer, getData, currencyDict, gameConfig, getUnit}
    },
    data() {
        return {
            activeData: {},
        }
    },
    watch: {
        currentStepBuffer(step) {
            this.setActiveData(step)
        },
    },
    methods: {
        setActiveData(step) {
            if (!step) {
                return
            }
            // find the agents for crew quarters and greenhouse
            const agents = this.gameConfig.agents
            const cq_type = Object.keys(agents).find(key => key.startsWith('crew_habitat'))
            const gh_type = Object.keys(agents).find(key => key.startsWith('greenhouse'))
            // loop through them and get co2 and o2 values
            const data = {}
            const storages = [[cq_type, 'crew hab'], [gh_type, 'greenhouse']]
            storages.forEach(([storage, label]) => {
                if (!storage) return  // skip storage if it's not defined
                const tot_atmo = this.getData([storage, 'storage', 'SUM', 1])
                const co2_kg = this.getData([storage, 'storage', 'co2', step])
                const co2_ppm = Math.round(co2_kg / tot_atmo * 1000000)
                data[`CO₂ ${label}`] = `${co2_ppm}ppm`
                const o2_kg = this.getData([storage, 'storage', 'o2', step])
                const o2_perc = o2_kg / tot_atmo * 100
                data[`O₂ ${label}`] = `${o2_perc.toFixed(2)}%`
            })
            this.activeData = data
        },
        stringFormatter: StringFormatter,
        getLabel(currency) {
            const desc = this.currencyDict[currency]
            return desc ? desc.label : currency
        },
    },
}
</script>


<style lang="scss" scoped>
</style>
