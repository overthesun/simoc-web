<template>
    <div>
        <label class='input-wrapper'>
            <div class='input-title' @click="SETACTIVEREFENTRY('Greenhouse')">
                Greenhouse <fa-icon :icon="['fas','info-circle']" />
            </div> <!-- On click make the value the active entry on the reference. Set the wiki as active.-->

            <div class='input-description'>Select the size of your greenouse. See <a class='reference-link' href="#" @click="SETACTIVEREFERENCE('Graphs')">graph at right</a>.</div>
            <select class='input-field-select' ref='greenhouse_type' required v-model="greenhouse.type" v-on:change="setGreenhouse">
                <option value='none' selected>None</option>
                <option value='greenhouse_small'>Small (490 m³)</option>
                <option value='greenhouse_medium'>Medium (2452 m³)</option>
                <option value='greenhouse_large'>Large (5610 m³)</option>
                <option value='greenhouse_sam'>SAM (367 m³)</option>
            </select>
        </label>
        <label class='input-wrapper'>
            <div class='input-title' @click="SETACTIVEREFENTRY('PlantSpecies')">
                Plant Species <fa-icon :icon="['fas','info-circle']" />
            </div>

            <div class='input-description'>Select plants to grow in your greenhouse. See <a class='reference-link' href="#" @click="SETACTIVEREFERENCE('Graphs')">graph at right</a>.</div>
            <!-- This is the row object for each plant entry within the wizard.
                  v-for automatically rebuilds the fields if one is added or deleted.
                  Index is used as a key to store which plant field has been updated within the configuration
            -->
            <div class='input-plant-wrapper' v-for="(item,index) in plantSpecies" :key=index>
                <select class='input-field-select' ref="plant_selects" v-model="plantSpecies[index].type" v-on:change="updatePlantSpecies(index)">
                    <option value="" selected hidden disabled>Species</option>
                    <!-- create options for each plant species within plantValue. Formats them before displaying the.
                         As the plantValue is used for the actual value of the field for the configuration call.
                         Unique plant names function would normally be called here to retrieve the unique names not already used.
                    -->
                    <option :value="name" v-for="(name,k) in plantValue" :key=k >{{plantFormatted[k]}}</option>
                </select>
                <label><input class='input-field-number' ref="plant_inputs" type="number" min="0" :max="plantMax[index]" pattern="^\d+$"
                              placeholder="Quantity" v-on:input="updatePlantSpecies(index)" v-model="plantSpecies[index].amount"> m³</label>
                <fa-layers class="fa-2x plant-row-icon icon-add" @click="addPlantSpecies">
                    <fa-icon :icon="['fas','plus-circle']" />
                </fa-layers>
                <fa-layers class="fa-2x plant-row-icon icon-trash" @click="REMOVEPLANTSPECIES(index)">
                    <!-- Deletes the object at the specicied key within the wizard store. -->
                    <fa-icon :icon="['fas','trash']" mask="circle" transform="shrink-7"/>
                </fa-layers>
            </div>
        </label>
    </div>
</template>

<script>
import axios from 'axios'
import {mapState,mapGetters,mapMutations} from 'vuex'

