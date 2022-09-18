<template>
    <section class="panel-dl-wrapper">
        <div v-if="currentStepBuffer < 1" class="storage-name">[Loading data ...]</div>
        <div v-else class="content">
            <select id="currency-select" v-model="activeCurrency" required>
                <option v-for="(label, curr) in currencies" :key="curr" :value="curr">
                    {{label}}
                </option>
            </select>
            <DataDisplay :data="activeData" />
        </div>
    </section>
</template>


<script>
import {storeToRefs} from 'pinia'
import {StringFormatter} from '../../javascript/utils'
import {DataDisplay} from '../basepanel'

import {useDashboardStore} from '@/store/modules/DashboardStore'

export default {
    panelTitle: 'Consumption Breakdown',
    components: {
        DataDisplay,
    },
    modes: ['sim'],
    setup() {
        const dashboard = useDashboardStore()
        const {currentStepBuffer} = storeToRefs(dashboard)
        const {getData} = dashboard
        return {currentStepBuffer, getData}
    },
    data() {
        return {
            activeCurrency: 'co2',
            activeData: {},
            currencies: {
                kwh: 'Energy',
                co2: 'Carbon Dioxide (CO₂)',
            },
            // TODO: see comment in fix_unit
            units: {
                kwh: 'kW',
                co2: 'kg',
            },
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
                activeData[key] = `${value} ${this.units[currency]}`
            })
            this.activeData = {}
            this.activeData = activeData
        },
        stringFormatter: StringFormatter,
        fix_unit(unit) {
            // TODO: this is currently unused.  The server either sends the
            // unit or nothing if the value is 0, and if it's kWh we need to
            // use kW, so use hardcoded units for now
            return unit.split(' ')[1] || this.units[this.selected_currency]
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
