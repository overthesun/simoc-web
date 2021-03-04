<!-- This particular component has one job and that is to populate and create the PRESETS field at the top of the finalization screen. This would also be at the
top of the custom (finalized screen only) configuration screen too. Selecting one of these will trigger the getConfiguration watcher in all configuration form components.

Presets should really be stored within the database and retrieved similar to that of the plant names.

Future version would also retrieve any saved configurations the user has saved either in cookies or under a user profile.

Future version should also automatically switch the selected preset to 'custom' if the current configuration doesn't match all field values within each configuration
-->

<template>
    <form class='form-wrapper form-presets' @submit.prevent="">
        <label class='input-wrapper'>
            <div class='input-title' @click="SETACTIVEREFENTRY('Presets')">
                Presets <fa-icon :icon="['fas','info-circle']" />
            </div>
            <div class='input-description'>Employ preset configurations to learn from basic agent interactions. Some succeed. Some fail.</div>
            <div>
                <div class='presets-dropdown'>
                    <select class='input-field-select' v-model="selected" v-on:change="updateConfig(selected)">
                        <option :value=EMPTY hidden disabled selected>Preset</option>
                        <option :value=name v-for="(preset, name) in presets" :key=name>{{presets_names[name]}}</option>
                        <option :value=CUSTOM>[Custom]</option>
                    </select>
                </div>
                <div v-if="selected == CUSTOM" class="custom-preset">
                    <button @click="saveToLocalStorage">Save</button>
                    <button @click="loadFromLocalStorage(true)">Reset</button>
                </div>
            </div>
        </label>
    </form>
</template>

