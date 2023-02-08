<template>
    <div>
        <label v-if="simLocation === 'mars'" class="input-wrapper">
            <div class="input-title" @click="setActiveRefEntry('CrewQuarters')">
                Crew Quarters <fa-icon :icon="['fa-solid','circle-info']" />
            </div>
            <div class="input-description">Select the size of your crew quarters.</div>
            <select ref="crew_quarters_type" v-model="crewQuarters.type"
                    class="input-field-select" required @change="setInhabitantsHandler">
                <option value="none" selected>None</option>
                <option value="crew_habitat_small">Small (1000 m³)</option>
                <option value="crew_habitat_medium">Medium (2260 m³)</option>
                <option value="crew_habitat_large">Large (4020 m³)</option>
                <option value="crew_habitat_sam">SAM (272 m³)</option>
            </select>
        </label>
        <label v-else class="input-wrapper">
            <div class="input-title" @click="setActiveRefEntry('Biomes')">
                Biomes <fa-icon :icon="['fa-solid','circle-info']" />
            </div>
            <div class="input-description">Select the size of each Biosphere 2 biome.</div>
            <template v-for="(val, key) in biomes" :key="key + '-input'">
                <label class="list-input">
                    <input :ref="key" v-model="biomes[key]" min="0" max="10000"
                           class="input-field-number" type="number" step="1" pattern="^\d+$"
                           placeholder="Square Meters" required @input="setInhabitantsHandler">
                    m<sup>2</sup> {{stringFormatter(key)}}
                </label>
            </template>
        </label>
        <label class="input-wrapper">
            <div class="input-title" @click="setActiveRefEntry('Inhabitants')">
                Inhabitants <fa-icon :icon="['fa-solid','circle-info']" />
            </div>  <!-- On click make the value the active entry on the reference. Set the wiki as active.-->
            <div class="input-description">The number of
                {{{'mars': 'astronaut explorers', 'b2': 'biospherians'}[simLocation]}}
                to live in your habitat.</div>
            <input ref="humans" v-model="humans.amount" :min="ranges.humans.min" :max="ranges.humans.max"
                   class="input-field-number" type="number" pattern="^\d+$" placeholder="Quantity"
                   required @input="setInhabitantsHandler">
        </label>
        <label class="input-wrapper">
            <div class="input-title" @click="setActiveRefEntry('Food')">
                Food Supply <fa-icon :icon="['fa-solid','circle-info']" />
            </div>
            <div class="input-description">Make certain you have <a class="reference-link" href="#" @click="setActiveRefEntry('Food')">ample food</a> for an <a class="reference-link" href="#" @click="setActiveRefEntry('ECLSS')">ECLSS</a> only mission, or until the plants are ready to harvest. Humans consume 1.5kg food per day.</div>
            <label><input ref="food" v-model="food.amount" :min="ranges.food.min" :max="ranges.food.max"
                          class="input-field-number" type="number" pattern="^\d+$" placeholder="Quantity"
                          required @input="setInhabitantsHandler"> kg</label>
        </label>
        <label v-if="simLocation === 'b2'" class="input-wrapper">
            <div class="input-title" @click="setActiveRefEntry('Concrete')">
                Concrete <fa-icon :icon="['fa-solid','circle-info']" />
            </div>
            <div class="input-description">How much <a class="reference-link" href="#" @click="setActiveRefEntry('Concrete')">carbonation</a> has occured? Concrete in high-CO₂ environments can reach up to .1 moles over 20 years.</div>
            <label><input ref="concrete" v-model="concrete.carbonation" :min="ranges.concrete.min"
                          :max="ranges.concrete.max" class="input-field-number" type="number" pattern="^\d+$"
                          placeholder="Quantity" step="0.001" required @input="setInhabitantsHandler">
                moles per m²</label>
        </label>
    </div>
</template>

<script>
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useWizardStore} from '../../store/modules/WizardStore'
import {StringFormatter} from '../../javascript/utils'

export default {
    setup() {
        const dashboard = useDashboardStore()
        const wizard = useWizardStore()
        const {simLocation} = storeToRefs(dashboard)
        const {configuration, validValues} = storeToRefs(wizard)
        const {setInhabitants, setActiveRefEntry} = wizard
        return {simLocation, configuration, validValues, setInhabitants, setActiveRefEntry}
    },
    data() {
        return {
            humans: undefined,
            food: undefined,
            crewQuarters: undefined,
            biomes: undefined,
            concrete: undefined,
        }
    },
    computed: {
        ranges() {
            return this.validValues  // return the valid ranges for humans/food
        },
        inhabitantActivities() {
            const {weeding, pestPicking} = this.configuration.humans
            return {weeding, pestPicking}
        },
    },
    watch: {
        // When the values in the store are changed, update the form and validate it.
        // The validation doesn't happen in setInhabitantsHandler because this is also triggered
        // when a config file is uploaded
        'configuration.crewQuarters': {
            handler() {
                if (this.simLocation === 'mars') {
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
                }
            },
            deep: true, // Must be used if the watched value is an object.
        },
        'configuration.humans.amount': function() {
            const {humans} = this.configuration
            this.humans = humans
            if (this.simLocation === 'mars') {
                // if we have humans, check that the crew quarter is selected before checking the ranges
                const crew_quarters_are_invalid = (this.crewQuarters.type === 'none' ||
                                                   !this.$refs.crew_quarters_type.checkValidity())
                const humans_are_invalid = (humans.amount > 0 && crew_quarters_are_invalid)
                this.$refs.humans.setCustomValidity(
                    humans_are_invalid ? 'Please select a crew quarters type.' : ''
                )
            }
            this.validateRef('humans')
        },
        'inhabitantActivities': function() {
            const {humans} = this.configuration
            this.humans = humans
            const working_hours_invalid = (humans.weeding + humans.pestPicking) > 16
            this.$refs.humans.setCustomValidity(
                working_hours_invalid ? 'Hours spent working must total 16 hours/day or less.' : ''
            )
            this.validateRef('humans')
        },
        'configuration.food.amount': function() {
            this.food = this.configuration.food
            this.validateRef('food')
        },
        'configuration.biomes': {
            handler() {
                this.biomes = this.configuration.biomes
                Object.keys(this.biomes).forEach(biome => {
                    this.validateRef(biome)
                })
            },
            deep: true,
        },
        'configuration.concrete': {
            handler() {
                this.concrete = this.configuration.concrete
                this.validateRef('concrete')
            },
            deep: true,
        },
    },
    beforeMount() {
        // Get the values from the configuration that is initially set
        const {humans, food, crewQuarters} = this.configuration
        this.humans = humans
        this.food = food
        this.crewQuarters = crewQuarters
        if (this.simLocation === 'b2') {
            const {biomes, concrete} = this.configuration
            this.biomes = biomes
            this.concrete = concrete
        }
    },
    methods: {
        stringFormatter: StringFormatter,
        setInhabitantsHandler() {
            // Sets all related values for the inhabitants form into the wizard store.
            const value = {humans: this.humans, food: this.food, crewQuarters: this.crewQuarters}
            if (this.simLocation === 'b2') {
                value.biomes = this.biomes
                value.concrete = this.concrete
            }
            this.setInhabitants(value)
        },
        validateRef(ref) {
            // wait for the fields to be updated before attempting validation
            this.$nextTick(() => {
                let r = this.$refs[ref]
                if (Array.isArray(r)) {
                    r = r[0]
                }
                r.reportValidity()
            })
        },
    },
}
</script>

<style lang="scss" scoped>
    @import '../../sass/components/configuration-input';

    .list-input {
        margin-top: 0.5em;
    }
</style>
