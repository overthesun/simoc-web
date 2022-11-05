<template>
    <div>
        <label class="input-wrapper">
            <div class="input-title" @click="setActiveRefEntry('Location')">
                Location <fa-icon :icon="['fa-solid','circle-info']" />
            </div> <!-- On click make the value the active entry on the reference. Set the wiki as active.-->
            <div class="input-description">Your habitat is located on the equatorial region of Mars.</div>
            <select ref="location" v-model="location" class="input-field-select" required @change="setInitial">
                <option value="none" disabled hidden>Location</option>
                <option value="mars" selected>Mars</option>
            </select>
        </label>
        <label class="input-wrapper">
            <div class="input-title" @click="setActiveRefEntry('Duration')">
                Mission Duration <fa-icon :icon="['fa-solid','circle-info']" />
            </div>
            <div class="input-description">Select the duration of your stay on Mars.</div>
            <div class="input-duration-wrapper">
                <input ref="duration" v-model="duration.amount" :min="duration_min" :max="duration_max"
                       class="input-field-number" type="number" pattern="^\d+$"
                       placeholder="Length" required @input="setInitial">
                <select ref="duration_unit" v-model="duration.units"
                        class="input-field-select" required @change="setInitial">
                    <option value="none" hidden disabled>Units</option>
                    <option value="hour">Hours</option>
                    <option value="day" selected>Earth Days (24h)</option>
                    <!--<option value="year">Earth Years (8760h)</option>
                        Currently disabled since the max is 1 year-->
                </select>
            </div>
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
        const {setInitial, setActiveRefEntry} = wizard
        return {configuration, validValues, setInitial, setActiveRefEntry}
    },
    data() {
        return {
            location: undefined,
            duration: undefined,
            duration_min: undefined,
            duration_max: undefined,
        }
    },
    watch: {
        'configuration.location': function() {
            // update location and report validity
            const {location} = this.configuration
            this.location = location
            this.$nextTick(() => this.$refs.location.reportValidity())
        },
        'configuration.duration': {
            handler() {
                // update and validate duration
                const {duration} = this.configuration
                this.duration = duration
                // validate duration units
                const validValues = this.validValues
                const duration_is_valid = validValues.duration_units.includes(duration.units)
                if (duration_is_valid) {
                    // set duration ranges
                    const range = validValues.duration_ranges[duration.units]
                    this.duration_min = range.min
                    this.duration_max = range.max
                } else {
                    this.$refs.duration_unit.reportValidity()
                }
                // wait until the min/max are updated to validate
                this.$nextTick(() => this.$refs.duration.reportValidity())
            },
            deep: true,  // should trigger when duration.amount/units change
        },
    },
    beforeMount() {
        // Get the values from the configuration that is initially set
        const {duration, location} = this.configuration
        this.location = location
        this.duration = duration
    },
    methods: {
        setInitial() {
            // Called when any of the form values are changed, or input happens.
            // Updates the wizard store values with the form values.
            const value = {location: this.location, duration: this.duration}
            this.setInitial(value)  // this will change the configuration and trigger the configuration watcher
        },
    },
}
</script>

<style lang="scss" scoped>
    @import '../../sass/components/configuration-input';

    .input-duration-wrapper{
        display:flex;
        justify-content: flex-start;
        align-items:center;
    }

    .input-field-number{
        margin-right:24px;
    }
</style>
