//Contains the shared state for all things related to the wizard.
//User selected configuration
//Currently active reference selections - Reference / Graphs / Recommended
//Currently selected reference entry - this is used to set which entry should be active within the encylopedia. Mostly
//used for clicking the form section headers to activate the approriate.

function getDefaultConfig() {
    // return the default configuration,
    // and ensures that a new object is returned
    return {
        location: "mars",
        duration: {type:"none", amount:null, units:"day"},
        humans: {type:"human_agent", amount:null, units:""},
        food: {type:"food_storage", amount:null, units:""},
        eclss: {type:"eclss", amount:null, units:""},
        powerGeneration: {type:"solar_pv_array_mars", amount:null, units:""},
        powerStorage: {type:"power_storage", amount:null, units:""},
        crewQuarters: {type:"none", amount:0, units:""},
        greenhouse: {type:"none", amount:0, units:""},
        plantSpecies: [{type:"", amount:""}],
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
                                  'crew_habitat_medium', 'crew_habitat_large'],
            greenhouse_types: ['none', 'greenhouse_small',
                               'greenhouse_medium', 'greenhouse_large'],
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
        SETCONFIGURATION: function(state, value) {
            // Make sure the config contains all required items:
            // initialize the config with the default, then add
            // all valid keys from "value" and report invalid ones.
            value = JSON.parse(JSON.stringify(value))
            let newconfig = getDefaultConfig()
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
            state.configuration = getDefaultConfig()
            state.activeFormIndex = 0
            state.activeReference = 'Reference'
            state.activeRefEntry = 'Welcome'
        }
    }
}
