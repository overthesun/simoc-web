<template>
    <div>
        <label class="input-wrapper">
            <div class="input-title" @click="SETACTIVEREFENTRY('Location')">
                Location <fa-icon :icon="['fas','info-circle']" />
            </div> <!-- On click make the value the active entry on the reference. Set the wiki as active.-->
            <div class="input-description">Your habitat is located on the equatorial region of Mars.</div>
            <select class="input-field-select" ref="location" required v-model="location" v-on:change="setInitial">
                <option value="none" disabled hidden>Location</option>
                <option value="mars" selected>Mars</option>
            </select>
        </label>
        <label class="input-wrapper">
            <div class="input-title" @click="SETACTIVEREFENTRY('Duration')">
                Mission Duration <fa-icon :icon="['fas','info-circle']" />
            </div>
            <div class="input-description">Select the duration of your stay on Mars.</div>
            <div class="input-duration-wrapper">
                <input class="input-field-number" ref="duration" type="number" pattern="^\d+$"
                       placeholder="Length" required :min="duration_min" :max="duration_max"
                       v-on:input="setInitial" v-model="duration.amount">
                <select class="input-field-select" ref="duration_unit" required
                        v-on:change="setInitial" v-model="duration.units">
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

export default {
    data() {
        return {
            location: undefined,
            duration: undefined,
            duration_min: undefined,
            duration_max: undefined,
        }
    },
    beforeMount() {
        // Get the values from the configuration that is initially set
        const {duration, location} = this.getConfiguration
        this.location = location
        this.duration = duration
    },
    computed: {
        ...mapGetters('wizard', ['getConfiguration', 'getValidValues']),
    },
    methods: {
        ...mapMutations('wizard', ['SETINITIAL']),
        ...mapMutations('wizard', ['SETACTIVEREFENTRY']),

        setInitial() {
            // Called when any of the form values are changed, or input happens.
            // Updates the wizard store values with the form values.
            const value = {location: this.location, duration: this.duration}
            this.SETINITIAL(value)  // this will change the configuration and trigger the getConfiguration watcher
        },
    },
    watch: {
        'getConfiguration.location': function() {
            // update location and report validity
            const {location} = this.getConfiguration
            this.location = location
            this.$nextTick(function() {
                this.$refs.location.reportValidity()
            })
        },
        'getConfiguration.duration': {
            handler() {
                // update and validate duration
                const {duration} = this.getConfiguration
                this.duration = duration
                // validate duration units
                const validValues = this.getValidValues
                const duration_is_valid = validValues.duration_units.includes(duration.units)
                if (duration_is_valid) {
                    // set duration ranges
                    const range = validValues.duration_ranges[duration.units]
                    this.duration_min = range.min
                    this.duration_max = range.max
                } else {
                    this.$refs.duration_unit.reportValidity()
                }
                this.$nextTick(function() {
                    // wait until the min/max are updated to validate
                    this.$refs.duration.reportValidity()
                })
            },
            deep: true,  // should trigger when duration.amount/units change
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
