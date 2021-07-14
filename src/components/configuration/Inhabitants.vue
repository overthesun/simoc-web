<template>
    <div>
        <label class="input-wrapper">
            <div @click="SETACTIVEREFENTRY('CrewQuarters')" class="input-title">
                Crew Quarters <fa-icon :icon="['fas','info-circle']" />
            </div>
            <div class="input-description">Select the size of your crew quarters.</div>
            <select ref="crew_quarters_type" v-on:change="setInhabitants" v-model="crewQuarters.type"
                    class="input-field-select" required>
                <option value="none" selected>None</option>
                <option value="crew_habitat_small">Small 1000 m³</option>
                <option value="crew_habitat_medium">Medium 2260 m³</option>
                <option value="crew_habitat_large">Large 4020 m³</option>
            </select>
        </label>
        <label class="input-wrapper">
            <div @click="SETACTIVEREFENTRY('Inhabitants')" class="input-title">
                Inhabitants <fa-icon :icon="['fas','info-circle']" />
            </div>  <!-- On click make the value the active entry on the reference. Set the wiki as active.-->
            <div class="input-description">The number of astronaut explorers to live in your habitat.</div>
            <input ref="humans" :min="ranges.humans.min" :max="ranges.humans.max" v-on:input="setInhabitants"
                   v-model="humans.amount" class="input-field-number" type="number" pattern="^\d+$"
                   placeholder="Quantity" required>
        </label>
        <label class="input-wrapper">
            <div @click="SETACTIVEREFENTRY('Food')" class="input-title">
                Food Supply <fa-icon :icon="['fas','info-circle']" />
            </div>
            <div class="input-description">Make certain you have <a @click="SETACTIVEREFENTRY('Food')" class="reference-link" href="#">ample food</a> for an <a @click="SETACTIVEREFENTRY('ECLSS')" class="reference-link" href="#">ECLSS</a> only mission, or until the plants are ready to harvest. Humans consume 1.5kg food per day.</div>
            <label><input ref="food" :min="ranges.food.min" :max="ranges.food.max" v-on:input="setInhabitants"
                          v-model="food.amount" class="input-field-number" type="number" pattern="^\d+$"
                          placeholder="Quantity" required> kg</label>
        </label>
        <label class="input-wrapper">
            <div @click="SETACTIVEREFENTRY('ECLSS')" class="input-title">
                Life Support <fa-icon :icon="['fas','info-circle']" />
            </div>
            <div class="input-description">As with the International Space Station, the Environmental Control &amp; Life Support System (ECLSS) cleans your air and water.</div>
            <label><input ref="eclss" :min="ranges.eclss.min" :max="ranges.eclss.max"
                          v-on:input="setInhabitants" v-model="eclss.amount"
                          class="input-field-number" type="number" pattern="^\d+$"
                          placeholder="Quantity" required> ECLSS modules</label>
        </label>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations} from 'vuex'

export default {
    data() {
        return {
            humans: undefined,
            food: undefined,
            crewQuarters: undefined,
            eclss: undefined,
        }
    },
    beforeMount() {
        // Get the values from the configuration that is initially set
        const {humans, food, crewQuarters, eclss} = this.getConfiguration
        this.humans = humans
        this.food = food
        this.crewQuarters = crewQuarters
        this.eclss = eclss
    },
    computed: {
        ...mapGetters('wizard', ['getConfiguration', 'getValidValues']),
        ranges() {
            return this.getValidValues  // return the valid ranges for humans/food/eclss
        },
    },
    methods: {
        ...mapMutations('wizard', ['SETINHABITANTS']),
        ...mapMutations('wizard', ['SETACTIVEREFENTRY']),

        setInhabitants() {
            // Sets all related values for the inhabitants form into the wizard store.
            const value = {humans: this.humans, food: this.food,
                           crewQuarters: this.crewQuarters, eclss: this.eclss}
            this.SETINHABITANTS(value)
        },
        validateRef(ref) {
            // wait for the fields to be updated before attempting validation
            this.$nextTick(() => this.$refs[ref].reportValidity())
        },
    },
    watch: {
        // When the values in the store are changed, update the form and validate it.
        // The validation doesn't happen in setInhabitants because this is also triggered
        // when a config file is uploaded
        'getConfiguration.crewQuarters': {
            handler() {
                const {crewQuarters} = this.getConfiguration
                // TODO: maybe the amount should be a hidden field
                if (crewQuarters.type === 'none') {
                    this.humans.amount = 0  // can't have humans without crew quarters
                    crewQuarters.amount = 0
                } else {
                    crewQuarters.amount = 1
                    this.$refs.humans.setCustomValidity('')  // remove custom error
                }
                this.validateRef('humans')  // wait until the min/max are updated to validate

                this.crewQuarters = crewQuarters
                this.$refs.crew_quarters_type.reportValidity()
            },
            deep: true, // Must be used if the watched value is an object.
        },
        'getConfiguration.humans.amount': function() {
            const {humans} = this.getConfiguration
            this.humans = humans
            // if we have humans, check that the crew quarter is selected before checking the ranges
            const crew_quarters_are_invalid = (this.crewQuarters.type === 'none' ||
                                               !this.$refs.crew_quarters_type.checkValidity())
            const humans_are_invalid = (humans.amount > 0 && crew_quarters_are_invalid)
            this.$refs.humans.setCustomValidity(
                humans_are_invalid ? 'Please select a crew quarters type.' : ''
            )
            this.validateRef('humans')
        },
        'getConfiguration.food.amount': function() {
            this.food = this.getConfiguration.food
            this.validateRef('food')
        },
        'getConfiguration.eclss.amount': function() {
            this.eclss = this.getConfiguration.eclss
            this.validateRef('eclss')
        },
    },
}
</script>

<style lang="scss" scoped>
    @import '../../sass/components/configuration-input';
</style>
