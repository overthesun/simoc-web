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
        formOrder: ['Initial', 'Inhabitants', 'ECLSS', 'Greenhouse', 'Energy', 'Finalize'],
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
            locations: ['mars', 'b2'],
            startDate: {
                min: '1991-01-01',
                max: '1995-12-31',
            },
            duration_ranges: {
                // limited to 2 earth years
                hour: {min: 24, max: 8760*2},
                day: {min: 1, max: 365*2},
                year: {min: 1, max: 1*2},
            },
            duration_units: ['hour', 'day'],
            humans: {min: 0, max: 10},
            weeding: {min: 0, max: 16},
            pestPicking: {min: 0, max: 16},
            food: {min: 0, max: 8760},
            eclss: {
                amount: {min: 0, max: 10},
                co2UpperLimit: {min: 0, max: 1},
                co2Reserves: {min: 0, max: 1e6},
                co2LowerLimit: {min: 0, max: 1},
                o2Reserves: {min: 0, max: 1e6},
                o2LowerLimit: {min: 0, max: 30},
            },
            crew_quarters_types: ['none', 'crew_habitat_small',
                                  'crew_habitat_medium', 'crew_habitat_large',
                                  'crew_habitat_sam', 'crew_habitat_b2'],
            greenhouse_types: ['none', 'greenhouse_small',
                               'greenhouse_medium', 'greenhouse_large',
                               'greenhouse_sam', 'greenhouse_b2'],
            // TODO: the list of plants is downloaded and should be cached
            // the valid range for plants is calculated dinamically
            generator_types: ['none', 'solar_pv_array_mars', 'b2_power_gen'],
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
        defaultB2Config: {
            name: 'Default config Biosphere 2',
            simdata_file: '',
            location: 'b2',
            startDate: '1991-01-01',
            duration: {type: 'none', amount: 30, units: 'day'},
            // TODO: Implement weeding and pestPicking on backend, connect
            humans: {type: 'human_agent', amount: 8, units: '', weeding: null, pestPicking: null},
            food: {type: 'food_storage', amount: 500, units: 'kg'},
            crewQuarters: {type: 'crew_habitat_b2', amount: 1, units: ''},
            biomes: {rainforest: 2000, desert: 1400, ocean: 863, savannah: 1637},
            eclss: {
                type: 'eclss',
                amount: 1,
                units: '',
                o2Reserves: 0,      // kg
                o2LowerLimit: 20,   // %
                co2Reserves: 0,     // kg
                co2LowerLimit: 0,   // %
                co2UpperLimit: 0.25, // %
            },
            powerGeneration: {type: 'b2_power_gen', amount: 1, units: ''},
            powerStorage: {type: 'power_storage', amount: 1000, units: 'kWh'},
            greenhouse: {type: 'greenhouse_b2', amount: 1, units: ''},
            plantSpecies: [
                {type: 'rice', amount: 530},
                {type: 'wheat', amount: 370},
                {type: 'sorghum', amount: 261},
                {type: 'peanut', amount: 168},
                {type: 'corn', amount: 488},
                {type: 'dry_bean', amount: 222},
                {type: 'sweet_potato', amount: 261},
                {type: 'vegetables', amount: 348},
                {type: 'soybean', amount: 326},
                {type: 'orchard', amount: 646},
            ],
            improvedCropManagement: false,
            startWithM1EndingAtmosphere: false,
            concrete: {amount: 15800},
            soil: {amount: 16720},
        },
        mars_presets: {
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
                powerGeneration: {type: 'solar_pv_array_mars', amount: 500, units: ''},
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
        b2_presets: {
            b2_mission_1a: {
                name: 'Mission 1a',
                simdata_file: 'simoc-simdata-b2-mission-1a.json',
                location: 'b2',
                startDate: '1991-09-26',
                duration: {type: 'none', amount: 475, units: 'day'},
                humans: {type: 'human_agent', amount: 8, units: '', weeding: null,
                         pestPicking: null},
                food: {type: 'food_storage', amount: 500, units: 'kg'},
                crewQuarters: {type: 'crew_habitat_b2', amount: 1, units: ''},
                biomes: {rainforest: 2000, desert: 1400, ocean: 863, savannah: 1637},
                eclss: {type: 'eclss', amount: 1, units: '',
                        o2Reserves: 0,          // kg
                        o2LowerLimit: 20,       // %
                        co2Reserves: 0,         // kg
                        co2LowerLimit: 0,       // %
                        co2UpperLimit: 0.25},   // %
                powerGeneration: {type: 'b2_power_gen', amount: 1, units: ''},
                powerStorage: {type: 'power_storage', amount: 1000, units: 'kWh'},
                greenhouse: {type: 'greenhouse_b2', amount: 1, units: ''},
                plantSpecies: [
                    {type: 'rice', amount: 530},
                    {type: 'wheat', amount: 370},
                    {type: 'sorghum', amount: 261},
                    {type: 'peanut', amount: 168},
                    {type: 'corn', amount: 488},
                    {type: 'dry_bean', amount: 222},
                    {type: 'sweet_potato', amount: 261},
                    {type: 'vegetables', amount: 348},
                    {type: 'soybean', amount: 326},
                    {type: 'orchard', amount: 646},
                ],
                improvedCropManagement: false,
                startWithM1EndingAtmosphere: false,
                concrete: {amount: 15800},
                soil: {amount: 16720},
            },
            b2_mission_1b: {
                name: 'Mission 1b',
                simdata_file: 'simoc-simdata-b2-mission-1b.json',
                location: 'b2',
                startDate: '1993-01-12',
                duration: {type: 'none', amount: 257, units: 'day'},
                humans: {type: 'human_agent', amount: 8, units: ''},
                food: {type: 'food_storage', amount: 500, units: 'kg'},
                crewQuarters: {type: 'crew_habitat_b2', amount: 1, units: '',
                               o2: 1967, co2: 42, h2o: 120, n2: 11025},
                biomes: {rainforest: 2000, desert: 1400, ocean: 863, savannah: 1637},
                eclss: {type: 'eclss', amount: 1, units: '',
                        o2Reserves: 11288,      // kg
                        o2LowerLimit: 20,       // %
                        co2Reserves: 0,         // kg
                        co2LowerLimit: 0,       // %
                        co2UpperLimit: 0.25},   // %
                powerGeneration: {type: 'b2_power_gen', amount: 1, units: ''},
                powerStorage: {type: 'power_storage', amount: 1000, units: 'kWh'},
                greenhouse: {type: 'greenhouse_b2', amount: 1, units: '',
                             o2: 6302, co2: 136, h2o: 381, n2: 35312},
                plantSpecies: [
                    {type: 'rice', amount: 214},
                    {type: 'wheat', amount: 149},
                    {type: 'sorghum', amount: 105},
                    {type: 'peanut', amount: 68},
                    {type: 'corn', amount: 197},
                    {type: 'dry_bean', amount: 784},
                    {type: 'sweet_potato', amount: 784},
                    {type: 'vegetables', amount: 141},
                    {type: 'soybean', amount: 132},
                    {type: 'orchard', amount: 261},
                    {type: 'red_beet', amount: 784},
                ],
                startWithM1EndingAtmosphere: true,
                improvedCropManagement: false,
                concrete: {amount: 15800},
                soil: {amount: 16720},
            },
            b2_mission_2: {
                name: 'Mission 2',
                simdata_file: 'simoc-simdata-b2-mission-2.json',
                location: 'b2',
                startDate: '1994-03-06',
                duration: {type: 'none', amount: 185, units: 'day'},
                humans: {type: 'human_agent', amount: 8, units: '', weeding: null,
                         pestPicking: null},
                food: {type: 'food_storage', amount: 500, units: 'kg'},
                crewQuarters: {type: 'crew_habitat_b2', amount: 1, units: ''},
                biomes: {rainforest: 2000, desert: 1400, ocean: 863, savannah: 1637},
                eclss: {type: 'eclss', amount: 1, units: '',
                        o2Reserves: 0,          // kg
                        o2LowerLimit: 20,       // %
                        co2Reserves: 0,         // kg
                        co2LowerLimit: 0,       // %
                        co2UpperLimit: 0.25},   // %
                powerGeneration: {type: 'b2_power_gen', amount: 1, units: ''},
                powerStorage: {type: 'power_storage', amount: 1000, units: 'kWh'},
                greenhouse: {type: 'greenhouse_b2', amount: 1, units: ''},
                plantSpecies: [
                    {type: 'rice', amount: 530},
                    {type: 'wheat', amount: 370},
                    {type: 'sorghum', amount: 261},
                    {type: 'peanut', amount: 168},
                    {type: 'corn', amount: 488},
                    {type: 'dry_bean', amount: 222},
                    {type: 'sweet_potato', amount: 261},
                    {type: 'vegetables', amount: 348},
                    {type: 'soybean', amount: 326},
                    {type: 'orchard', amount: 646},
                ],
                startWithM1EndingAtmosphere: false,
                improvedCropManagement: true,
                concrete: {amount: 15800},
                soil: {amount: 16720},
            },
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

        getPresets(state, location = 'mars') {
            if (location === 'b2') {
                return state.b2_presets
            } else {
                return state.mars_presets
            }
        },

        // Returns a formatted configuration object in the format required by the backend.
        getFormattedConfiguration(state) {
            const config = state.configuration
            // create formatted configuration
            const fconfig = {
                location: config.location,
                start_time: config.startDate,
                duration: {type: config.duration.units,
                           value: parseInt(config.duration.amount, 10)},
                human_agent: {amount: parseInt(config.humans.amount, 10)},
                food_storage: {ration: parseInt(config.food.amount, 10)},
                eclss: config.eclss,
                power_storage: {kwh: parseInt(config.powerStorage.amount, 10)},
                nutrient_storage: {fertilizer: config.location === 'b2' ? 10000 : 300},
                concrete: config.concrete,
                soil: config.soil,
                single_agent: 1,
                plants: [],
            }
            const pg = config.powerGeneration
            fconfig[pg.type] = {amount: parseInt(pg.amount, 10)}
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
            if ('biomes' in state.configuration) {
                fconfig.biomes = config.biomes
            }
            config.plantSpecies.forEach(element => {
                // ignore plants if the plant type is not selected
                if (element.type !== '') {
                    fconfig.plants.push({species: element.type,
                                         amount: parseInt(element.amount, 10)})
                }
            })
            // Flags, used to customize starting parameters in b2 sim
            const flags = ['improvedCropManagement', 'startWithM1EndingAtmosphere']
            flags.forEach(f => {
                if (f in state.configuration) {
                    fconfig[f] = state.configuration[f]
                }
            })
            return fconfig
        },
    },
    actions: {
        setConfiguration(value, location) {
            // Make sure the config contains all required items:
            // initialize the config with the default, then add
            // all valid keys from "value" and report invalid ones.
            const newvalue = JSON.parse(JSON.stringify(value))
            const newconfig = location === 'b2' ? this.defaultB2Config : this.defaultConfig
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
        setPreset(name, location) {
            if (location === 'b2') {
                this.setConfiguration(this.b2_presets[name], location)
            } else if (location === 'mars') {
                this.setConfiguration(this.mars_presets[name], location)
            }
        },
        setLiveConfig(duration, location) {
            console.log('Updating mission time...')
            this.setConfiguration(duration, location)
        },
        setInitial(value) {
            const {startDate, duration} = value
            this.configuration.startDate = startDate
            this.configuration.duration = duration
        },
        setInhabitants(value) {
            const {humans, food, crewQuarters, biomes} = value
            this.configuration.humans = humans
            this.configuration.food = food
            this.configuration.crewQuarters = crewQuarters
            this.configuration.biomes = biomes
        },
        setECLSS(value) {
            this.configuration.eclss = value
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
        setCropManagement(value) {
            this.configuration.improvedCropManagement = value
        },
        setActiveRefEntry(value) {
            // This is set here so I don't have to call it on every link.
            // It is redundant for the table of contents navigation.
            this.activeReference = 'Reference'
            this.activeRefEntry = value
        },
        resetConfigDefault(value) {
            this.configuration = value === 'b2' ? this.defaultB2Config : this.defaultConfig
            this.activeFormIndex = 0
            this.activeReference = 'Layout'
            this.activeRefEntry = 'Welcome'
        },
    },
})
