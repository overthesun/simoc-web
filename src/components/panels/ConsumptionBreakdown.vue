<template>
    <section class="panel-dl-wrapper">
        <div v-if="getCurrentStepBuffer < 1" class="storage-name">[Loading data ...]</div>
        <template v-else>
            <p v-if="selected_consumption === null">[Missing data]</p>
            <select v-else id="currency-select" v-model="selected_currency" required>
                <option v-for="(data, name) in consumptions" :key="name" :value="name">
                    {{currencies[name]}}
                </option>
            </select>
            <dl>
                <template v-for="(agent_data, agent_name, k) in selected_consumption" :key="`tmpl_${agent_name}_${k}`">
                    <dt>{{stringFormatter(agent_name)}}</dt>
                    <dd>{{agent_data.value}} {{units[selected_currency]}}</dd>
                </template>
            </dl>
        </template>
    </section>
</template>


<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {StringFormatter} from '../../javascript/utils'

export default {
    panelTitle: 'Consumption Breakdown',
    modes: ['sim'],
    data() {
        return {
            selected_currency: null,
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
    computed: {
        ...mapGetters('dashboard', ['getCurrentStepBuffer', 'getDetailsPerAgent']),
        selected_consumption() {
            try {
                if (this.selected_currency === null) {
                    this.set_currency(Object.keys(this.consumptions)[0])
                }
                return this.consumptions[this.selected_currency]
            } catch (err) {
                return null
            }
        },
        consumptions() {
            return this.getDetailsPerAgent(this.getCurrentStepBuffer).in
        },
    },
    methods: {
        stringFormatter: StringFormatter,
        set_currency(currency) {
            // the linter complains if we set this directly in the computed
            this.selected_currency = currency
        },
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