<script>
import {mapState,mapGetters,mapMutations} from 'vuex'
// global constants used to mark the empty and custom presets
const EMPTY = 'empty'
const CUSTOM = 'custom'
export default {
    data() {
        return {
            // copied constants to access them in html template
            EMPTY: EMPTY,
            CUSTOM: CUSTOM,
            selected: EMPTY,   // the selected preset name is saved here
            none: EMPTY,  // initial empty preset
            custom: CUSTOM,  // custom preset, loaded from localstorage
            dont_set_custom: false,  // when true, avoids setting the custom preset
            // the names of the presets, used for the dropdown
            presets_names: {
                one_human: '1 Human',
                one_human_radish: '1 Human + Radish',
                four_humans: '4 Humans',
                four_humans_garden: '4 Humans + Garden',
            },
            // the available default presets
            presets: {
                one_human: {
                    location: 'mars',
                    duration: {type:'none', amount:10, units:'day'},
                    humans: {type:'human_agent', amount:1, units:''},
                    food: {type:'food_storage', amount:100, units:'kg'},
                    crewQuarters: {type:'crew_habitat_small', amount: 1, units:''},
                    eclss: {type:'eclss', amount:1, units:''},
                    powerGeneration: {type:'solar_pv_array_mars', amount:30, units:''},
                    powerStorage: {type:'power_storage', amount:1000, units:''},
                    greenhouse: {type:'none', amount:0, units:''},
                    plantSpecies: [{type:'', amount:''}]
                },
                one_human_radish: {
                    location: 'mars',
                    duration: {type:'none', amount:30, units:'day'},
                    humans: {type:'human_agent', amount:1, units:''},
                    food: {type:'food_storage', amount:100, units:'kg'},
                    crewQuarters: {type:'crew_habitat_small', amount:1, units:''},
                    eclss: {type:'eclss', amount:1, units:''},
                    powerGeneration: {type:'solar_pv_array_mars', amount:70, units:''},
                    powerStorage: {type:'power_storage', amount:1000, units:''},
                    greenhouse: {type:'greenhouse_small', amount:1, units:''},
                    plantSpecies: [{type:'radish', amount:40}],
                },
                four_humans: {
                    location:'mars',
                    duration: {type:'none', amount:10, units:'day'},
                    humans: {type:'human_agent', amount:4, units:''},
                    food: {type:'food_storage', amount:100, units:'kg'},
                    crewQuarters: {type:'crew_habitat_small', amount:1, units:''},
                    eclss: {type:'eclss', amount:1, units:''},
                    powerGeneration: {type:'solar_pv_array_mars', amount:30, units:''},
                    powerStorage: {type:'power_storage', amount:1000, units:''},
                    greenhouse: {type:'none', amount:0, units:''},
                    plantSpecies: [{type:'', amount:''}]
                },
                four_humans_garden: {
                    location: 'mars',
                    duration: {type:'none', amount:100, units:'day'},
                    humans: {type:'human_agent', amount:4, units:''},
                    food: {type:'food_storage', amount:1200, units:'kg'},
                    crewQuarters: {type:'crew_habitat_medium', amount:1, units:''},
                    eclss: {type:'eclss', amount:1, units:''},
                    powerGeneration: {type:'solar_pv_array_mars', amount:400, units:''},
                    powerStorage: {type:'power_storage', amount:2000, units:''},
                    greenhouse: {type:'greenhouse_small', amount:1, units:''},
                    plantSpecies: [
                        {type:'wheat', amount:20},
                        {type:'cabbage', amount:30},
                        {type:'strawberry', amount:10},
                        {type:'radish', amount:50},
                        {type:'red_beet', amount:50},
                        {type:'onion', amount:50},
                    ],
                },
                // these are disabled for now
                /*
                wheat: {
                    location: 'mars',
                    duration: {type:'none', amount:100, units:'day'},
                    humans: {type:'human_agent', amount:2, units:''},
                    food: {type:'food_storage', amount:300, units:'kg'},
                    crewQuarters: {type:'crew_habitat_small', amount:1, units:''},
                    eclss: {type:'eclss', amount:0, units:''},
                    powerGeneration: {type:'solar_pv_array_mars', amount:380, units:''},
                    powerStorage: {type:'power_storage', amount:1000, units:''},
                    greenhouse: {type:'greenhouse_small', amount:1, units:''},
                    plantSpecies: [{type:'wheat', amount:100}],
                },
                humansonly: {
                    location: 'mars',
                    duration: {type:'none', amount:30, units:'day'},
                    humans: {type:'human_agent', amount:2, units:''},
                    food: {type:'food_storage', amount:10000, units:'kg'},
                    crewQuarters: {type:'crew_habitat_small', amount:0, units:''},
                    eclss: {type:'eclss', amount:1, units:''},
                    powerGeneration: {type:'solar_pv_array_mars', amount:2, units:''},
                    powerStorage: {type:'power_storage', amount:1000, units:''},
                    greenhouse: {type:'none', amount:0, units:''},
                    plantSpecies: [{type:'',  amount:''}],
                },
                hybridthree: {
                    location: 'mars',
                    duration: {type:'none', amount:90, units:'day'},
                    humans: {type:'human_agent', amount:2, units:''},
                    food: {type:'food_storage', amount:10000, units:'kg'},
                    crewQuarters: {type:'crew_habitat_small', amount:1, units:''},
                    eclss: {type:'eclss', amount:0, units:''},
                    powerGeneration: {type:'solar_pv_array_mars', amount:20, units:''},
                    powerStorage: {type:'power_storage', amount:1000, units:''},
                    greenhouse: {type:'greenhouse_small', amount:1, units:''},
                    plantSpecies: [{type:'wheat', amount:100}],
                },*/
            },
        }
    },
    computed:{
        ...mapGetters('wizard', ['getConfiguration','getResetConfig']),
    },
    methods:{
        ...mapMutations('wizard', ['SETCONFIGURATION','SETACTIVEREFENTRY',
                                   'SETRESETCONFIG','RESETCONFIG']),

        updateConfig: function (name) {
            // don't set [custom] if the user picks a preset
            this.dont_set_custom = true
            if (name === CUSTOM) {
                this.loadFromLocalStorage()
            }
            else {
                this.SETCONFIGURATION(this.presets[name])
            }
        },
        saveToLocalStorage: function () {
            // save custom preset to local storage
            if (confirm('Save the current configuration as a custom preset?')) {
                try {
                    const config = JSON.stringify(this.getConfiguration)
                    localStorage.setItem('custom-config', config)
                }
                catch (error) {
                    alert('An error occurred while saving the configuration: ' + error)
                    return
                }
                alert('Custom preset saved.')
            }
        },
        loadFromLocalStorage: function (ask_confirm) {
            // this is called either when the user selects "[Custom]" or
            // when the user presses reset and it will load the custom
            // preset from the local storage if available
            if (ask_confirm && !confirm('Reset changes and reload the custom preset?')) {
                return
            }
            const config = localStorage.getItem('custom-config')
            if (config) {
                this.SETCONFIGURATION(JSON.parse(config))
            }
            else {
                alert('No Custom preset found. Use the Save button to save one.')
            }
        },
    },
    watch: {
        getResetConfig: function() {
            // someone changed the resetconfig var, so we have to reset the form
            if (!this.getResetConfig) {
                return  // only reset it when it's true
            }
            // avoid changing the selected preset to custom
            this.dont_set_custom = true
            // reset the config to the empty preset
            this.selected = EMPTY
            this.RESETCONFIG()
            // restore the var to false
            this.SETRESETCONFIG(false)
        },
        getConfiguration: {
            handler: function() {
                // Triggered when the configuration changed.
                // This happens either when the user selected a new preset
                // or when they edited a field.  If they selected a preset
                // dont_set_custom should be true, so that "custom" won't be
                // selected, otherwise it will when they edit a single field
                if (this.dont_set_custom || this.selected == CUSTOM) {
                    this.dont_set_custom = false
                    return
                }
                this.selected = CUSTOM
            },
            deep: true,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../../sass/components/configuration-input';

.presets-dropdown,
.custom-preset {
    display: inline;
}
</style>
