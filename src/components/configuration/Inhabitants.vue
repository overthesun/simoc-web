<template>
    <form class='form-wrapper' ref='inhabitants-form' @submit.prevent="">
        <label class='input-wrapper'>
            <div class='input-title'>
                Crew Quarters
                <fa-icon :icon="['fas','info-circle']" @click="SETACTIVEREFENTRY('CrewQuarters')" />
            </div>
            <div class='input-description'>Select the size of your crew quarters: small, medium, or large.</div>
            <select class='input-field-select' ref='crew_quarters_type' required v-on:change="setInhabitants" v-model="crewQuarters.type">
                <option value="none" selected>None</option>
                <option value="crew_habitat_small">Small 1000 m³</option>
                <option value="crew_habitat_medium">Medium 2260 m³</option>
                <option value="crew_habitat_large">Large 4020 m³</option>
            </select >
        </label>
        <label class='input-wrapper'>
            <div class='input-title'>
                Inhabitants
                <fa-icon :icon="['fas','info-circle']" @click="SETACTIVEREFENTRY('Inhabitants')" />
            </div>  <!-- On click make the value the active entry on the reference. Set the wiki as active.-->
            <div class='input-description'>The number of astronaut explorers to live in your habitat.</div>
            <input class='input-field-number' ref='humans' type="number" pattern="^\d+$" placeholder="Quantity" required
                   :min="ranges.humans.min" :max="ranges.humans.max" v-on:input="setInhabitants" v-model="humans.amount">
        </label>
        <label class='input-wrapper'>
            <div class='input-title'>
                Food Supply
                <fa-icon :icon="['fas','info-circle']" @click="SETACTIVEREFENTRY('Food')" />
            </div>
            <div class='input-description'>Make certain you have ample food for an ECLSS only mission, or until the plants are ready to harvest. Humans consume 2.4kg food per day.</div>
            <label><input class='input-field-number' ref='food' type="number" pattern="^\d+$" placeholder="Quantity" required
                          :min="ranges.food.min" :max="ranges.food.max" v-on:input="setInhabitants" v-model="food.amount"> kg</label>
        </label>
        <label class='input-wrapper'>
            <div class='input-title'>
                Life Support
                <fa-icon :icon="['fas','info-circle']" @click="SETACTIVEREFENTRY('ECLSS')" />
            </div>
            <div class='input-description'>As with the International Space Station, the Environmental Control &amp; Life Support System (ECLSS) cleans your air and water.</div>
            <label><input class='input-field-number' ref='eclss' type="number" pattern="^\d+$" placeholder="Quantity" required
                          :min="ranges.eclss.min" :max="ranges.eclss.max" v-on:input="setInhabitants" v-model="eclss.amount"> ECLSS modules</label>
        </label>
    </form>
</template>

<script>
import {mapState,mapGetters,mapMutations} from 'vuex'

export default {
    data(){
        return{
            humans:undefined,
            food:undefined,
            crewQuarters:undefined,
            eclss:undefined,
        }
    },
    beforeMount:function(){
        // Get the values from the configuration that is initially set
        const {humans,food,crewQuarters,eclss} = this.getConfiguration
        this.humans = humans
        this.food = food
        this.crewQuarters = crewQuarters
        this.eclss = eclss
    },
    computed:{
        ...mapGetters('wizard', ['getConfiguration','getValidValues']),
        ranges() {
            return this.getValidValues  // return the valid ranges for humans/food/eclss
        },
    },
    methods:{
        ...mapMutations('wizard',['SETINHABITANTS']),
        ...mapMutations('wizard',['SETACTIVEREFENTRY']),

        setInhabitants:function(){
            // Sets all related values for the inhabitants form into the wizard store.
            const value = {'humans': this.humans, 'food': this.food,
                           'crewQuarters': this.crewQuarters, 'eclss': this.eclss}
            this.SETINHABITANTS(value)
        },
    },
    watch:{
        // When the values in the store are changed, update the form and validate it.
        // The validation doesn't happen in setInhabitants because this is also triggered
        // when a config file is uploaded
        'getConfiguration.crewQuarters':{
            handler:function(){
                // TODO: maybe the amount should be a hidden field
                if (this.crewQuarters.type === "none") {
                    this.crewQuarters.amount = 0
                    this.humans.amount = 0  // can't have humans without crew quarters
                }
                else {
                    this.crewQuarters.amount = 1
                    this.$refs.humans.setCustomValidity('')  // remove custom error
                }
                this.$nextTick(function() {
                    // wait until the min/max are updated to validate
                    this.$refs.humans.reportValidity()
                })

                const crewQuarters = this.getConfiguration.crewQuarters
                const quarters_are_valid = this.getValidValues.crew_quarters_types.includes(crewQuarters.type)
                this.$refs.crew_quarters_type.setCustomValidity(quarters_are_valid?'':'Please select a valid crew quarters type.')
                this.$refs.crew_quarters_type.reportValidity()
                this.crewQuarters = crewQuarters
            },
            deep:true //Must be used if the watched value is an object.
        },
        'getConfiguration.humans.amount': function() {
            const humans = this.getConfiguration.humans
            const humans_are_invalid = (this.crewQuarters.type === "none" && humans.amount > 0)
            this.$refs.humans.setCustomValidity(humans_are_invalid?'Please select a crew quarters type.':'')
            this.$refs.humans.reportValidity()
        },
        'getConfiguration.food.amount': function() {
            this.$refs.food.reportValidity()
        },
        'getConfiguration.eclss.amount': function() {
            this.$refs.eclss.reportValidity()
        },
    }

}
</script>

<style lang="scss" scoped>
    @import '../../sass/components/configuration-input';
</style>
