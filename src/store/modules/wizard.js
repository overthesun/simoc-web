//Contains the shared state for all things related to the wizard.
//User selected configuration
//Currently active reference selections - Reference / Graphs / Recommended
//Currently selected reference entry - this is used to set which entry should be active within the encylopedia. Mostly
//used for clicking the form section headers to activate the approriate.

export default{
    state:{
        // default configuration, initialized in RESETCONFIG
        configuration: {},
        // the type of configuration being used (e.g. guided, expert)
        activeConfigType: null,
        // the index of the currently-selected form
        activeFormIndex: 0,
        // array of component names used within the ConfigurationView. Used to display by index
        formOrder: ['Initial','Inhabitants','Greenhouse','Energy','Finalize'],
        // which window on the reference side is active
        activeReference: 'Reference',
        // which entry is currently active within the reference
        activeRefEntry: 'Welcome',
    },
    getters:{
        getConfiguration: state => state.configuration,
        getActiveConfigType: state => state.activeConfigType,
        getActiveFormIndex: state => state.activeFormIndex,
        getActiveForm: state => state.formOrder[state.activeFormIndex],
        getActiveReference: state => state.activeReference,
        getActiveRefEntry: state => state.activeRefEntry,
        getFormLength: state => state.formOrder.length,


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
        getFormattedConfiguration:function(state){

            let config = {
                duration:{value:parseInt(state.configuration.duration.amount),type:state.configuration.duration.units},
                human_agent:{amount:parseInt(state.configuration.humans.amount)},
                food_storage:{amount:parseInt(state.configuration.food.amount)},
                solar_pv_array_mars:{amount:parseInt(state.configuration.powerGeneration.amount)},
                power_storage:{amount:parseInt(state.configuration.powerStorage.amount)},
                eclss:{amount:parseInt(state.configuration.eclss.amount)},
                single_agent:1,
                plants:new Array()
            }

            state.configuration.plantSpecies.forEach(element =>{
                if(element.type != 'none'){
                    config.plants.push({species:element.type,amount:parseInt(element.amount)})
                }
            })

            if(state.configuration.greenhouse.type != 'none'){
                config['greenhouse'] = state.configuration.greenhouse.type
            }

            if(state.configuration.crewQuarters.type != 'none'){
                config['habitat'] = state.configuration.crewQuarters.type
            }

            return config
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
            const {index,plantSpecies} = value
            state.configuration.plantSpecies[index] = plantSpecies
        },
        //Removes the plant at the index
        REMOVEPLANTSPECIES:(state,value)=>{
            let index = value
            const arrLength = state.configuration.plantSpecies.length

            if(arrLength > 1){
                state.configuration.plantSpecies.splice(index,1)
            } else if( length === 1){
                state.configuration.plantSpecies[0] = {type:"",amount:""}
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
                location: "none",
                duration: {type:"none", amount:'0', units:"none"},
                humans: {type:"human_agent", amount:'0', units:""},
                food: {type:"food_storage", amount:'0', units:""},
                eclss: {type:"eclss", amount:'0', units:""},
                powerGeneration: {type:"solar_pv_array_mars", amount:'0', units:""},
                powerStorage: {type:"power_storage", amount:'0', units:""},
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
