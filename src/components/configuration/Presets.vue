<!-- This particular component has one job and that is to populate and create the PRESETS field at the top of the finalization screen. This would also be at the
top of the custom (finalized screen only) configuration screen too. Selecting one of these will trigger the getConfiguration watcher in all configuration form components.

Presets should really be stored within the database and retrieved similar to that of the plant names.

Future version would also retrieve any saved configurations the user has saved either in cookies or under a user profile.

Future version should also automatically switch the selected preset to 'custom' if the current configuration doesn't match all field values within each configuration
-->

<template>
    <form class='form-wrapper' @submit.prevent="">
        <label class='input-wrapper'>
            <div class='input-title'>
                Presets
                <fa-icon :icon="['fas','info-circle']" @click="SETACTIVEREFENTRY('Presets')" />
            </div>
            <div class='input-description'>Employ preset configurations to learn from basic agent interactions. Some succeed. Some fail.</div>
            <div>
                <div class='presets-dropdown'>
                    <select class='input-field-select' v-model="presets" v-on:change="SETCONFIGURATION(presets)">
                        <option :value=none hidden disabled selected>Preset</option>
                        <option :value=one_human>One Human</option>
                        <option :value=ten_humans>Ten Humans</option>
                        <!--
                        <option :value=humansonly>Humans Only</option>
                        <option :value=hybridone>Hybrid One</option>
                        <option :value=hybridtwo>Hybrid Two</option>
                        <option :value=hybridthree>Hybrid Three</option>
                        <option :value=hybridfour>Hybrid Four</option>
                        -->

                    </select>
                </div>
                <div class="custom-preset">
                    Custom Preset: <button @click="saveToLocalStorage">Save</button><button @click="loadFromLocalStorage">Load</button>
                </div>
            </div>
        </label>
    </form>
</template>

