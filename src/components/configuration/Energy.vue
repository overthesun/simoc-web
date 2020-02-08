<!-- Energy Configuration Wizard Form -->

<template>
    <div>
        <label class='input-wrapper'>
            <div class='input-title'>
                Power Generation
                <fa-icon :icon="['fas','info-circle']" @click="SETACTIVEREFENTRY('PowerGeneration')" />
            </div>
            <div class='input-description'>Select the number of solar photo-voltaic (PV) panels required to meet your daily power consumption, and to recharge the batteries for the night. See graph at right.</div>
            <div class='input-generator-wrapper'>
                <!-- Use the retrieved generator value as the value for the field. On change set the configuration store value -->
                <select class='input-field-select' ref='generator_select' required v-model="generator.type" v-on:change="setEnergy">
                    <option value='none' selected>None</option>
                    <!-- TODO: this is hardcoded on Mars -->
                    <option value='solar_pv_array_mars'>Solar PV Array</option>
                </select>
                 <label><input class='input-field-number' ref="generator_input" type="number" pattern="^\d+$" placeholder="Quantity" required
                               :min="generatorValues.min" :max="generatorValues.max" v-on:input="setEnergy" v-model="generator.amount"> panels</label>
            </div>
        </label>
        <label class='input-wrapper'>
            <div class='input-title'>
                Power Storage
                <fa-icon :icon="['fas','info-circle']" @click="SETACTIVEREFENTRY('PowerStorage')" />
            </div>
            <div class='input-description'>Power storage is measured in kilowatt-hours (kWh). Select the capacity of your battery in increments of 1000 kWh, from 0 to 10,000.</div>
            <label><input class='input-field-number' ref="power_input" type="number" pattern="^\d+$" placeholder="Quantity" required
                          :min="storageValues.min" :max="storageValues.max" v-on:input="setEnergy" v-model="storage.amount"> kWh</label>
        </label>
    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations} from 'vuex'

export default {
    data(){
        return{
            generator:undefined,
            storage:undefined,
        }
    },
    beforeMount:function(){
        const {powerGeneration,powerStorage} = this.getConfiguration
        this.generator = powerGeneration
        this.storage = powerStorage
    },
    computed:{
        ...mapGetters('wizard',['getConfiguration', 'getValidValues']),
        generatorValues() {
            return this.getValidValues.generator
        },
        storageValues() {
            return this.getValidValues.storage
        },
    },
    methods:{
        ...mapMutations('wizard',['SETENERGY']),
        ...mapMutations('wizard',['SETACTIVEREFENTRY']),

        //This method sets the selected values from above fields to the wizard store - configuration -powerGeneration & powerStorage values.
        //It is called from all fields on change, and updates with all selected values from this form.
        setEnergy:function() {
            const value = {'powerGeneration': this.generator, 'powerStorage': this.storage}
            this.SETENERGY(value)
        }
    },
    watch:{
        //If any part of the configuration has changed, update the values this form uses too. This is useful for watching when
        // a preset changes all values within the configuration object within wizard store.
        'getConfiguration.powerGeneration': {
            handler:  function() {
                // validate and update generator
                const powerGeneration = this.getConfiguration.powerGeneration
                const generator_is_valid = this.getValidValues.generator_types.includes(powerGeneration.type)
                this.$refs.generator_select.setCustomValidity(generator_is_valid?'':'Please select a valid generator type')
                this.$refs.generator_select.reportValidity()
                this.$refs.generator_input.reportValidity()
                this.generator = powerGeneration
            },
            deep: true // should trigger when powerGeneration.amount/type change
        },
        'getConfiguration.powerStorage': {
            handler:  function() {
                // update power storage (this is necessary to update the form value when
                // e.g. a config file is uploaded and the value in the store changes)
                const powerStorage = this.getConfiguration.powerStorage
                this.storage = powerStorage
                this.$refs.power_input.reportValidity()
            },
            deep: true // should trigger when powerStorage.amount/type change
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '../../sass/components/configuration-input';

    .input-energy-wrapper{
        display:flex;
        justify-content: flex-start;
        align-items:center;
    }

    .input-field-select{
        margin-right:24px;
    }
</style>
