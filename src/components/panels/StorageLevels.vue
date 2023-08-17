<template>
    <section class="panel-dl-wrapper">
        <div v-if="currentStepBuffer < 1" class="storage-name">[Loading data ...]</div>
        <template v-for="(stor_obj, stor_name) in storage(currentStepBuffer)" v-else
                  :key="`tmpl_${stor_name}_storage`">
            <div class="storage-name">
                {{stringFormatter(stor_name)}}
            </div>
            <dl>
                <template v-for="(value, name) in stor_obj" :key="`tmpl_${name}`">
                    <dt v-if="name == 'co2'"
                        title="CO2 exchanges to/from storage are recorded as both production and consumption">
                        {{getLabel(name)}}
                    </dt>
                    <dt v-else>{{getLabel(name)}}</dt>
                    <dd>{{value.toFixed(3)}} {{getUnit(name)}}</dd>
                </template>
            </dl>
        </template>
    </section>
</template>


<script>
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {StringFormatter} from '../../javascript/utils'

export default {
    panelTitle: 'Storage Levels',
    setup() {
        const dashboard = useDashboardStore()
        const {currentStepBuffer, currencyDict} = storeToRefs(dashboard)
        const {getData} = dashboard
        return {currentStepBuffer, currencyDict, getData}
    },
    modes: ['sim'],
    methods: {
        stringFormatter: StringFormatter,
        storage(step) {
            const storage = this.getData(
                ['*', 'storage', '*', step]
            )

            // TODO: Add units back in with a map function, pull from currencyDesc
            // Don't display storages with 0 balance.
            const filteredStorage = {}
            Object.entries(storage).forEach(([stor_name, stor_obj]) => {
                Object.entries(stor_obj).forEach(([currency, value]) => {
                    if (value > 0) {
                        if (!Object.keys(filteredStorage).includes(stor_name)) {
                            filteredStorage[stor_name] = {}
                        }
                        filteredStorage[stor_name][currency] = value
                    }
                })
            })
            return filteredStorage
        },
        getLabel(currency) {
            const desc = this.currencyDict[currency]
            if (!desc) {
                return currency
            }
            const substitutions = {
                h2: 'Free hydrogen',  // replaces 'Hydrogen'
                feces: 'Waste (carries feces)',  // replaces 'Waste'
                waste: 'Unused salts',  // replaces 'Waste'
                biomass: 'Biomass (edible, inedible)',  // replaces 'Biomass'
                kwh: 'Energy (battery)',  // replaces 'Energy'
            }
            let label = substitutions[currency] ?? desc.label
            label += (desc.short ? ` (${desc.short})` : '')
            return label
        },
        getUnit(currency) {
            const desc = this.currencyDict[currency]
            return desc ? desc.unit : 'kg'
        },
    },
}
</script>


<style lang="scss" scoped>
.storage-name + dl {
    margin-left: 16px;
}
</style>
