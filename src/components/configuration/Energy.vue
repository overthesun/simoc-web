<!-- Energy Configuration Wizard Form -->

<template>
    <div>
        <label class="input-wrapper">
            <div class="input-title" @click="setActiveRefEntry('PowerGeneration')">
                Power Generation <fa-icon :icon="['fa-solid','circle-info']" />
            </div>
            <div class="input-description">Select the number of solar photo-voltaic (PV) panels required to meet your daily power consumption, and to recharge the batteries for the night. See <a class="reference-link" href="#" @click="activeReference = 'Graphs'">graph at right</a>.</div>
            <div>
                <!-- Use the retrieved generator value as the value for the field.
                     On change set the configuration store value -->
                <select ref="generator_select" v-model="generator.type"
                        class="input-field-select" required @change="setEnergyHandler">
                    <!-- <option value='none' selected>None</option>
                    TODO: this is hardcoded on Mars and is currently the only option -->
                    <option value="solar_pv_array_mars" selected>Solar PV Array</option>
                </select>
                <label><input ref="generator_input" v-model="generator.amount" :min="generatorValues.min"
                              :max="generatorValues.max" class="input-field-number" type="number"
                              pattern="^\d+$" placeholder="Quantity" required @input="setEnergyHandler"> panels</label>
            </div>
        </label>
        <label class="input-wrapper">
            <div class="input-title" @click="setActiveRefEntry('PowerStorage')">
                Power Storage <fa-icon :icon="['fa-solid','circle-info']" />
            </div>
            <div class="input-description">Power storage is measured in kilowatt-hours (kWh). Select the capacity of your battery in increments of 1000 kWh, from 0 to 10,000.</div>
            <div>
                <select ref="power_select" v-model="storage.type"
                        class="input-field-select" required @change="setEnergyHandler">
                    <option value="power_storage" selected>Battery</option>
                </select>
                <label><input ref="power_input" v-model="storage.amount" :min="storageValues.min"
                              :max="storageValues.max" class="input-field-number" type="number"
                              pattern="^\d+$" placeholder="Quantity" required @input="setEnergyHandler"> kWh</label>
            </div>
        </label>
    </div>
</template>

<script>
import {storeToRefs} from 'pinia'
import {useWizardStore} from '../../store/modules/WizardStore'

export default {
    setup() {
        const wizard = useWizardStore()
        const {configuration, validValues, activeReference} = storeToRefs(wizard)
        const {setEnergy, setActiveRefEntry} = wizard
        return {configuration, validValues, setEnergy, setActiveRefEntry, activeReference}
    },
    data() {
        return {
            generator: undefined,
            storage: undefined,
        }
    },
    computed: {
        generatorValues() {
            return this.validValues.generator
        },
        storageValues() {
            return this.validValues.storage
        },
    },
    watch: {
        // Update power generator/storage (this is necessary to update the form values
        // when e.g. a config file is uploaded and the values in the store change)
        // and show error popups if the fields are invalid while the user is typing
        'configuration.powerGeneration': {
            handler() {
                const {powerGeneration} = this.configuration
                this.generator = powerGeneration
                this.$nextTick(() => {
                    // wait for the forms to update before validating,
                    // otherwise this gives an error while loading presets
                    this.$refs.generator_select.reportValidity()
                    this.$refs.generator_input.reportValidity()
                })
            },
            deep: true, // should trigger when powerGeneration.amount/type change
        },
        'configuration.powerStorage': {
            handler() {
                const {powerStorage} = this.configuration
                this.storage = powerStorage
                this.$nextTick(() => {
                    // same as above
                    this.$refs.power_select.reportValidity()
                    this.$refs.power_input.reportValidity()
                })
            },
            deep: true, // should trigger when powerStorage.amount/type change
        },
    },
    beforeMount() {
        const {powerGeneration, powerStorage} = this.configuration
        this.generator = powerGeneration
        this.storage = powerStorage
    },
    methods: {
        // Set the selected values from above fields to the wizard store.
        // Called from all fields on change, and updates with all selected values from this form.
        setEnergyHandler() {
            const value = {powerGeneration: this.generator, powerStorage: this.storage}
            this.setEnergy(value)
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../sass/components/configuration-input';

.input-field-select{
    margin-right:24px;
}
</style>
