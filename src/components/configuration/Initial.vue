<template>
    <form class='form-wrapper' @submit.prevent="">
        <label class='input-wrapper'>
            <div class='input-title'>
                Location
                <fa-icon :icon="['fas','info-circle']" @click="SETACTIVEREFENTRY('Location')" />
            </div> <!-- On click make the value the active entry on the reference. Set the wiki as active.-->
            <div class='input-description'>In this beta release, your habitat is located on the equatorial region of Mars.</div>
            <select class='input-field-select' v-model="location" v-on:change="setInitial">
                <option value="none" disabled hidden selected>Location</option>
                <option value="mars">Mars</option>
            </select>
        </label>
        <label class='input-wrapper'>
            <div class='input-title'>
                Mission Duration
                <fa-icon :icon="['fas','info-circle']" @click="SETACTIVEREFENTRY('Duration')" />
            </div>
            <div class='input-description'>Select the duration of your stay on Mars.</div>
            <div class='input-duration-wrapper'>
                <input class='input-field-number' type="number" pattern="^\d+$" placeholder="Length" v-on:input="setInitial" v-model="duration.amount">
                <select class='input-field-select' v-on:change="setInitial" v-model="duration.units">
                    <option value="none" hidden disabled selected>Units</option>
                    <option value="hour">Hours</option>
                    <option value="day">Earth Days (24h)</option>
                    <!--<option value="year">Earth Years (8760h)</option>
                        Currently disabled since the max is 1 year-->
                </select>
            </div>
        </label>
    </form>
</template>

<script>
import {mapState,mapGetters,mapMutations} from 'vuex'
import {ensure_within} from '../../javascript/utils'
export default {
    data(){
        return{
            location:undefined,
            duration:undefined,
        }
    },
    beforeMount:function(){
        //Get the values from the configuration that is initially set
        const {duration,location} = this.getConfiguration
        this.location = location
        this.duration = duration
    },
    computed:{
        ...mapGetters('wizard',['getConfiguration']),
    },
    methods:{
        ...mapMutations('wizard',['SETINITIAL']),
        ...mapMutations('wizard',['SETACTIVEREFENTRY']),


        //Called when any of the field's values are changed, or input happens. Updates all related fields to the Initial form within the wizard store.
        setInitial:function(){
            if (this.duration.units === 'hour') {
                this.duration.amount = ensure_within(this.duration.amount, 240, 16488)
            }
            else if (this.duration.units === 'day') {
                this.duration.amount = ensure_within(this.duration.amount, 10, 687)
            }
            else if (this.duration.units === 'year') {
                // currently disabled
                this.duration.amount = ensure_within(this.duration.amount, 1, 1)
            }
            const value = {'location': this.location, 'duration': this.duration}
            this.SETINITIAL(value)
        }
    },
    watch:{
        getConfiguration:{
            handler:function(){
                const {location,duration} = this.getConfiguration
                this.location = location
                this.duration = duration
            },
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
