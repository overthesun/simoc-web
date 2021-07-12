<template>
    <section class="panel-dl-wrapper">
        <div v-if="getCurrentStepBuffer < 1" class='storage-name'>[Loading data ...]</div>
        <template v-else v-for="(stor_obj, stor_name) in storage(getCurrentStepBuffer)">
            <template v-for="(stor_values, stor_num) in stor_obj">
                <div class='storage-name'>{{stringFormatter(stor_name)}} {{stor_num}}</div>
                <dl>
                    <template v-for="(value, name) in stor_values">
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
        ...mapGetters('dashboard', ['getCurrentStepBuffer', 'getStorageCapacities']),
    },
    methods: {
        stringFormatter: StringFormatter,
        storage: function(step) {
            let storage = this.getStorageCapacities(step)
            // TODO: this value is currently unused, so hide it for now
            delete storage['nutrient_storage'][1]['biomass_edible']
            return storage
        },
        label2name: function(label) {
            return {
                'atmo_o2': 'Oxygen (O₂)',
                'atmo_co2': 'Carbon dioxide (CO₂)',
                'atmo_n2': 'Nitrogen (N₂)',
                'atmo_ch4': 'Methane (CH₄)',
                'atmo_h2': 'Free hydrogen (H₂)',
                'atmo_h2o': 'Water (H₂0) vapor',
                'h2o_potb': 'Potable',
                'h2o_urin': 'Urine',
                'h2o_wste': 'Waste (carries feces)',
                'h2o_tret': 'Treated',
                'h2o_totl': 'Total',
                'sold_n': 'Nitrogen',
                'sold_p': 'Phosphorus',
                'sold_k': 'Potassium',
                'sold_wste': 'Unused salts',
                'food_edbl': 'Food',
                'biomass_edible': 'Edible (greenhouse)',  // not used
                'biomass_totl': 'Biomass (edible, inedible)',
                'enrg_kwh': 'Energy (battery)',
            }[label]
        },
    },
}
</script>


<style lang="scss" scoped>
.storage-name + dl {
    margin-left: 16px;
}
</style>
