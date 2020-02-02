<template>
    <form class='form-wrapper' ref='initial-form' @submit.prevent="">
        <label class='input-wrapper'>
            <div class='input-title'>
                Location
                <fa-icon :icon="['fas','info-circle']" @click="SETACTIVEREFENTRY('Location')" />
            </div> <!-- On click make the value the active entry on the reference. Set the wiki as active.-->
            <div class='input-description'>In this beta release, your habitat is located on the equatorial region of Mars.</div>
            <select class='input-field-select' ref="location" v-model="location" v-on:change="setInitial">
                <option value="none" disabled hidden>Location</option>
                <option value="mars" selected>Mars</option>
            </select>
        </label>
        <label class='input-wrapper'>
            <div class='input-title'>
                Mission Duration
                <fa-icon :icon="['fas','info-circle']" @click="SETACTIVEREFENTRY('Duration')" />
            </div>
            <div class='input-description'>Select the duration of your stay on Mars.</div>
            <div class='input-duration-wrapper'>
                <input class='input-field-number' type="number" pattern="^\d+$" placeholder="Length"
                       :min="duration_min" :max="duration_max" v-on:input="setInitial" v-model="duration.amount">
                <select class='input-field-select' ref="duration_unit"
                        v-on:change="setInitial" v-model="duration.units">
                    <option value="none" hidden disabled>Units</option>
                    <option value="hour">Hours</option>
                    <option value="day" selected>Earth Days (24h)</option>
                    <!--<option value="year">Earth Years (8760h)</option>
                        Currently disabled since the max is 1 year-->
                </select>
            </div>
        </label>
    </form>
</template>

<script>
import {mapState,mapGetters,mapMutations} from 'vuex'

export default {
    data(){
        return{
            location: undefined,
            duration: undefined,
            duration_min: undefined,
            duration_max: undefined,
        }
    },
    beforeMount:function(){
        //Get the values from the configuration that is initially set
        const {duration,location} = this.getConfiguration
        this.location = location
        this.duration = duration
    },
    computed:{
        ...mapGetters('wizard', ['getConfiguration','getValidValues']),
    },
    methods:{
        ...mapMutations('wizard',['SETINITIAL']),
        ...mapMutations('wizard',['SETACTIVEREFENTRY']),

        setInitial:function() {
            // Called when any of the form values are changed, or input happens.
            // Updates the wizard store values with the form values.
            const value = {'location': this.location, 'duration': this.duration}
            this.SETINITIAL(value)  // this will change the configuration and trigger the getConfiguration watcher
        }
    },
    watch:{
        getConfiguration:{
            handler:function(){
                // When the values in the store are changed, update the form and validate it.
                // The validation doesn't happen in setInitial because this is also triggered
                // when a config file is uploaded
                const validValues = this.getValidValues
                const {location, duration} = this.getConfiguration
                // validate location
                const location_is_valid = validValues.locations.includes(location)
                this.$refs.location.setCustomValidity(location_is_valid?'':'Please select a valid location')
                // validate duration units
                const duration_is_valid = validValues.duration_units.includes(duration.units)
                this.$refs.duration_unit.setCustomValidity(duration_is_valid?'':'Please select a valid duration unit')
                if (duration_is_valid) {
                    // validate duration ranges
                    const range = validValues.duration_ranges[duration.units]
                    this.duration_min = range.min
                    this.duration_max = range.max
                }
                this.$nextTick(function() {
                    // wait until the min/max are updated to validate
                    this.$refs['initial-form'].reportValidity()
                })
                this.location = location
                this.duration = duration
            },
            // TODO: check if there's a way to watch only the location/duration
            deep:true //Must be used for watching any object type values.
        }
    }
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
