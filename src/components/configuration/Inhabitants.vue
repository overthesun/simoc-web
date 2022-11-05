<template>
    <div>
        <label class="input-wrapper">
            <div class="input-title" @click="setActiveRefEntry('CrewQuarters')">
                Crew Quarters <fa-icon :icon="['fa-solid','circle-info']" />
            </div>
            <div class="input-description">Select the size of your crew quarters.</div>
            <select ref="crew_quarters_type" v-model="crewQuarters.type"
                    class="input-field-select" required @change="setInhabitants">
                <option value="none" selected>None</option>
                <option value="crew_habitat_small">Small (1000 m³)</option>
                <option value="crew_habitat_medium">Medium (2260 m³)</option>
                <option value="crew_habitat_large">Large (4020 m³)</option>
                <option value="crew_habitat_sam">SAM (272 m³)</option>
            </select>
        </label>
        <label class="input-wrapper">
            <div class="input-title" @click="setActiveRefEntry('Inhabitants')">
                Inhabitants <fa-icon :icon="['fa-solid','circle-info']" />
            </div>  <!-- On click make the value the active entry on the reference. Set the wiki as active.-->
            <div class="input-description">The number of astronaut explorers to live in your habitat.</div>
            <input ref="humans" v-model="humans.amount" :min="ranges.humans.min" :max="ranges.humans.max"
                   class="input-field-number" type="number" pattern="^\d+$" placeholder="Quantity"
                   required @input="setInhabitants">
        </label>
        <label class="input-wrapper">
            <div class="input-title" @click="setActiveRefEntry('Food')">
                Food Supply <fa-icon :icon="['fa-solid','circle-info']" />
            </div>
            <div class="input-description">Make certain you have <a class="reference-link" href="#" @click="setActiveRefEntry('Food')">ample food</a> for an <a class="reference-link" href="#" @click="setActiveRefEntry('ECLSS')">ECLSS</a> only mission, or until the plants are ready to harvest. Humans consume 1.5kg food per day.</div>
            <label><input ref="food" v-model="food.amount" :min="ranges.food.min" :max="ranges.food.max"
                          class="input-field-number" type="number" pattern="^\d+$" placeholder="Quantity"
                          required @input="setInhabitants"> kg</label>
        </label>
        <label class="input-wrapper">
            <div class="input-title" @click="setActiveRefEntry('ECLSS')">
                Life Support <fa-icon :icon="['fa-solid','circle-info']" />
            </div>
            <div class="input-description">As with the International Space Station, the Environmental Control &amp; Life Support System (ECLSS) cleans your air and water.</div>
            <label><input ref="eclss" v-model="eclss.amount" :min="ranges.eclss.min"
                          :max="ranges.eclss.max" class="input-field-number"
                          type="number" pattern="^\d+$" placeholder="Quantity"
                          required @input="setInhabitants"> ECLSS modules</label>
        </label>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations} from 'vuex'
import {storeToRefs} from 'pinia'
import {useWizardStore} from '../../store/modules/WizardStore'

export default {
    setup() {
        const wizard = useWizardStore()
        const {configuration, validValues} = storeToRefs(wizard)
        const {setInhabitants, setActiveRefEntry} = wizard
        return {configuration, validValues, setInhabitants, setActiveRefEntry}
    },
    data() {
        return {
            humans: undefined,
            food: undefined,
            crewQuarters: undefined,
            eclss: undefined,
        }
    },
    computed: {
        ranges() {
            return this.validValues  // return the valid ranges for humans/food/eclss
        },
    },
    watch: {
        // When the values in the store are changed, update the form and validate it.
        // The validation doesn't happen in setInhabitants because this is also triggered
        // when a config file is uploaded
        'configuration.crewQuarters': {
            handler() {
                const {crewQuarters} = this.configuration
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
        'configuration.humans.amount': function() {
            const {humans} = this.configuration
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
        'configuration.food.amount': function() {
            this.food = this.configuration.food
            this.validateRef('food')
        },
        'configuration.eclss.amount': function() {
            this.eclss = this.configuration.eclss
            this.validateRef('eclss')
        },
    },
    beforeMount() {
        // Get the values from the configuration that is initially set
        const {humans, food, crewQuarters, eclss} = this.configuration
        this.humans = humans
        this.food = food
        this.crewQuarters = crewQuarters
        this.eclss = eclss
    },
    methods: {
        setInhabitants() {
            // Sets all related values for the inhabitants form into the wizard store.
            const value = {humans: this.humans, food: this.food,
                           crewQuarters: this.crewQuarters, eclss: this.eclss}
            this.setInhabitants(value)
        },
        validateRef(ref) {
            // wait for the fields to be updated before attempting validation
            this.$nextTick(() => this.$refs[ref].reportValidity())
        },
    },
}
</script>

<style lang="scss" scoped>
    @import '../../sass/components/configuration-input';
</style>
