<template>
    <div>
        <label v-if="simLocation === 'b2'" class="input-wrapper">
            <div class="input-title" @click="setActiveRefEntry('StartDate')">
                Mission Start Date <fa-icon :icon="['fa-solid','circle-info']" />
            </div>
            <div class="input-description">Select the start date of your stay at B2.</div>
            <div class="input-initial-wrapper">
                <input ref="startDate" v-model="startDate"
                       class="input-date-select" type="date" required @input="setInitialHandler"
                       @change="setInitialHandler">
            </div>
        </label>
        <label class="input-wrapper">
            <div class="input-title" @click="setActiveRefEntry('Duration')">
                Mission Duration <fa-icon :icon="['fa-solid','circle-info']" />
            </div>
            <div v-if="simLocation === 'mars'" class="input-description">Select the duration of your stay on Mars.</div>
            <div v-else class="input-description">Select the duration of your stay at B2.</div>
            <div class="input-initial-wrapper">
                <input ref="duration" v-model="duration.amount" :min="duration_min" :max="duration_max"
                       class="input-field-number" type="number" pattern="^\d+$"
                       placeholder="Length" required @input="setInitialHandler">
                <select ref="duration_unit" v-model="duration.units"
                        class="input-field-select" required @change="setInitialHandler">
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
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useWizardStore} from '../../store/modules/WizardStore'

export default {
    setup() {
        const dashboard = useDashboardStore()
        const wizard = useWizardStore()
        const {simLocation} = storeToRefs(dashboard)
        const {configuration, validValues} = storeToRefs(wizard)
        const {setInitial, setActiveRefEntry} = wizard
        return {simLocation, configuration, validValues, setInitial, setActiveRefEntry}
    },
    data() {
        return {
            startDate: undefined,
            duration: undefined,
            duration_min: undefined,
            duration_max: undefined,
        }
    },
    watch: {
        'configuration.startDate': function() {
            // update start date
            const {startDate} = this.configuration
            this.startDate = startDate
            this.$nextTick(() => this.$refs.startDate.reportValidity())
        },
        'configuration.duration': {
            handler() {
                // update and validate duration
                const {duration} = this.configuration
                this.duration = duration
                // validate duration units
                const {validValues} = this
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
        const {startDate, duration} = this.configuration
        this.startDate = startDate
        this.duration = duration
    },
    methods: {
        setInitialHandler() {
            // Called when any of the form values are changed, or input happens.
            // Updates the wizard store values with the form values.
            const value = {startDate: this.startDate, duration: this.duration}
            this.setInitial(value)  // this will change the configuration and trigger the configuration watcher
        },
    },
}
</script>

<style lang="scss" scoped>
    @import '../../sass/components/configuration-input';

    .input-initial-wrapper{
        display:flex;
        justify-content: flex-start;
        align-items:center;
    }

    .input-field-number{
        margin-right:24px;
    }
</style>