<script>
import {mapState,mapGetters,mapMutations} from 'vuex'
export default {
    data(){
        return{
            // the selected preset is saved here
            presets:{
                location:"none",
                duration:{type:"none",amount:'0',units:"none"},
                humans:{type:"human_agent",amount:'0',units:""},
                food:{type:"food_storage",amount:'0',units:""},
                crewQuarters:{type:"none",amount:'0',units:""},
                eclss:{type:"eclss",amount:'0',units:""},
                powerGeneration:{type:"solar_pv_array_mars",amount:'0',units:""},
                powerStorage:{type:"power_storage",amount:'0',units:""},
                greenhouse:{type:"none",amount:'0',units:""},
                plantSpecies:[{type:"", amount:""}],
            },
            // these are the default presets, none is the initial one
            none:{
                location:"none",
                duration:{type:"none",amount:'0',units:"none"},
                humans:{type:"human_agent",amount:'0',units:""},
                food:{type:"food_storage",amount:'0',units:""},
                crewQuarters:{type:"none",amount:'0',units:""},
                eclss:{type:"eclss",amount:'0',units:""},
                powerGeneration:{type:"solar_pv_array_mars",amount:'0',units:""},
                powerStorage:{type:"power_storage",amount:'0',units:""},
                greenhouse:{type:"none",amount:'0',units:""},
                plantSpecies:[{type:"", amount:""}],
            },
            one_human: {
                location: 'mars',
                duration: {type: 'none', amount: '10', units: 'day'},
                humans: {type: 'human_agent', amount: '1', units: ''},
                food: {type: 'food_storage', amount: '100', units: ''},
                crewQuarters: {type: 'crew_habitat_small', amount: 1, units: ''},
                eclss: {type: 'eclss', amount: '1', units: ''},
                powerGeneration: {type: 'solar_pv_array_mars', amount: '30',
                units: ''},
                powerStorage: {type: 'power_storage', amount: '1000', units: ''},
                greenhouse: {type: 'none', amount: '0', units: ''},
                plantSpecies: [{type:"", amount:""}]
            },
            ten_humans: {
                location: 'mars',
                duration: {type: 'none', amount: '10', units: 'day'},
                humans: {type: 'human_agent', amount: '10', units: ''},
                food: {type: 'food_storage', amount: '100', units: ''},
                crewQuarters: {type: 'crew_habitat_small', amount: 1, units: ''},
                eclss: {type: 'eclss', amount: '1', units: ''},
                powerGeneration: {type: 'solar_pv_array_mars', amount: '30',
                units: ''},
                powerStorage: {type: 'power_storage', amount: '1000', units: ''},
                greenhouse: {type: 'none', amount: '0', units: ''},
                plantSpecies: [{type:"", amount:""}]
            },
            // these are disabled for now
            humansonly:{
                location:"mars",
                duration:{type:"none",amount:'30',units:"day"},
                humans:{type:"human_agent",amount:2,units:""},
                food:{type:"food_storage",amount:'10000',units:""},
                crewQuarters:{type:"crew_habitat_small",amount:'0',units:""},
                eclss:{type:"eclss",amount:'1',units:""},
                powerGeneration:{type:"solar_pv_array_mars",amount:'2',units:""},
                powerStorage:{type:"power_storage",amount:'1000',units:""},
                greenhouse:{type:"none",amount:'0',units:""},
                plantSpecies:[{type:"", amount:""}],
            },

            hybridone:{
                location:"mars",
                duration:{type:"none",amount:'90',units:"day"},
                humans:{type:"human_agent",amount:2,units:""},
                food:{type:"food_storage",amount:'10000',units:""},
                crewQuarters:{type:"crew_habitat_small",amount:'1',units:""},
                eclss:{type:"eclss",amount:'0',units:""},
                powerGeneration:{type:"solar_pv_array_mars",amount:'3',units:""},
                powerStorage:{type:"power_storage",amount:'1000',units:""},
                greenhouse:{type:"greenhouse_small",amount:'1',units:""},
                plantSpecies:[{"type":"cabbage","amount":100}],
            },
            hybridtwo:{
                location:"mars",
                duration:{type:"none",amount:'90',units:"day"},
                humans:{type:"human_agent",amount:2,units:""},
                food:{type:"food_storage",amount:'10000',units:""},
                crewQuarters:{type:"crew_habitat_small",amount:'1',units:""},
                eclss:{type:"eclss",amount:'0',units:""},
                powerGeneration:{type:"solar_pv_array_mars",amount:'3',units:""},
                powerStorage:{type:"power_storage",amount:'1000',units:""},
                greenhouse:{type:"greenhouse_small",amount:'1',units:""},
                plantSpecies:[{"type":"wheat","amount":100}],
            },
            hybridthree:{
                location:"mars",
                duration:{type:"none",amount:'90',units:"day"},
                humans:{type:"human_agent",amount:2,units:""},
                food:{type:"food_storage",amount:'10000',units:""},
                crewQuarters:{type:"crew_habitat_small",amount:'1',units:""},
                eclss:{type:"eclss",amount:'0',units:""},
                powerGeneration:{type:"solar_pv_array_mars",amount:'20',units:""},
                powerStorage:{type:"power_storage",amount:'1000',units:""},
                greenhouse:{type:"greenhouse_small",amount:'1',units:""},
                plantSpecies:[{"type":"wheat","amount":100}],
            },
            hybridfour:{
                location:"mars",
                duration:{type:"none",amount:'90',units:"day"},
                humans:{type:"human_agent",amount:4,units:""},
                food:{type:"food_storage",amount:'10000',units:""},
                crewQuarters:{type:"crew_habitat_small",amount:'1',units:""},
                eclss:{type:"eclss",amount:'1',units:""},
                powerGeneration:{type:"solar_pv_array_mars",amount:'30',units:""},
                powerStorage:{type:"power_storage",amount:'1000',units:""},
                greenhouse:{type:"greenhouse_small",amount:'1',units:""},
                plantSpecies:[
                    {"type":"wheat","amount":50},
                    {"type":"cabbage","amount":50},
                    {"type":"strawberry","amount":50},
                    {"type":"radish","amount":50},
                    {"type":"red_beet","amount":33},
                    {"type":"lettuce","amount":34}
                ],
            },
        }
    },
    computed:{
        ...mapGetters('wizard',['getConfiguration']),
    },
    methods:{
        ...mapMutations('wizard',['SETCONFIGURATION','SETACTIVEREFENTRY']),
        saveToLocalStorage: function () {
            // save custom preset to local storage
            const config = JSON.stringify(this.getConfiguration)
            localStorage.setItem('custom-config', config)
        },
        loadFromLocalStorage: function () {
            // load custom preset from the local storage if available,
            // otherwise load an empty preset
            const config = localStorage.getItem('custom-config')
            this.SETCONFIGURATION(config?JSON.parse(config):this.none)
        },
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
