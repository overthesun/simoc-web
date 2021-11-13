<template>
    <section class="panel-dl-wrapper">
        <div v-if="getCurrentStepBuffer < 1" class="storage-name">[Loading data ...]</div>
        <template v-for="(stor_obj, stor_name) in storage(getCurrentStepBuffer)" v-else>
            <template v-for="(stor_values, stor_num) in stor_obj" :key="`tmpl_${stor_name}/${stor_num}`">
                <div class="storage-name">
                    {{stringFormatter(stor_name)}} {{stor_num}}
                </div>
                <dl>
                    <template v-for="(value, name) in stor_values" :key="`tmpl_${name}`">
                        <dt>{{label2name(name)}}</dt>
                        <dd>{{value.value}} {{value.unit}}</dd>
                    </template>
                </dl>
            </template>
        </template>
    </section>
</template>


<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {StringFormatter} from '../../javascript/utils'

export default {
    panelTitle: 'Storage Levels',
    computed: {
        ...mapGetters('wizard', ['getConfiguration']),
        ...mapGetters('dashboard', ['getCurrentStepBuffer', 'getStorageCapacities',
                                    'getCurrencyDict']),
    },
    methods: {
        stringFormatter: StringFormatter,
        storage(step) {
            const storage = this.getStorageCapacities(step)
            // TODO: this value is currently unused, so hide it for now
            if (Object.keys(storage.nutrient_storage[1]).includes('biomass_edible')) {
                delete storage.nutrient_storage[1].biomass_edible
            }
            // Don't display storages with 0 balance.
            const filteredStorage = {}
            Object.entries(storage).forEach(([stor_name, stor_obj]) => {
                if (!Object.keys(filteredStorage).includes(stor_name)) {
                    filteredStorage[stor_name] = {1: {}}
                }
                Object.entries(stor_obj[1]).forEach(([currency, data]) => {
                    if (data.value > 0) {
                        filteredStorage[stor_name][1][currency] = data
                    }
                })
            })
            return filteredStorage
        },
        label2name(label) {
            // TODO: ABM Redesign Workaround
            const definedLocally = {
                o2: 'Oxygen (O₂)',
                co2: 'Carbon dioxide (CO₂)',
                n2: 'Nitrogen (N₂)',
                ch4: 'Methane (CH₄)',
                h2: 'Free hydrogen (H₂)',
                h2o: 'Water (H₂0) vapor',
                potable: 'Potable',
                urine: 'Urine',
                feces: 'Waste (carries feces)',
                treated: 'Treated',
                fertilizer: 'Fertilizer',
                waste: 'Unused salts',
                ration: 'Food',
                biomass: 'Biomass (edible, inedible)',
                kwh: 'Energy (battery)',
            }
            return definedLocally[label] ?? this.getCurrencyDict[label].label
        },
    },
}
</script>


<style lang="scss" scoped>
.storage-name + dl {
    margin-left: 16px;
}
</style>
