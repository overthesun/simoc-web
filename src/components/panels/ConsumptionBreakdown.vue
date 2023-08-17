<template>
    <section class="panel-dl-wrapper">
        <div v-if="currentStepBuffer < 1" class="storage-name">[Loading data ...]</div>
        <div v-else class="content">
            <select id="currency-select" v-model="activeCurrency" required>
                <option v-for="curr in currencies" :key="curr" :value="curr">
                    {{getLabel(curr)}}
                </option>
            </select>
            <DataDisplay :data="activeData" />
        </div>
    </section>
</template>


<script>
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {StringFormatter} from '../../javascript/utils'
import {DataDisplay} from '../basepanel'

export default {
    panelTitle: 'Consumption Breakdown',
    components: {
        DataDisplay,
    },
    modes: ['sim'],
    setup() {
        const dashboard = useDashboardStore()
        const {currentStepBuffer, currencyDict} = storeToRefs(dashboard)
        const {getData} = dashboard
        return {currentStepBuffer, getData, currencyDict}
    },
    data() {
        return {
            activeCurrency: 'co2',
            activeData: {},
            currencies: ['kwh', 'co2'],
        }
    },
    watch: {
        currentStepBuffer(newBuffer) {
            this.setActiveData(this.activeCurrency, newBuffer)
        },
        activeCurrency(newCurrency) {
            this.setActiveData(newCurrency, this.currentStepBuffer)
        },
    },
    methods: {
        setActiveData(currency, buffer) {
            if (!currency || !buffer) {
                return
            }
            const csb = buffer || this.currentStepBuffer
            const path = ['*', 'flows', 'in', currency, 'SUM', csb]

            const activeData = this.getData(path)
            Object.keys(activeData).forEach(key => {
                let value = activeData[key]
                value = Math.round(value*10000)/10000
                activeData[key] = `${value} ${this.getUnit(currency)}`
            })
            this.activeData = activeData
        },
        stringFormatter: StringFormatter,
        getLabel(currency) {
            const desc = this.currencyDict[currency]
            return desc ? desc.label : currency
        },
        getUnit(currency) {
            const desc = this.currencyDict[currency]
            return desc ? desc.unit : 'kg'
        },
    },
}
</script>


<style lang="scss" scoped>
#currency-select {
    width: 50%;
    margin-bottom: 1em;
}
</style>