export default {
    data(){
        return{
            //Initialize the localized variables used for v-model
            greenhouse:undefined,
            plantSpecies:undefined,
            plantValue:[],
            plantFormatted:[],
            plantMax:[],  // the max m2 for each plant species to fit in the greenhouse
        }
    },
    beforeMount(){
        const{plantSpecies,greenhouse} = this.getConfiguration //Get the values from the configuration that is initially set

        //If there isn't a plant present object in the configuration add at least one.
        //This forces the above v-for to populate with at the very least one plant row.
        //This is done this way to prevent from having to duplicate the above HTML for the plants section for the single starting plant.
        if(plantSpecies.length <= 0){
            this.ADDPLANTSPECIES()
        }

        this.greenhouse = greenhouse
        this.plantSpecies = plantSpecies

        this.retrievePlantSpecies() //See below. This is used to add all options for the plant names to the selection field.
    },
    computed:{
        ...mapGetters('wizard', ['getConfiguration','getValidValues']),  // Gets the configuration from the store
    },
    methods:{
        ...mapMutations('wizard', ['SETGREENHOUSE','ADDPLANTSPECIES','UPDATEPLANTSPECIES','REMOVEPLANTSPECIES']),
        ...mapMutations('wizard', ['SETACTIVEREFENTRY','SETACTIVEREFERENCE']),

        //This method creates a new plant object within the wizard store. It also makes sure that the user
        // can't add more fields than there are options for plants.
        addPlantSpecies:function(){
            let {plantSpecies} = this.getConfiguration
            const arrLength = plantSpecies.length
            const maxLength = this.plantValue.length

            if(arrLength < maxLength){
                this.ADDPLANTSPECIES()
            }
        },

        //This method is used to update a plant at the specified index, updates the plant species and amount.
        //The index is passed in from the above v-for index key when the fields are created.
        //Indexes are repopulated on deletion of any row. Row 3 becomes 2 if row 2 is deleted. This is done
        //automatically by Vue
        updatePlantSpecies:function(index){
            let plant = this.plantSpecies[index]
            this.UPDATEPLANTSPECIES({'index': index, 'plant': plant})
        },

        //Set the greenhouse type within the wizard store. It also sets the default number of greenhouses to one
        //if any type other than 'none' is selected. Plants are not included as they do their own thing differently than other form elemetns.
        setGreenhouse:function(){
            this.greenhouse.amount = this.greenhouse.type == "none" ? 0 : 1
            const value = {'greenhouse':this.greenhouse}
            this.SETGREENHOUSE(value)
        },

        /*
        //Unused method for gathering unique plant names for a particular field.
        uniquePlantNames:function(index){
            const {plantSpecies} = this.getConfiguration
            //const indexType = plantSpecies[index].type

            let selectedValues = plantSpecies.splice(index,1)
            return false;
        },

        //This method should have returned a list of all plant values not currently selected within the fields.
        //It was to also add back on the actual selected value for the selection field, so that it was not excluded too.
        /*uniquePlantNames:function(index){
            let {plantSpecies} = this.getConfiguration
            let currentOption = plantSpecies[index].type
            let plantTypes = []
            let plantNames = []
            plantSpecies.forEach((item) =>{
                plantTypes.push(item.type)
            })

            console.log(plantTypes)


            let selectedOptions = currentOption != null ? plantTypes.filter(x => !currentOption.includes(x)) : plantTypes
            let uniqueOptions = this.plantNames.filter(x => !selectedOptions.includes(x))

            return uniqueOptions
        },*/

        //Format the plant names so that the first letter is capitalized and remove any underscores or dashes and replace them with spaces.
        formatPlantName:function(name){
            let formatted = ""

            formatted = name.replace(/_/g," ")
            formatted = formatted.toLowerCase()
                    .split(" ")
                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(" ")

            this.plantFormatted.push(formatted)
        },

        //Call the '/get_agent_types' route to retrieve all agents with the class of plants.
        //This is used to populate the selection field for the plant species. Stored within the plantValue array on
        //OK code.

        //this method should also be switch over to the try/catch block of similar route calls. Simply to reduce the callback hell look.
        retrievePlantSpecies:function(){
            axios.defaults.withCredentials = true

            const params = {agent_class: 'plants'}

            axios.get('/get_agent_types', {params: params}).then(response => {
                if(response.status === 200){
                    response.data.forEach((item) =>{
                        let {name} = item
                        this.plantValue.push(name)
                        //console.log(this.formatPlantName(name))
                        this.formatPlantName(name)

                    })
                }
            }).catch(error=>{
                const {status} = error.response
                if(status == 401){
                    console.log("Plant retrieval error")
                }
            })
        },
        updateAndValidate: function() {
            // validate and update greenhouse type
            const greenhouse = this.getConfiguration.greenhouse
            const greenhouse_is_valid = this.getValidValues.greenhouse_types.includes(greenhouse.type)
            this.$refs.greenhouse_type.setCustomValidity(greenhouse_is_valid?'':'Please select a valid greenhouse type.')
            this.$refs.greenhouse_type.reportValidity()
            this.greenhouse = greenhouse

            // validate and update plants
            const plantSpecies = this.getConfiguration.plantSpecies
            // TODO: this is duplicated in a number of places
            const greenhouse_size = {
                'none': 0,
                'greenhouse_small': 490,
                'greenhouse_medium': 2454,
                'greenhouse_large': 5610,
                'greenhouse_sam': 367,
            }[this.greenhouse.type]
            // make sure that the amount doesn't overflow the greenhouse_size:
            // calculate the available space by subtracting the amount of the
            // previous plants from the greenhouse size and using that as max
            let max_amount = greenhouse_size
            plantSpecies.forEach((plant, i) => {
                this.plantMax[i] = Math.max(0, max_amount)
                max_amount -= plant.amount
            })

            this.$nextTick(function() {
                // when a new plant is added this watcher is called before creating the ref
                // on the select, so we need to wait the next tick to access its plant_selects
                plantSpecies.forEach((plant, i) => {
                    // check that the plant type is '' or one from the list of valid plants
                    const plant_type_is_valid = (plant.type === '' || this.plantValue.includes(plant.type))
                    this.$refs.plant_selects[i].setCustomValidity(plant_type_is_valid?'':'Please select a valid plant type.')
                    if (!plant_type_is_valid) {
                        this.$refs.plant_selects[i].reportValidity()
                        return  // if the plant is invalid don't even bother checking the rest
                    }
                    // if the plant quantity is > 0, the plant type must be specified
                    const plant_type_is_invalid = (plant.type === '' && plant.amount > 0)
                    this.$refs.plant_inputs[i].setCustomValidity(plant_type_is_invalid?'Please select a valid plant type.':'')
                    if (plant_type_is_invalid) {
                        this.$refs.plant_inputs[i].reportValidity()
                        return  // wait for the user to select a valid type before complaining about the value
                    }
                    // we got a valid type, check that the greenhouse is selected if the amount is >0
                    const needs_greenhouse = (plant.amount > 0 && greenhouse.type === 'none')
                    this.$refs.plant_inputs[i].setCustomValidity(needs_greenhouse?'Please select a greenhouse type.':'')
                    if (needs_greenhouse) {
                        this.$refs.plant_inputs[i].reportValidity()
                        return  // wait for the user to select a valid type before complaining about the value
                    }
                    // when we have valid greenhouse type, plant type, and an amount > 0, check if it fits in the greenhouse
                    const msg = (max_amount < 0)?`The total amount (${-max_amount+greenhouse_size} m³) exceeds the greenhouse size (${greenhouse_size} m³) by ${-max_amount} m³.`:''
                    this.$refs.plant_inputs[i].setCustomValidity(msg)
                    this.$refs.plant_inputs[i].reportValidity()
                })
            })
            this.plantSpecies = plantSpecies
        },
    },
    watch:{
        'getConfiguration.greenhouse.type': function() {
            this.updateAndValidate()
        },
        'getConfiguration.plantSpecies':{
            handler:function() {
                this.updateAndValidate()
            },
            deep: true,
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '../../sass/components/configuration-input';

    .input-plant-wrapper{
        display:flex;
        justify-content:flex-start;
        align-items:center;
    }

    .input-field-select{
        margin-right:24px;
    }

    .plant-row-icon{
        &:first-of-type{
            margin-left:auto;
        }

        margin-right:24px;
    }
</style>
