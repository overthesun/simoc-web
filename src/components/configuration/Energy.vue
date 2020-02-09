<!-- Energy Configuration Wizard Form -->

<template>
    <div>
        <label class='input-wrapper'>
            <div class='input-title'>
                Power Generation
                <fa-icon :icon="['fas','info-circle']" @click="SETACTIVEREFENTRY('PowerGeneration')" />
            </div>
            <div class='input-description'>Select the number of solar photo-voltaic (PV) panels required to meet your daily power consumption, and to recharge the batteries for the night. See graph at right.</div>
            <div>
                <!-- Use the retrieved generator value as the value for the field. On change set the configuration store value -->
                <select class='input-field-select' ref='generator_select' required v-model="generator.type" v-on:change="setEnergy">
                    <!-- <option value='none' selected>None</option>
                    TODO: this is hardcoded on Mars and is currently the only option -->
                    <option value='solar_pv_array_mars' selected>Solar PV Array</option>
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
            <div>
                <select class='input-field-select' ref='power_select' required v-model="storage.type" v-on:change="setEnergy">
                    <option value='power_storage' selected>Battery</option>
                </select>
                <label><input class='input-field-number' ref="power_input" type="number" pattern="^\d+$" placeholder="Quantity" required
                              :min="storageValues.min" :max="storageValues.max" v-on:input="setEnergy" v-model="storage.amount"> kWh</label>
            </div>
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
        // Update power generator/storage (this is necessary to update the form values
        // when e.g. a config file is uploaded and the values in the store change)
        // and show error popups if the fields are invalid while the user is typing
        'getConfiguration.powerGeneration': {
            handler:  function() {
                const powerGeneration = this.getConfiguration.powerGeneration
                this.generator = powerGeneration
                this.$nextTick(function() {
                    // wait for the forms to update before validating,
                    // otherwise this gives an error while loading presets
                    this.$refs.generator_select.reportValidity()
                    this.$refs.generator_input.reportValidity()
                })
            },
            deep: true // should trigger when powerGeneration.amount/type change
        },
        'getConfiguration.powerStorage': {
            handler:  function() {
                const powerStorage = this.getConfiguration.powerStorage
                this.storage = powerStorage
                this.$nextTick(function() {
                    // same as above
                    this.$refs.power_select.reportValidity()
                    this.$refs.power_input.reportValidity()
                })
            },
            deep: true // should trigger when powerStorage.amount/type change
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../sass/components/configuration-input';

.input-field-select{
    margin-right:24px;
}
</style>
