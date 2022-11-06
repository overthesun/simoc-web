<template>
    <div>
        <label class="input-wrapper">
            <div class="input-title" @click="setActiveRefEntry('Greenhouse')">
                Greenhouse <fa-icon :icon="['fa-solid','circle-info']" />
            </div> <!-- On click make the value the active entry on the reference. Set the wiki as active.-->

            <div class="input-description">Select the size of your greenouse. See <a class="reference-link" href="#" @click="activeReference = 'Graphs'">graph at right</a>.</div>
            <select ref="greenhouse_type" v-model="greenhouse.type"
                    class="input-field-select" required @change="setGreenhouseHandler">
                <option value="none" selected>None</option>
                <option value="greenhouse_small">Small (490 m³)</option>
                <option value="greenhouse_medium">Medium (2452 m³)</option>
                <option value="greenhouse_large">Large (5610 m³)</option>
                <option value="greenhouse_sam">SAM (494 m³)</option>
            </select>
        </label>
        <label class="input-wrapper">
            <div class="input-title" @click="setActiveRefEntry('PlantSpecies')">
                Plant Species <fa-icon :icon="['fa-solid','circle-info']" />
            </div>

            <div class="input-description">Select plants to grow in your greenhouse. See <a class="reference-link" href="#" @click="activeReference = 'Graphs'">graph at right</a>.</div>
            <!-- This is the row object for each plant entry within the wizard.
                  v-for automatically rebuilds the fields if one is added or deleted.
                  Index is used as a key to store which plant field has been updated within the configuration
            -->
            <div v-for="(item,index) in plantSpecies" :key="index" class="input-plant-wrapper">
                <select :ref="el => setSelectRef(el, index)" v-model="plantSpecies[index].type"
                        class="input-field-select" @change="updatePlantSpeciesHandler(index)">
                    <option value="" selected hidden disabled>Species</option>
                    <option v-for="(name,k) in plantValue" :key="k" :value="name">{{plantFormatted[k]}}</option>
                </select>
                <label><input :ref="el => setInputRef(el, index)" v-model.number="plantSpecies[index].amount"
                              :min="0" :max="plantMax[index]"
                              class="input-field-number" type="number" pattern="^\d+$"
                              placeholder="Quantity" @input="updatePlantSpeciesHandler(index)"> m³</label>
                <fa-layers class="fa-2x plant-row-icon icon-add" @click="addPlantSpeciesHandler">
                    <fa-icon :icon="['fa-solid','circle-plus']" />
                </fa-layers>
                <fa-layers class="fa-2x plant-row-icon icon-trash" @click="removePlantSpecies(index)">
                    <!-- Deletes the object at the specicied key within the wizard store. -->
                    <fa-icon :icon="['fa-solid','trash']" mask="circle" transform="shrink-7" />
                </fa-layers>
            </div>
        </label>
    </div>
</template>

<script>
import axios from 'axios'
import {storeToRefs} from 'pinia'
import {useWizardStore} from '../../store/modules/WizardStore'

