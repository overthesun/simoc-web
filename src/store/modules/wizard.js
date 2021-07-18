//Contains the shared state for all things related to the wizard.
//User selected configuration
//Currently active reference selections - Reference / Graphs / Recommended
//Currently selected reference entry - this is used to set which entry should be active within the encylopedia. Mostly
//used for clicking the form section headers to activate the approriate.

function get_default_config() {
    // return the default configuration,
    // and ensures that a new object is returned
    return {
        name: "Default config",
        simdata_file: "",
        location: "mars",
        duration: {type:"none", amount:null, units:"day"},
        humans: {type:"human_agent", amount:null, units:""},
        food: {type:"food_storage", amount:null, units:"kg"},
        eclss: {type:"eclss", amount:null, units:""},
        powerGeneration: {type:"solar_pv_array_mars", amount:null, units:""},
        powerStorage: {type:"power_storage", amount:null, units:"kWh"},
        crewQuarters: {type:"none", amount:0, units:""},
        greenhouse: {type:"none", amount:0, units:""},
        plantSpecies: [{type:"", amount:""}],
    }
}

function get_presets() {
    return {
        one_human: {
            name: '1 Human',
            simdata_file: 'simoc-simdata-1-human-preset.json',
            location: 'mars',
            duration: {type:'none', amount:10, units:'day'},
            humans: {type:'human_agent', amount:1, units:''},
            food: {type:'food_storage', amount:100, units:'kg'},
            crewQuarters: {type:'crew_habitat_small', amount: 1, units:''},
            eclss: {type:'eclss', amount:1, units:''},
            powerGeneration: {type:'solar_pv_array_mars', amount:30, units:''},
            powerStorage: {type:'power_storage', amount:1000, units:'kWh'},
            greenhouse: {type:'none', amount:0, units:''},
            plantSpecies: [{type:'', amount:''}]
        },
        one_human_radish: {
            name: '1 Human + Radish',
            simdata_file: 'simoc-simdata-1-human-radish-preset.json',
            location: 'mars',
            duration: {type:'none', amount:30, units:'day'},
            humans: {type:'human_agent', amount:1, units:''},
            food: {type:'food_storage', amount:100, units:'kg'},
            crewQuarters: {type:'crew_habitat_small', amount:1, units:''},
            eclss: {type:'eclss', amount:1, units:''},
            powerGeneration: {type:'solar_pv_array_mars', amount:70, units:''},
            powerStorage: {type:'power_storage', amount:1000, units:'kWh'},
            greenhouse: {type:'greenhouse_small', amount:1, units:''},
            plantSpecies: [{type:'radish', amount:40}],
        },
        four_humans: {
            name: '4 Humans',
            simdata_file: 'simoc-simdata-4-human-preset.json',
            location:'mars',
            duration: {type:'none', amount:10, units:'day'},
            humans: {type:'human_agent', amount:4, units:''},
            food: {type:'food_storage', amount:100, units:'kg'},
            crewQuarters: {type:'crew_habitat_small', amount:1, units:''},
            eclss: {type:'eclss', amount:1, units:''},
            powerGeneration: {type:'solar_pv_array_mars', amount:30, units:''},
            powerStorage: {type:'power_storage', amount:1000, units:'kWh'},
            greenhouse: {type:'none', amount:0, units:''},
            plantSpecies: [{type:'', amount:''}]
        },
        four_humans_garden: {
            name: '4 Humans + Garden',
            simdata_file: 'simoc-simdata-4-human-garden-preset.json',
            location: 'mars',
            duration: {type:'none', amount:100, units:'day'},
            humans: {type:'human_agent', amount:4, units:''},
            food: {type:'food_storage', amount:1200, units:'kg'},
            crewQuarters: {type:'crew_habitat_medium', amount:1, units:''},
            eclss: {type:'eclss', amount:1, units:''},
            powerGeneration: {type:'solar_pv_array_mars', amount:400, units:''},
            powerStorage: {type:'power_storage', amount:2000, units:'kWh'},
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
        sam_one_human_garden: {
            name: 'SAM: 1 Human + Garden',
            simdata_file: 'simoc-simdata-sam-1-human-garden-preset.json',
            location: 'mars',
            duration: {type:'none', amount:100, units:'day'},
            humans: {type:'human_agent', amount:1, units:''},
            food: {type:'food_storage', amount:300, units:'kg'},
            crewQuarters: {type:'crew_habitat_sam', amount:1, units:''},
            eclss: {type:'eclss', amount:1, units:''},
            powerGeneration: {type:'solar_pv_array_mars', amount:100, units:''},
            powerStorage: {type:'power_storage', amount:1000, units:'kWh'},
            greenhouse: {type:'greenhouse_sam', amount:1, units:''},
            plantSpecies: [
                {type:'rice', amount:2},
                {type:'cabbage', amount:8},
                {type:'tomato', amount:8},
                {type:'sweet_potato', amount:5},
            ],
        },
        // these are disabled for now
        /*
        wheat: {
            name: '2 Humans + Wheat (no ECLSS)',
            simdata_file: "",
            location: 'mars',
            duration: {type:'none', amount:100, units:'day'},
            humans: {type:'human_agent', amount:2, units:''},
            food: {type:'food_storage', amount:300, units:'kg'},
            crewQuarters: {type:'crew_habitat_small', amount:1, units:''},
            eclss: {type:'eclss', amount:0, units:''},
            powerGeneration: {type:'solar_pv_array_mars', amount:380, units:''},
            powerStorage: {type:'power_storage', amount:1000, units:'kWh'},
            greenhouse: {type:'greenhouse_small', amount:1, units:''},
            plantSpecies: [{type:'wheat', amount:100}],
        },
        humansonly: {
            name: '2 Humans',
            simdata_file: "",
            location: 'mars',
            duration: {type:'none', amount:30, units:'day'},
            humans: {type:'human_agent', amount:2, units:''},
            food: {type:'food_storage', amount:10000, units:'kg'},
            crewQuarters: {type:'crew_habitat_small', amount:0, units:''},
            eclss: {type:'eclss', amount:1, units:''},
            powerGeneration: {type:'solar_pv_array_mars', amount:2, units:''},
            powerStorage: {type:'power_storage', amount:1000, units:'kWh'},
            greenhouse: {type:'none', amount:0, units:''},
            plantSpecies: [{type:'',  amount:''}],
        },
        hybridthree: {
            name: '2 Humans + Wheat (no ECLSS, more food)',
            simdata_file: "",
            location: 'mars',
            duration: {type:'none', amount:90, units:'day'},
            humans: {type:'human_agent', amount:2, units:''},
            food: {type:'food_storage', amount:10000, units:'kg'},
            crewQuarters: {type:'crew_habitat_small', amount:1, units:''},
            eclss: {type:'eclss', amount:0, units:''},
            powerGeneration: {type:'solar_pv_array_mars', amount:20, units:''},
            powerStorage: {type:'power_storage', amount:1000, units:'kWh'},
            greenhouse: {type:'greenhouse_small', amount:1, units:''},
            plantSpecies: [{type:'wheat', amount:100}],
        },*/
    }
}


export default{
    state:{
        // stores the configuration values
        configuration: {},
        // the type of configuration being used (e.g. Guided, Custom)
        activeConfigType: null,
        // the index of the currently-selected form
        activeFormIndex: 0,
        // array of component names used within the ConfigurationView. Used to display by index
        formOrder: ['Initial','Inhabitants','Greenhouse','Energy','Finalize'],
        // which window on the reference side is active
        activeReference: 'Reference',
        // which entry is currently active within the reference
        activeRefEntry: 'Welcome',
        // true if the preset dropdown and the config form should be reset
        resetConfig: false,
        // default presets
        presets: get_presets(),
        // the base url for the cached simdata
        simdataLocation: 'https://simoc.space/download/simdata/',
        // valid values and ranges for the form inputs
        // TODO: the valid values should probably be defined and sent by the server
        validValues: {
            locations: ['mars'],
            duration_ranges: {
                // limited to 1 earth year
                hour: {min: 24, max: 8760},
                day: {min: 1, max: 365},
                year: {min: 1, max: 1},
            },
            duration_units: ['hour', 'day'],
            humans: {min: 0, max: 10},
            food: {min: 0, max: 8760},
            eclss: {min: 0, max: 10},
            crew_quarters_types: ['none', 'crew_habitat_small',
                                  'crew_habitat_medium', 'crew_habitat_large', 
                                  'crew_habitat_sam'],
            greenhouse_types: ['none', 'greenhouse_small',
                               'greenhouse_medium', 'greenhouse_large', 
                               'greenhouse_sam'],
            // TODO: the list of plants is downloaded and should be cached
            // the valid range for plants is calculated dinamically
            generator_types: ['none', 'solar_pv_array_mars'],
            generator: {min: 0, max: 5000},
            storage: {min: 0, max: 10000},
        },
    },
    getters:{
        getConfiguration: state => state.configuration,
        getActiveConfigType: state => state.activeConfigType,
        getActiveFormIndex: state => state.activeFormIndex,
        getActiveForm: state => state.formOrder[state.activeFormIndex],
        getActiveReference: state => state.activeReference,
        getActiveRefEntry: state => state.activeRefEntry,
        getResetConfig: state => state.resetConfig,
        getFormLength: state => state.formOrder.length,
        getValidValues: state => state.validValues,
        getPresets: state => state.presets,
        getSimdataLocation: state => state.simdataLocation,

        //This method converts the total mission time to hours regardless of the units selected.
        // As one step = one hour.
        getTotalMissionHours:function(state){
            let totalHours = 0
            let durationLength = state.configuration.duration.amount
            let durationUnits = state.configuration.duration.units

            if(durationUnits === 'day'){
                totalHours = durationLength * 24

            } else if(durationUnits == 'year'){
                totalHours = durationLength * 8760

            } else{
                totalHours = durationLength
            }

            return totalHours
        },

        //Returns a formatted configuration object in the format required by the backend.
        getFormattedConfiguration:function(state) {
            const config = state.configuration
            // create formatted configuration
            let fconfig = {
                duration: {type: config.duration.units, value: parseInt(config.duration.amount)},
                human_agent: {amount: parseInt(config.humans.amount)},
                food_storage: {food_edbl: parseInt(config.food.amount)},
                eclss: {amount: parseInt(config.eclss.amount)},
                solar_pv_array_mars: {amount: parseInt(config.powerGeneration.amount)},
                power_storage: {enrg_kwh: parseInt(config.powerStorage.amount)},
                nutrient_storage: {sold_n: 100, sold_p: 100, sold_k: 100},
                single_agent: 1,
                plants: new Array(),
            }
            if ((state.configuration.greenhouse.type == 'none') &&
                (state.configuration.crewQuarters.type == 'none')) {
                throw 'Please select a value for the Crew Quarters and/or the Greenhouse.'
            }
            if (state.configuration.greenhouse.type != 'none') {
                fconfig['greenhouse'] = config.greenhouse.type
            }
            if (state.configuration.crewQuarters.type != 'none') {
                fconfig['habitat'] = config.crewQuarters.type
            }
            config.plantSpecies.forEach(element => {
                // ignore plants if the plant type is not selected
                if (element.type != '') {
                    fconfig.plants.push({species: element.type, amount: parseInt(element.amount)})
                }
            })
            return fconfig
        }
    },
    mutations:{
        // this method is accessed through the SETCONFIGURATION/SETPRESET actions
        set_config: function(state, value) {
            // Make sure the config contains all required items:
            // initialize the config with the default, then add
            // all valid keys from "value" and report invalid ones.
            value = JSON.parse(JSON.stringify(value))
            let newconfig = get_default_config()
            let valid_keys = []
            let invalid_keys = []
            Object.keys(value).forEach((key, i) => {
                if (newconfig.hasOwnProperty(key)) {
                    newconfig[key] = value[key]
                    valid_keys.push(key)
                }
                else {
                    invalid_keys.push(key)
                }
            })
            if (valid_keys.length == 0) {
                throw 'invalid configuration file.'
            }
            if (invalid_keys.length > 0) {
                console.log('* Ignoring invalid keys in the uploaded file:',
                            invalid_keys.join(', '))
            }
            state.configuration = newconfig
        },
        SETINITIAL:function(state,value){
            const {location,duration} = value
            state.configuration.location = location
            state.configuration.duration = duration
        },
        SETINHABITANTS:function(state,value){
            const {humans,food,crewQuarters,eclss} = value
            state.configuration.humans = humans
            state.configuration.food = food
            state.configuration.crewQuarters = crewQuarters
            state.configuration.eclss = eclss
        },
        SETGREENHOUSE:function(state,value){
            const {greenhouse} = value
            state.configuration.greenhouse = greenhouse
        },
        SETENERGY:function(state,value){
            const {powerGeneration,powerStorage} = value
            state.configuration.powerGeneration = powerGeneration
            state.configuration.powerStorage = powerStorage
        },
        //Adds an empty plant to the plant species array
        ADDPLANTSPECIES:(state) => {
            state.configuration.plantSpecies.push({type:"",amount:''})
        },
        //Updates the plant at the index with the new values
        UPDATEPLANTSPECIES:(state,value) => {
            const {index, plant} = value
            state.configuration.plantSpecies[index] = plant
        },
        //Removes the plant at the index
        REMOVEPLANTSPECIES:(state,value)=>{
            let index = value
            const arrLength = state.configuration.plantSpecies.length
            if (arrLength > 1) {
                state.configuration.plantSpecies.splice(index,1)
            } else if (arrLength === 1) {
                // plantSpecies[0] = {type:"",amount:''} doesn't
                // trigger the watchers, but this does
                state.configuration.plantSpecies[0].type = ''
                state.configuration.plantSpecies[0].amount = ''
            }
        },
        SETACTIVECONFIGTYPE:(state,value)=>{
            state.activeConfigType = value
        },
        SETACTIVEFORMINDEX:(state,value)=>{
            state.activeFormIndex = value
        },
        SETACTIVEREFERENCE:(state,value)=>{
            state.activeReference = value
        },
        SETACTIVEREFENTRY:(state,value)=>{
            state.activeRefEntry = value
            state.activeReference = 'Reference' // This is set here so I don't have to call it on every link.
            //It is redundant for the table of contents navigation.
        },
        SETRESETCONFIG:(state,value)=>{
            state.resetConfig = value
        },
        RESETCONFIG: function(state) {
            state.configuration = get_default_config()
            state.activeFormIndex = 0
            state.activeReference = 'Reference'
            state.activeRefEntry = 'Welcome'
        }
    },
    actions: {
        // TODO: not sure if this is the best way to handle this.
        // Mutations can't call each others so a SETPRESET mutation
        // can't call a SETCONFIGURATION mutation.  I could have
        // created a SETCONFIGURATION mutation and a SETPRESET action
        // but I wanted to keep them together, so I created 2 actions
        // and a mutation instead.
        //
        // set the configuration directly
        SETCONFIGURATION: function(context, config) {
            context.commit('set_config', config)
        },
        // set the configuration from one of the default presets
        SETPRESET: function(context, name) {
            context.commit('set_config', context.state.presets[name])
        },
    }
}
