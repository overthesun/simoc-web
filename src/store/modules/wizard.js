//Contains the shared state for all things related to the wizard.
//User selected configuration
//Currently active reference selections - Reference / Graphs / Recommended
//Currently selected reference entry - this is used to set which entry should be active within the encylopedia. Mostly
//used for clicking the form section headers to activate the approriate.

export default{
    state:{
        // default configuration, initialized in RESETCONFIG
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
        // valid values and ranges for the form inputs
        validValues: {
            locations: ['mars'],
            duration_ranges: {
                hour: {min: 24, max: 16488},
                day: {min: 1, max: 687},
                year: {min: 1, max: 1},
            },
            duration_units: ['hour', 'day'],
            humans: {min: 0, max: 20},
            food: {min: 0, max: 35000},
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
            // keep track of invalid entries and throw an error if there are any
            let invalid_entries = new Array()
            function validate(value, label) {
                const int_value = parseInt(value)
                if (int_value == null || isNaN(int_value)) {
                    invalid_entries.push(label)
                }
                // return 0 if the value is null/undefined/NaN --
                // an error should be thrown before they get to the server,
                // but storing 0 is better just in case
                return int_value || 0
            }
            const config = state.configuration
            // create formatted configuration
            let fconfig = {
                duration: {type: config.duration.units,
                           value: validate(config.duration.amount, 'Duration')},
                human_agent: {amount: validate(config.humans.amount, 'Inhabitants')},
                food_storage: {amount: validate(config.food.amount, 'Food Supply')},
                solar_pv_array_mars: {amount: validate(config.powerGeneration.amount, 'Power Generation')},
                power_storage: {amount: validate(config.powerStorage.amount, 'Power Storage')},
                eclss: {amount: validate(config.eclss.amount, 'Life Support')},
                single_agent: 1,
                plants: new Array(),
            }
            config.plantSpecies.forEach(element => {
                // ignore plants if the plant type is not selected
                if (element.type != '' && element.type != 'none') {
                    fconfig.plants.push({species: element.type,
                                         amount: validate(element.amount, 'Plant Species')})
                }
            })
            if (config.greenhouse.type != 'none') {
                fconfig['greenhouse'] = config.greenhouse.type
            }
            else if (fconfig.plants.length > 0) {
                // plants without a greenhouse is an error
                invalid_entries.push('Greenhouse')
            }
            if (config.crewQuarters.type != 'none') {
                fconfig['habitat'] = config.crewQuarters.type
            }
            else if (fconfig.human_agent.amount > 0) {
                // humans without crew quarters is an error too
                invalid_entries.push('Crew Quarters')
            }
            // abort and throw an error if we have invalid entries
            if (invalid_entries.length > 0) {
                throw invalid_entries
            }
            return fconfig
        }
    },
    mutations:{
        SETCONFIGURATION:function(state,value){
            state.configuration = value
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
        RESETCONFIG: function(state) {
            state.configuration = {
                location: "mars",
                duration: {type:"none", amount:null, units:"day"},
                humans: {type:"human_agent", amount:null, units:""},
                food: {type:"food_storage", amount:null, units:""},
                eclss: {type:"eclss", amount:null, units:""},
                powerGeneration: {type:"solar_pv_array_mars", amount:null, units:""},
                powerStorage: {type:"power_storage", amount:null, units:""},
                crewQuarters: {type:"none", amount:'0', units:""},
                greenhouse: {type:"none", amount:'0', units:""},
                plantSpecies: [{type:"", amount:""}],
            }
            state.activeFormIndex = 0
            state.activeReference = 'Reference'
            state.activeRefEntry = 'Welcome'
        }
    }
}
