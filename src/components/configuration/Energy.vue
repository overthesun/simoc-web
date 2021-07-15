<!-- Energy Configuration Wizard Form -->

<template>
    <div>
        <label class="input-wrapper">
            <div class="input-title" @click="SETACTIVEREFENTRY('PowerGeneration')">
                Power Generation <fa-icon :icon="['fas','info-circle']" />
            </div>
            <div class="input-description">Select the number of solar photo-voltaic (PV) panels required to meet your daily power consumption, and to recharge the batteries for the night. See <a class="reference-link" href="#" @click="SETACTIVEREFERENCE('Graphs')">graph at right</a>.</div>
            <div>
                <!-- Use the retrieved generator value as the value for the field.
                     On change set the configuration store value -->
                <select ref="generator_select" v-model="generator.type"
                        class="input-field-select" required @change="setEnergy">
                    <!-- <option value='none' selected>None</option>
                    TODO: this is hardcoded on Mars and is currently the only option -->
                    <option value="solar_pv_array_mars" selected>Solar PV Array</option>
                </select>
                <label><input ref="generator_input" v-model="generator.amount" :min="generatorValues.min"
                              :max="generatorValues.max" class="input-field-number" type="number"
                              pattern="^\d+$" placeholder="Quantity" required @input="setEnergy"> panels</label>
            </div>
        </label>
        <label class="input-wrapper">
            <div class="input-title" @click="SETACTIVEREFENTRY('PowerStorage')">
                Power Storage <fa-icon :icon="['fas','info-circle']" />
            </div>
            <div class="input-description">Power storage is measured in kilowatt-hours (kWh). Select the capacity of your battery in increments of 1000 kWh, from 0 to 10,000.</div>
            <div>
                <select ref="power_select" v-model="storage.type"
                        class="input-field-select" required @change="setEnergy">
                    <option value="power_storage" selected>Battery</option>
                </select>
                <label><input ref="power_input" v-model="storage.amount" :min="storageValues.min"
                              :max="storageValues.max" class="input-field-number" type="number"
                              pattern="^\d+$" placeholder="Quantity" required @input="setEnergy"> kWh</label>
            </div>
        </label>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations} from 'vuex'

export default {
    data() {
        return {
            generator: undefined,
            storage: undefined,
        }
    },
    beforeMount() {
        const {powerGeneration, powerStorage} = this.getConfiguration
        this.generator = powerGeneration
        this.storage = powerStorage
    },
    computed: {
        ...mapGetters('wizard', ['getConfiguration', 'getValidValues']),
        generatorValues() {
            return this.getValidValues.generator
        },
        storageValues() {
            return this.getValidValues.storage
        },
    },
    methods: {
        ...mapMutations('wizard', ['SETENERGY']),
        ...mapMutations('wizard', ['SETACTIVEREFENTRY', 'SETACTIVEREFERENCE']),

        // Set the selected values from above fields to the wizard store.
        // Called from all fields on change, and updates with all selected values from this form.
        setEnergy() {
            const value = {powerGeneration: this.generator, powerStorage: this.storage}
            this.SETENERGY(value)
        },
    },
    watch: {
        // Update power generator/storage (this is necessary to update the form values
        // when e.g. a config file is uploaded and the values in the store change)
        // and show error popups if the fields are invalid while the user is typing
        'getConfiguration.powerGeneration': {
            handler() {
                const {powerGeneration} = this.getConfiguration
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
        'getConfiguration.powerStorage': {
            handler() {
                const {powerStorage} = this.getConfiguration
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
}
</script>

<style lang="scss" scoped>
@import '../../sass/components/configuration-input';

.input-field-select{
    margin-right:24px;
}
</style>
