import {defineStore} from 'pinia'

export const useWizardStore = defineStore('WizardStore', {
    state: () => ({
        // stores the configuration values
        configuration: {},
        // the type of configuration being used (e.g. Guided, Custom)
        activeConfigType: null,
        // the index of the currently-selected form
        activeFormIndex: 0,
        // array of component names used within the ConfigurationView. Used to display by index
        formOrder: ['Initial', 'Inhabitants', 'Greenhouse', 'Energy', 'Finalize'],
        // which window on the reference side is active
        activeReference: 'Layout',  // see also resetConfigDefault below
        // which entry is currently active within the reference
        activeRefEntry: 'Welcome',  // see also resetConfigDefault below
        // true if the preset dropdown and the config form should be reset
        resetConfig: false,
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
        defaultConfig: {
            name: 'Default config',
            simdata_file: '',
            location: 'mars',
            duration: {type: 'none', amount: null, units: 'day'},
            humans: {type: 'human_agent', amount: null, units: ''},
            food: {type: 'food_storage', amount: null, units: 'kg'},
            eclss: {type: 'eclss', amount: null, units: ''},
            powerGeneration: {type: 'solar_pv_array_mars', amount: null, units: ''},
            powerStorage: {type: 'power_storage', amount: null, units: 'kWh'},
            crewQuarters: {type: 'none', amount: 0, units: ''},
            greenhouse: {type: 'none', amount: 0, units: ''},
            plantSpecies: [{type: '', amount: ''}],
        },
        getPresets: {
            one_human: {
                name: '1 Human',
                simdata_file: 'simoc-simdata-1-human-preset.json',
                location: 'mars',
                duration: {type: 'none', amount: 10, units: 'day'},
                humans: {type: 'human_agent', amount: 1, units: ''},
                food: {type: 'food_storage', amount: 100, units: 'kg'},
                crewQuarters: {type: 'crew_habitat_small', amount: 1, units: ''},
                eclss: {type: 'eclss', amount: 1, units: ''},
                powerGeneration: {type: 'solar_pv_array_mars', amount: 30, units: ''},
                powerStorage: {type: 'power_storage', amount: 1000, units: 'kWh'},
                greenhouse: {type: 'none', amount: 0, units: ''},
                plantSpecies: [{type: '', amount: ''}],
            },
            one_human_radish: {
                name: '1 Human + Radish',
                simdata_file: 'simoc-simdata-1-human-radish-preset.json',
                location: 'mars',
                duration: {type: 'none', amount: 30, units: 'day'},
                humans: {type: 'human_agent', amount: 1, units: ''},
                food: {type: 'food_storage', amount: 100, units: 'kg'},
                crewQuarters: {type: 'crew_habitat_small', amount: 1, units: ''},
                eclss: {type: 'eclss', amount: 1, units: ''},
                powerGeneration: {type: 'solar_pv_array_mars', amount: 70, units: ''},
                powerStorage: {type: 'power_storage', amount: 1000, units: 'kWh'},
                greenhouse: {type: 'greenhouse_small', amount: 1, units: ''},
                plantSpecies: [{type: 'radish', amount: 40}],
            },
            four_humans: {
                name: '4 Humans',
                simdata_file: 'simoc-simdata-4-human-preset.json',
                location: 'mars',
                duration: {type: 'none', amount: 10, units: 'day'},
                humans: {type: 'human_agent', amount: 4, units: ''},
                food: {type: 'food_storage', amount: 100, units: 'kg'},
                crewQuarters: {type: 'crew_habitat_small', amount: 1, units: ''},
                eclss: {type: 'eclss', amount: 1, units: ''},
                powerGeneration: {type: 'solar_pv_array_mars', amount: 30, units: ''},
                powerStorage: {type: 'power_storage', amount: 1000, units: 'kWh'},
                greenhouse: {type: 'none', amount: 0, units: ''},
                plantSpecies: [{type: '', amount: ''}],
            },
            four_humans_garden: {
                name: '4 Humans + Garden',
                simdata_file: 'simoc-simdata-4-human-garden-preset.json',
                location: 'mars',
                duration: {type: 'none', amount: 100, units: 'day'},
                humans: {type: 'human_agent', amount: 4, units: ''},
                food: {type: 'food_storage', amount: 1200, units: 'kg'},
                crewQuarters: {type: 'crew_habitat_medium', amount: 1, units: ''},
                eclss: {type: 'eclss', amount: 1, units: ''},
                powerGeneration: {type: 'solar_pv_array_mars', amount: 300, units: ''},
                powerStorage: {type: 'power_storage', amount: 1000, units: 'kWh'},
                greenhouse: {type: 'greenhouse_small', amount: 1, units: ''},
                plantSpecies: [
                    {type: 'wheat', amount: 20},
                    {type: 'cabbage', amount: 30},
                    {type: 'strawberry', amount: 10},
                    {type: 'radish', amount: 50},
                    {type: 'red_beet', amount: 50},
                    {type: 'onion', amount: 50},
                ],
            },
            sam_one_human_garden: {
                name: 'SAM: 1 Human + Garden',
                simdata_file: 'simoc-simdata-sam-1-human-garden-preset.json',
                location: 'mars',
                duration: {type: 'none', amount: 100, units: 'day'},
                humans: {type: 'human_agent', amount: 1, units: ''},
                food: {type: 'food_storage', amount: 300, units: 'kg'},
                crewQuarters: {type: 'crew_habitat_sam', amount: 1, units: ''},
                eclss: {type: 'eclss', amount: 1, units: ''},
                powerGeneration: {type: 'solar_pv_array_mars', amount: 100, units: ''},
                powerStorage: {type: 'power_storage', amount: 1000, units: 'kWh'},
                greenhouse: {type: 'greenhouse_sam', amount: 1, units: ''},
                plantSpecies: [
                    {type: 'rice', amount: 2},
                    {type: 'cabbage', amount: 8},
                    {type: 'tomato', amount: 8},
                    {type: 'sweet_potato', amount: 5},
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
        },
    }),
    getters: {
        // This method converts the total mission time to hours regardless of the units selected.
        // As one step = one hour.
        getActiveForm: state => state.formOrder[state.activeFormIndex],

        getTotalMissionHours(state) {
            let totalHours = 0
            const durationLength = state.configuration.duration.amount
            const durationUnits = state.configuration.duration.units

            if (durationUnits === 'day') {
                totalHours = durationLength * 24
            } else if (durationUnits === 'year') {
                totalHours = durationLength * 8760
            } else {
                totalHours = durationLength
            }

            return totalHours
        },

        // Returns a formatted configuration object in the format required by the backend.
        getFormattedConfiguration(state) {
            const config = state.configuration
            // create formatted configuration
            const fconfig = {
                duration: {type: config.duration.units,
                           value: parseInt(config.duration.amount, 10)},
                human_agent: {amount: parseInt(config.humans.amount, 10)},
                food_storage: {ration: parseInt(config.food.amount, 10)},
                eclss: {amount: parseInt(config.eclss.amount, 10)},
                solar_pv_array_mars: {amount: parseInt(config.powerGeneration.amount, 10)},
                power_storage: {kwh: parseInt(config.powerStorage.amount, 10)},
                nutrient_storage: {fertilizer: 300},
                single_agent: 1,
                plants: [],
            }
            if ((state.configuration.greenhouse.type === 'none') &&
                (state.configuration.crewQuarters.type === 'none')) {
                throw new Error('Please select a value for the ' +
                                'Crew Quarters and/or the Greenhouse.')
            }
            if (state.configuration.greenhouse.type !== 'none') {
                fconfig.greenhouse = config.greenhouse.type
            }
            if (state.configuration.crewQuarters.type !== 'none') {
                fconfig.habitat = config.crewQuarters.type
            }
            config.plantSpecies.forEach(element => {
                // ignore plants if the plant type is not selected
                if (element.type !== '') {
                    fconfig.plants.push({species: element.type,
                                         amount: parseInt(element.amount, 10)})
                }
            })
            return fconfig
        },
    },
    actions: {
        setConfiguration(value) {
            // Make sure the config contains all required items:
            // initialize the config with the default, then add
            // all valid keys from "value" and report invalid ones.
            const newvalue = JSON.parse(JSON.stringify(value))
            const newconfig = this.defaultConfig
            const valid_keys = []
            const invalid_keys = []
            Object.keys(newvalue).forEach((key, i) => {
                if (key in newconfig) {
                    newconfig[key] = newvalue[key]
                    valid_keys.push(key)
                } else {
                    invalid_keys.push(key)
                }
            })
            if (valid_keys.length === 0) {
                throw new Error('invalid configuration file.')
            }
            if (invalid_keys.length > 0) {
                console.log('* Ignoring invalid keys in the uploaded file:',
                            invalid_keys.join(', '))
            }
            this.configuration = newconfig
        },
        setPreset(name) {
            this.setConfiguration(this.getPresets[name])
        },
        setInitial(value) {
            const {location, duration} = value
            this.configuration.location = location
            this.configuration.duration = duration
        },
        setInhabitants(value) {
            const {humans, food, crewQuarters, eclss} = value
            this.configuration.humans = humans
            this.configuration.food = food
            this.configuration.crewQuarters = crewQuarters
            this.configuration.eclss = eclss
        },
        setGreenhouse(value) {
            const {greenhouse} = value
            this.configuration.greenhouse = greenhouse
        },
        setEnergy(value) {
            const {powerGeneration, powerStorage} = value
            this.configuration.powerGeneration = powerGeneration
            this.configuration.powerStorage = powerStorage
        },
        // Adds an empty plant to the plant species array
        addPlantSpecies() {
            this.configuration.plantSpecies.push({type: '', amount: ''})
        },
        // Updates the plant at the index with the new values
        updatePlantSpecies(value) {
            const {index, plant} = value
            plant.amount = parseInt(plant.amount, 10)
            this.configuration.plantSpecies[index] = plant
        },
        // Removes the plant at the index
        removePlantSpecies(value) {
            const index = value
            const arrLength = this.configuration.plantSpecies.length
            if (arrLength > 1) {
                this.configuration.plantSpecies.splice(index, 1)
            } else if (arrLength === 1) {
                // plantSpecies[0] = {type:"",amount:''} doesn't
                // trigger the watchers, but this does
                this.configuration.plantSpecies[0].type = ''
                this.configuration.plantSpecies[0].amount = ''
            }
        },
        setActiveRefEntry(value) {
            // This is set here so I don't have to call it on every link.
            // It is redundant for the table of contents navigation.
            this.activeReference = 'Reference'
            this.activeRefEntry = value
        },
        resetConfigDefault(state) {
            this.configuration = this.defaultConfig
            this.activeFormIndex = 0
            this.activeReference = 'Layout'
            this.activeRefEntry = 'Welcome'
        },
    },
})