<template>
    <div>
        <div v-if="simLocation === 'mars'">
            <label class="input-wrapper">
                <div class="input-title" @click="setActiveRefEntry('ECLSS')">
                    Life Support <fa-icon :icon="['fa-solid','circle-info']" />
                </div>
                <div class="input-description">As with the International Space Station, the Environmental Control &amp; Life Support System (ECLSS) cleans your air and water.</div>
                <label><input ref="eclssAmount" v-model="eclss.amount" :min="ranges.eclss.amount.min"
                              :max="ranges.eclss.amount.max" class="input-field-number"
                              type="number" pattern="^\d+$" placeholder="Quantity"
                              required @input="setECLSSHandler"> ECLSS modules</label>
            </label>
        </div>
        <div v-else-if="simLocation === 'b2'">
            <label class="input-wrapper">
                <div class="input-title" @click="setActiveRefEntry('CO2Management')">
                    CO₂ Management <fa-icon :icon="['fa-solid','circle-info']" />
                </div>
                <div class="input-description">Choose the ambient CO₂ level (%) at which CO₂-removal equipment is activated.</div>
                <label class="list-input">
                    <input ref="co2UpperLimit" v-model="eclss.co2UpperLimit" :min="ranges.eclss.co2UpperLimit.min"
                           :max="ranges.eclss.co2UpperLimit.max" class="input-field-number"
                           type="number" step=".01" pattern="^\d+$" placeholder="Percent" required
                           @input="setECLSSHandler"> %
                    Upper Limit CO₂
                </label>
                <!-- CO2 Resupply -->
                <div class="input-description">Choose the ambient CO₂ level (%) at which CO₂ is added back into the atmosphere from storage, and what reserves to begin with.</div>
                <label class="list-input">
                    <input ref="co2Reserves" v-model="eclss.co2Reserves" :min="ranges.eclss.co2Reserves.min"
                           :max="ranges.eclss.co2Reserves.max" class="input-field-number"
                           type="number" pattern="^\d+$" placeholder="Amount" required
                           @input="setECLSSHandler"> kg
                    CO₂ Reserves
                </label>
                <label class="list-input">
                    <input ref="co2LowerLimit" v-model="eclss.co2LowerLimit" :min="ranges.eclss.co2LowerLimit.min"
                           :max="ranges.eclss.co2LowerLimit.max" class="input-field-number"
                           type="number" step=".01" pattern="^\d+$" placeholder="Percent" required
                           @input="setECLSSHandler"> %
                    Lower Limit CO₂
                </label>
            </label>
            <label class="input-wrapper">
                <div class="input-title" @click="setActiveRefEntry('O2Management')">
                    O₂ Management <fa-icon :icon="['fa-solid','circle-info']" />
                </div>
                <div class="input-description">Choose the ambient O₂ level (%) at which O₂ is added back into the atmosphere from storage, and what reserves to begin with.</div>
                <label class="list-input">
                    <input ref="o2Reserves" v-model="eclss.o2Reserves" :min="ranges.eclss.o2Reserves.min"
                           :max="ranges.eclss.o2Reserves.max" class="input-field-number"
                           type="number" pattern="^\d+$" placeholder="Amount" required
                           @input="setECLSSHandler"> kg
                    O₂ Reserves
                </label>
                <label class="list-input">
                    <input ref="o2LowerLimit" v-model="eclss.o2LowerLimit" :min="ranges.eclss.o2LowerLimit.min"
                           :max="ranges.eclss.o2LowerLimit.max" class="input-field-number"
                           type="number" step=".01" pattern="^\d+$" placeholder="Percent" required
                           @input="setECLSSHandler"> %
                    Lower Limit O₂
                </label>
            </label>
        </div>
    </div>
</template>

<script>
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useWizardStore} from '../../store/modules/WizardStore'

export default {
    setup() {
        const dashboard = useDashboardStore()
        const wizard = useWizardStore()
        const {simLocation} = storeToRefs(dashboard)
        const {configuration, validValues} = storeToRefs(wizard)
        const {setECLSS, setActiveRefEntry} = wizard
        return {simLocation, configuration, validValues, setECLSS, setActiveRefEntry}
    },
    data() {
        return {
            eclss: undefined,
        }
    },
    computed: {
        ranges() {
            return this.validValues  // return the valid ranges
        },
    },
    watch: {
        // When the values in the store are changed, update the form and validate it.
        // The validation doesn't happen in setECLSSHandler because this is also triggered
        // when a config file is uploaded
        'configuration.eclss.amount': function() {
            this.eclss.amount = this.configuration.eclss.amount
            this.validateRef('eclssAmount')
        },
        'configuration.eclss.co2UpperLimit': function() {
            this.eclss.co2UpperLimit = this.configuration.eclss.co2UpperLimit
            this.validateRef('co2UpperLimit')  // wait until the min/max are updated to validate
        },
        'configuration.eclss.co2Reserves': function() {
            this.eclss.co2Reserves = this.configuration.eclss.co2Reserves
            this.validateRef('co2Reserves')
        },
        'configuration.eclss.co2LowerLimit': function() {
            this.eclss.co2LowerLimit = this.configuration.eclss.co2LowerLimit
            this.validateRef('co2LowerLimit')
        },
        'configuration.eclss.o2Reserves': function() {
            this.eclss.o2Reserves = this.configuration.eclss.o2Reserves
            this.validateRef('o2Reserves')
        },
        'configuration.eclss.o2LowerLimit': function() {
            this.eclss.o2LowerLimit = this.configuration.eclss.o2LowerLimit
            this.validateRef('o2LowerLimit')
        },
    },
    beforeMount() {
        // Get the values from the configuration that is initially set
        const {eclss} = this.configuration
        this.eclss = eclss
    },
    methods: {
        setECLSSHandler() {
            this.setECLSS(this.eclss)
        },
        validateRef(ref) {
            if (!(ref in this.$refs)) {
                return
            }
            // wait for the fields to be updated before attempting validation
            this.$nextTick(() => this.$refs[ref].reportValidity())
        },
    },
}
</script>

<style lang="scss" scoped>
@use '../../sass/components/configuration-input';

.list-input {
    margin: 4px 0 8px 0;
}
</style>