export default {
    setup() {
        const wizard = useWizardStore()
        const {configuration, validValues, activeReference} = storeToRefs(wizard)
        const {
            setGreenhouse, addPlantSpecies, updatePlantSpecies, removePlantSpecies,
            setActiveRefEntry,
        } = wizard
        return {
            configuration, validValues, setGreenhouse, addPlantSpecies, updatePlantSpecies,
            removePlantSpecies, setActiveRefEntry, activeReference,
        }
    },
    data() {
        return {
            // Initialize the localized variables used for v-model
            greenhouse: undefined,
            plantSpecies: undefined,
            plantValue: [],
            plantFormatted: [],
            plantMax: [],  // the max m2 for each plant species to fit in the greenhouse
            plant_selects: {},  // map index -> <select> for the plant type dropdown
            plant_inputs: {},  // map index -> <input> for the plant amount
        }
    },

    watch: {
        'configuration.greenhouse.type': function() {
            this.updateAndValidate()
        },
        'configuration.plantSpecies': {
            handler() {
                this.updateAndValidate()
            },
            deep: true,
        },
    },
    beforeMount() {
        // Get the values from the configuration that is initially set
        const {plantSpecies, greenhouse} = this.configuration

        // If there isn't a plant present object in the configuration add at least one.
        // This forces the above v-for to populate with at the very least one plant row.
        // This is done this way to prevent from having to duplicate the above HTML
        // for the plants section for the single starting plant.
        if (plantSpecies.length <= 0) {
            this.addPlantSpecies()
        }

        this.greenhouse = greenhouse
        this.plantSpecies = plantSpecies

        // See below. This is used to add all options for the plant names to the selection field.
        this.retrievePlantSpecies()
    },
    methods: {
        // These two methods update the objects that maps the plant index with
        // the corresponding select/input.  Note that if the plant is removed
        // it might still be in the object, but won't be picked up by
        // updateAndValidate since it only looks for existing indices --
        // see https://v3.vuejs.org/guide/migration/array-refs.html
        setSelectRef(select, index) {
            this.plant_selects[index] = select
        },
        setInputRef(input, index) {
            this.plant_inputs[index] = input
        },

        // This method creates a new plant object within the wizard store.
        // It also makes sure that the user can't add more fields than there are options for plants.
        addPlantSpeciesHandler() {
            const {plantSpecies} = this.configuration
            const arrLength = plantSpecies.length
            const maxLength = this.plantValue.length

            if (arrLength < maxLength) {
                this.addPlantSpecies()
            }
        },

        // Update a plant at the specified index and its amount.
        // The index is passed in from the above v-for index key when the fields are created.
        // Indexes are repopulated on deletion of any row. Row 3 becomes 2 if row 2 is deleted.
        // This is done automatically by Vue
        updatePlantSpeciesHandler(index) {
            const plant = this.plantSpecies[index]
            this.updatePlantSpecies({index, plant})
        },

        // Set the greenhouse type within the wizard store. It also sets the default number of
        // greenhouses to one if any type other than 'none' is selected. Plants are not included
        // as they do their own thing differently than other form elements.
        setGreenhouseHandler() {
            this.greenhouse.amount = this.greenhouse.type === 'none' ? 0 : 1
            const value = {greenhouse: this.greenhouse}
            this.setGreenhouse(value)
        },

        /*
        //Unused method for gathering unique plant names for a particular field.
        uniquePlantNames:function(index){
            const {plantSpecies} = this.configuration
            //const indexType = plantSpecies[index].type

            let selectedValues = plantSpecies.splice(index,1)
            return false;
        },

        // This method should have returned a list of all plant values
        // not currently selected within the fields.
        // It was to also add back on the actual selected value for the selection field,
        // so that it was not excluded too.
        /*uniquePlantNames:function(index){
            let {plantSpecies} = this.configuration
            let currentOption = plantSpecies[index].type
            let plantTypes = []
            let plantNames = []
            plantSpecies.forEach((item) =>{
                plantTypes.push(item.type)
            })

            console.log(plantTypes)

            let selectedOptions = plantTypes
            if (currentOption !== null) {
                let selectedOptions = plantTypes.filter(x => !currentOption.includes(x))
            }
            let uniqueOptions = this.plantNames.filter(x => !selectedOptions.includes(x))

            return uniqueOptions
        },*/

        // Format the plant names so that the first letter is capitalized and
        // remove any underscores or dashes and replace them with spaces.
        // TODO: use the function in javascript/utils.js
        formatPlantName(name) {
            let formatted = ''

            formatted = name.replace(/_/g, ' ')
            formatted = formatted.toLowerCase()
                    .split(' ')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ')

            this.plantFormatted.push(formatted)
        },

        // Call the '/get_agent_types' route to retrieve all agents with the class of plants.
        // This is used to populate the selection field for the plant species.
        // Stored within the plantValue array on OK code.

        // this method should also be switch over to the try/catch block
        // of similar route calls. Simply to reduce the callback hell look.
        retrievePlantSpecies() {
            axios.defaults.withCredentials = true

            const params = {agent_class: 'plants'}

            axios.get('/get_agent_types', {params}).then(response => {
                if (response.status === 200) {
                    response.data.forEach(item => {
                        const {name} = item
                        this.plantValue.push(name)
                        // console.log(this.formatPlantName(name))
                        this.formatPlantName(name)
                    })
                }
            }).catch(error => {
                const {status} = error.response
                if (status === 401) {
                    console.log('Plant retrieval error')
                }
            })
        },
        updateAndValidate() {
            // validate and update greenhouse type
            const {greenhouse} = this.configuration
            const gh_is_valid = this.validValues.greenhouse_types.includes(greenhouse.type)
            this.$refs.greenhouse_type.setCustomValidity(
                gh_is_valid ? '' : 'Please select a valid greenhouse type.'
            )
            this.$refs.greenhouse_type.reportValidity()
            this.greenhouse = greenhouse

            // validate and update plants
            const {plantSpecies} = this.configuration
            // TODO: this is duplicated in a number of places
            const greenhouse_size = {
                none: 0,
                greenhouse_small: 490,
                greenhouse_medium: 2454,
                greenhouse_large: 5610,
                greenhouse_sam: 494,
            }[this.greenhouse.type]
            // calculate the used and free space, then set the max space that can
            // be used by each plant in order not to overflow the greenhouse size
            const used_space = plantSpecies.reduce(
                ((tot, p) => (p.amount ? tot+p.amount : tot)),  // don't add empty strings/null/NaN
                0  // start from 0 to avoid empty strings at the beginning
            )
            const free_space = greenhouse_size - used_space
            // calculate the max value for each plant, keeping in mind that the free space
            // might be negative if the user entered an invalid value -- in that case
            // constrain the max between the original amount and the greenhouse size
            plantSpecies.forEach((plant, i) => {
                this.plantMax[i] = Math.min(
                    (free_space+plant.amount < 0) ? plant.amount : free_space+plant.amount,
                    greenhouse_size
                )
            })

            // when a new plant is added this method is called before creating the ref
            // on the select, so we need to wait the next tick to access its plant_select
            this.$nextTick(() => {
                // validate plant types and amounts
                plantSpecies.some((plant, i) => {
                    // return true to report the error immediately and stop and
                    // false to keep checking (only the last error will be reported)
                    const plant_type = this.plant_selects[i]
                    const plant_amount = this.plant_inputs[i]
                    // check if the plant is set but not in the list, or has an amount but no type
                    const plant_type_is_invalid = (
                        (plant.type && !this.plantValue.includes(plant.type)) ||
                        (!plant.type && plant.amount > 0)
                    )
                    plant_type.setCustomValidity(
                        plant_type_is_invalid ? 'Please select a valid plant type.' : ''
                    )
                    if (plant_type_is_invalid) {
                        plant_type.reportValidity()
                        return true
                    }
                    // we got a valid type, check that the gh is selected if the amount is >0
                    const needs_greenhouse = (plant.amount > 0 && greenhouse.type === 'none')
                    plant_amount.setCustomValidity(
                        needs_greenhouse ? 'Please select a greenhouse type first.' : ''
                    )
                    if (needs_greenhouse) {
                        plant_amount.reportValidity()
                        return true
                    }
                    // check if the plant amount is valid (e.g. the min/max value)
                    if (!plant_amount.checkValidity()) {
                        plant_amount.reportValidity()
                        return true
                    }
                    // when we have valid greenhouse type, plant type, and a valid amount,
                    // check if it fits in the greenhouse
                    let msg = ''
                    if (free_space < 0) {
                        msg = (`The total amount (${used_space} m³) exceeds ` +
                               `the greenhouse size (${greenhouse_size} m³) by ${-free_space} m³.`)
                    }
                    plant_amount.setCustomValidity(msg)
                    plant_amount.reportValidity()
                    // this error has lower priority than the ones that effect the individual
                    // fields, so keep checking the other fields first -- if everything else
                    // looks ok, this error will be reported last on the last field
                    return false
                })
            })
            this.plantSpecies = plantSpecies
        },
    },
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
