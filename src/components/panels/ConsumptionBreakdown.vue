<template>
    <section class="panel-dl-wrapper">
        <div v-if="getCurrentStepBuffer < 1" class='storage-name'>[Loading data ...]</div>
        <template v-else>
        <p v-if="selected_consumption === null">[Missing data]</p>
        <select v-else v-model="selected_currency" required id="currency-select">
            <option  v-for="(data, name, index) in consumptions" :value=name :key=name>
                {{currencies[name]}}
            </option>
        </select>
        <dl>
            <template v-for="(agent_data, agent_name) in selected_consumption">
            <dt>{{stringFormatter(agent_name)}}</dt>
                <dd>{{agent_data.value}} {{fix_unit(agent_data.unit)}}</dd>
            </template>
        </dl>
        </template>
    </section>
</template>


<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {StringFormatter} from '../../javascript/utils'

export default {
    panelTitle: 'Consumption Breakdown',
    data() {
        return {
            selected_currency: null,
            currencies: {
                enrg_kwh: 'Energy',
                atmo_co2: 'Carbon Dioxide (CO₂)',
            },
            units: {
                enrg_kwh: 'kWh',
                atmo_co2: 'kg',
            },
        }
    },
    computed:{
        ...mapGetters('dashboard', ['getCurrentStepBuffer','getDetailsPerAgent']),
        selected_consumption: function() {
            try {
                if (this.selected_currency === null) {
                    this.selected_currency = Object.keys(this.consumptions)[0]
                }
                const value = this.consumptions[this.selected_currency]
                return value
            }
            catch (err) {
                return null
            }
        },
        consumptions: function() {
            return this.getDetailsPerAgent(this.getCurrentStepBuffer).in
        },
    },
    methods:{
        stringFormatter: StringFormatter,
        fix_unit: function (unit) {
            return unit.split(' ')[1] || this.units[this.selected_currency]
        },
    },
}
</script>


<style lang="scss" scoped>
#currency-select {
    margin-bottom: 1em;
}
</style>
