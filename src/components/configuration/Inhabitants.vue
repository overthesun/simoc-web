<template>
    <form class='form-wrapper' @submit.prevent="">
        <label class='input-wrapper'>
            <div class='input-title'>
                Inhabitants
                <fa-icon :icon="['fas','info-circle']" @click="SETACTIVEREFENTRY('Inhabitants')" />
            </div>  <!-- On click make the value the active entry on the reference. Set the wiki as active.-->
            <div class='input-description'>The number of astronaut explorers to live in your habitat.</div>
            <input class='input-field-number' type="number" pattern="^\d+$" placeholder="Quantity" v-on:input="setInhabitants" v-model="humans.amount">
        </label>
        <label class='input-wrapper'>
            <div class='input-title'>
                Food Supply
                <fa-icon :icon="['fas','info-circle']" @click="SETACTIVEREFENTRY('Food')" />
            </div>
            <div class='input-description'>Make certain you have ample food for an ECLSS only mission, or until the plants are ready to harvest. Humans consume 2.4kg food per day.</div>
            <input class='input-field-number' type="number" pattern="^\d+$" placeholder="Qty (kg)" v-on:input="setInhabitants" v-model="food.amount">
        </label>
        <label class='input-wrapper'>
            <div class='input-title'>
                Crew Quarters
                <fa-icon :icon="['fas','info-circle']" @click="SETACTIVEREFENTRY('CrewQuarters')" />
            </div>
            <div class='input-description'>Select the size of your crew quarters: small, medium, or large.</div>
            <select class='input-field-select' v-on:change="setInhabitants" v-model="crewQuarters.type">
                <option value="none" selected>None</option>
                <option value="crew_habitat_small">Small 1000 m³</option>
                <option value="crew_habitat_medium">Medium 2260 m³</option>
                <option value="crew_habitat_large">Large 4020 m³</option>
            </select >
        </label>
        <label class='input-wrapper'>
            <div class='input-title'>
                Life Support
                <fa-icon :icon="['fas','info-circle']" @click="SETACTIVEREFENTRY('ECLSS')" />
            </div>
            <div class='input-description'>As with the International Space Station, the Environmental Control &amp; Life Support System (ECLSS) cleans your air and water.</div>
            <input class='input-field-number' type="number" pattern="^\d+$" placeholder="Quantity" v-on:input="setInhabitants" v-model="eclss.amount">
        </label>
    </form>
</template>

<script>
import {mapState,mapGetters,mapMutations} from 'vuex'
import {ensure_within} from '../../javascript/utils'
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
      //Get the values from the configuration that is initially set
        const {humans,food,crewQuarters,eclss} = this.getConfiguration
        this.humans = humans
        this.food = food
        this.crewQuarters = crewQuarters
        this.eclss = eclss
    },
    computed:{
        ...mapGetters('wizard',['getConfiguration']),
    },
    methods:{
        ...mapMutations('wizard',['SETINHABITANTS']),
        ...mapMutations('wizard',['SETACTIVEREFENTRY']),


        //Sets all related values for the inhabitants form into the wizard store. If any of the fields update them all.
        setInhabitants:function(){
            this.humans.amount = ensure_within(this.humans.amount, 0, 20)
            this.food.amount = ensure_within(this.food.amount, 0, 17500)
            this.eclss.amount = ensure_within(this.eclss.amount, 0, 10)
            const value = {'humans': this.humans, 'food': this.food,
                           'crewQuarters': this.crewQuarters, 'eclss': this.eclss}
            this.SETINHABITANTS(value)
        }
    },
    watch:{
        //If any part of the configuration has changed, update the values this form uses too. This is useful for watching when
        // a preset changes all values within the configuration object within wizard store.
        getConfiguration:{
            handler:function(){
                this.crewQuarters.amount = this.crewQuarters.type === "none" ? 0 : 1

                const {humans,food,crewQuarters,eclss} = this.getConfiguration
                this.humans = humans
                this.food = food
                this.crewQuarters = crewQuarters
                this.eclss = eclss
            },
            deep:true //Must be used if the watched value is an object.
        }
    }

}
</script>

<style lang="scss" scoped>
    @import '../../sass/components/configuration-input';
</style>
