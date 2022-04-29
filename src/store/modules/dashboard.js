// Contains the shared state for all things related to the dashboard.

// Parameters for the get_step route

// Step data: broken down into objects based on filter type.
// These can be accessed via the below getters.
// The idea is to use object deconstruction to set the variables
// for the individual parts within the calling method.
// agentCount | agentGrowth | totalProduction | totalConsumption | storageRatio


// currentStepBuffer/maxStepBuffer: indicate the current step in the buffer being visualized,
// and the highest step in the buffer.
// A number of watcher functions within components reference currentStepBuffer for updating
// various data points such as panels and charts.

// Timer ID: this is used to pause, resume, speed controls or kill the setTimeout object within.
// SEE stepTimer.js within js folder for further details.

// Termination flag: Universally accessible point to check if the simulation has terminated.

// isLive: Different from but applies only to live-mode, isLive variable determines which Timeline
// visualization and buttons are available between the PlayButton and LiveButton components. If
// true, a red Timeline is presented with the tag LIVE next to the PlayButton indicating the
// Dashboard is live, else, a green Timeline appears with a circle button, PlayButton, replacing the
// LIVE tag indicating the Timeline is not live. Note that when LiveButton is pressed, the Resume
// button is replaced with the Pause button. This takes advantage of the getIsTimerRunning variable
// above that is updated when the timer is running which is in the template of the PlayButton
// component.

// ACTIONS
// ParseStep function is an async call to parse all data from a particular get_step response object.
// It's setup as async so that it can continue to process get_step objects out of order as
// the step_number is used as the key within the resulting filter objects.
// So order doesn't matter as long as the step_number is correct.
// This should also prevent any issues if a step is duplicated within two different step objects

// To be added: Need to add a variable to store the current step interval.
// This is currently only done locally within the Controls component.

const parse_updated_game_vars = (game_config, currency_desc) => {
    /*
    As of October '21, the backend no longer distinguishes between agents and storages.
    Much of the dashboard was designed to pull directly from gameConfig.storages.
    Here, we determine which agents have storage, and add them back manually.
    */

    // Load currency data into dict
    const currencyDict = {}
    Object.entries(currency_desc).forEach(([currencyClass, currencies]) => {
        Object.entries(currencies).forEach(([currency, currencyData]) => {
            currencyDict[currency] = {...currencyData, currencyClass}
        })
    })

    let humanAtmosphere = ''
    let gameConfig = {}
    // Load game config data into state
    const storages = {}
    const storageTypes = {
        atmosphere: 'air_storage',
        food: 'food_storage',
        water: 'water_storage',
        nutrients: 'nutrient_storage',
        energy: 'power_storage',
    }
    Object.entries(game_config.agents).forEach(([agent_type, attributes]) => {
        // Agents can store more than 1 class of currencies; we add a 'storageType'
        // attribute which is an array of all the storageTypes it contains.
        const storageType = []
        Object.keys(attributes).forEach(field => {
            if (Object.keys(currencyDict).includes(field)) {
                const {currencyClass} = currencyDict[field]
                const storage = storageTypes[currencyClass]
                if (!storageType.includes(storage)) {
                    storageType.push(storage)
                    if (currencyClass === 'atmosphere' &&
                            agent_type.includes('habitat')) {
                        humanAtmosphere = agent_type
                    }
                }
            }
        })
        if (storageType.length) {
            storages[agent_type] = [{storageType, ...attributes}]
        }
    })
    if (!Object.keys(game_config).includes('storages')) {
        gameConfig = {...game_config, storages}
    } else {
        gameConfig = game_config
    }
    return {currencyDict, gameConfig, humanAtmosphere}
}

export default {
    state: {
        // parameters for the get_steps route
        parameters: {},
        agentCount: {1: {human_agent: 0}},
        agentGrowth: {},
        lastAgentGrowth: {},  // store the last non-null growth
        totalProduction: {},
        totalConsumption: {},
        storageRatio: {},
        storageCapacities: {},
        detailsPerAgent: {},
        maxStepBuffer: 0,      // the number of steps in the buffer
        currentStepBuffer: 0,  // the step the simulation is displaying
        stepInterval: 1000,    // the time between the steps, in milliseconds
        stopped: false,        // true if we forced termination, also set terminated
        terminated: false,     // true if we stopped or retrieved all steps from the server
        timerID: null,
        getStepsTimerID: null,
        isTimerRunning: false,
        isLive: false,  // live Dashboard variable, not "live mode"; if true change to live Timeline
        menuActive: false,
        leaveWithoutConfirmation: false,  // if true, don't ask confirmation while leaving
        loadFromSimData: false,  // if true, load from imported sim data, not from the server
        gameConfig: {},  // the full game_config returned by /new_game
        gameCurrencies: {},  // the active list of currencies, grouped by class
        currencyDict: {},  // all gameCurrencies not grouped, but with 'currencyClass' param added
        humanAtmosphere: 'air_storage',  // the storage humans breathe; TODO: Revert ABM Workaround
        activePanels: [],
        currentMode: '',
    },
    getters: {
        getMenuActive: state => state.menuActive,
        getLeaveWithoutConfirmation: state => state.leaveWithoutConfirmation,
        getLoadFromSimData: state => state.loadFromSimData,
        getStepParams: state => state.parameters,
        getMaxStepBuffer: state => state.maxStepBuffer,
        getCurrentStepBuffer: state => state.currentStepBuffer,
        getStepInterval: state => state.stepInterval,

        getStepNumber: state => state.stepNumber,
        getAgentType: state => stepNumber => state.agentCount[stepNumber],
        getAgentGrowth: state => stepNumber => state.agentGrowth[stepNumber],
        getTotalProduction: state => stepNumber => state.totalProduction[stepNumber],
        getTotalConsumption: state => stepNumber => state.totalConsumption[stepNumber],
        getStorageRatio: state => stepNumber => state.storageRatio[stepNumber],
        getAirStorageRatio: state => stepNumber => state.storageRatio[stepNumber].air_storage_1,
        getStorageCapacities: state => stepNumber => state.storageCapacities[stepNumber],
        getDetailsPerAgent: state => stepNumber => state.detailsPerAgent[stepNumber],

        getStopped: state => state.stopped,
        getTerminated: state => state.terminated,

        getUpdateTimer: state => state.updateTimer,
        getTimerID: state => state.timerID,
        getGetStepsTimerID: state => state.getStepsTimerID,
        getIsTimerRunning: state => state.isTimerRunning,
        getIsLive: state => state.isLive,
        getGameConfig: state => state.gameConfig,
        getGameCurrencies: state => state.gameCurrencies,
        getCurrencyDict: state => state.currencyDict,
        getHumanAtmosphere: state => state.humanAtmosphere,  // TODO: Revert ABM Workaround

        getActivePanels: state => state.activePanels,
        getCurrentMode: state => state.currentMode,
        // return a json obj that contains all the simulation data
        getSimulationData(state) {
            return {
                README: 'Format may vary, only import from the main menu.',
                game_config: state.gameConfig,
                steps: state.maxStepBuffer,
                parameters: state.parameters,
                total_consumption: state.totalConsumption,
                total_production: state.totalProduction,
                total_agent_count: state.agentCount,
                agent_growth: state.agentGrowth,
                storage_ratios: state.storageRatio,
                storage_capacities: state.storageCapacities,
                details_per_agent: state.detailsPerAgent,
            }
        },
    },
    mutations: {
        // restore simulation data returned by getSimulationData
        SETSIMULATIONDATA(state, value) {
            const {simdata, currency_desc} = value
            state.gameCurrencies = currency_desc

            // TODO: Revert ABM Workaround
            const game_vars = parse_updated_game_vars(simdata.game_config, currency_desc)
            const {humanAtmosphere, currencyDict, gameConfig} = game_vars
            state.humanAtmosphere = humanAtmosphere
            state.currencyDict = currencyDict
            state.gameConfig = gameConfig

            state.parameters = simdata.parameters
            state.totalConsumption = simdata.total_consumption
            state.totalProduction = simdata.total_production
            state.agentCount = simdata.total_agent_count
            state.agentGrowth = simdata.agent_growth
            state.storageRatio = simdata.storage_ratios
            state.storageCapacities = simdata.storage_capacities
            state.detailsPerAgent = simdata.details_per_agent
        },
        SETPARAMETERS(state, value) {
            state.parameters = value
        },
        // show the dashboard menu when true, hide it otherwise
        SETMENUACTIVE(state, value) {
            state.menuActive = value
        },
        SETLEAVEWITHOUTCONFIRMATION(state, value) {
            state.leaveWithoutConfirmation = value
        },
        // load from uploaded sim data when true, from the server if false
        SETLOADFROMSIMDATA(state, value) {
            state.loadFromSimData = value
        },


        // Starts the step timer. This object is actually created within the
        // DashboardView component on mounted. The timer is not started until the conditions
        // are met for a reasonable buffer amount.
        STARTTIMER(state, value) {
            // if((state.maxStepBuffer >= 100 || state.terminated ) && !state.isTimerRunning){
            // console.log("Step Timer running")
            state.timerID.resume()
            state.isTimerRunning = true
            // }
        },
        PAUSETIMER(state, value) {
            // console.log("Step Timer paused")
            state.timerID.pause()
            state.isTimerRunning = false
        },
        STOPTIMER(state, value) {
            if (state.timerID !== null) {
                // console.log("Step Timer stopped")
                state.timerID.stop()
            }
            state.isTimerRunning = false
        },
        SETTIMERID(state, value) {
            state.timerID = value
        },
        SETGETSTEPSTIMERID(state, value) {
            state.getStepsTimerID = value
        },

        SETSTOPPED(state, value) {
            // this var should be set only when we interrupt the
            // simulation before receiving all the steps
            state.stopped = value
            // if the sim has been stopped, it's also terminated
            // but it could terminate cleanly without being stopped
            state.terminated = value
        },

        SETTERMINATED(state, value) {
            state.terminated = value
        },
        // Is the step_timer already been created and running initiall?
        SETISTIMERRUNNING(state, value) {
            state.isTimerRunning = value
        },
        // Is the live Dashboard live? i.e. Is the stepInterval 0?
        SETISLIVE(state, value) {
            // console.log('SETISLIVE:', value)
            state.isLive = value
        },
        SETGAMEID(state, value) {
            state.parameters.game_id = value
        },
        // this is the full game_config returned by the backend after a /new_game
        SETGAMEPARAMS(state, value) {
            const {game_config, currency_desc} = value
            state.gameCurrencies = currency_desc

            // TODO: Revert ABM Workaround
            const game_vars = parse_updated_game_vars(game_config, currency_desc)
            const {humanAtmosphere, currencyDict, gameConfig} = game_vars
            state.humanAtmosphere = humanAtmosphere
            state.currencyDict = currencyDict
            state.gameConfig = gameConfig
        },
        SETMINSTEPNUMBER(state, value) {
            state.parameters.min_step_num = value
        },
        // This is used for the starting step of get_step batches. Updated after every get_step call
        UPDATEMINSTEPNUMBER(state, value) {
            const {step_num: step} = value
            state.parameters.min_step_num = Math.max(step+1, state.parameters.min_step_num)
        },
        // This is used for the number of steps to grab from get_step_to,
        // after 100 steps have been buffered, . Updated after every get_step call
        SETNSTEPS(state, value) {
            state.parameters.n_steps = state.maxStepBuffer > 100 ? 100 : 10
        },
        // unconditionally set the maxStepBuffer
        SETBUFFERMAX(state, value) {
            state.maxStepBuffer = value
        },
        // conditionally update maxStepBuffer
        UPDATEBUFFERMAX(state, value) {
            const {step_num: step} = value
            state.maxStepBuffer = Math.max(step, state.maxStepBuffer)
        },
        // unconditionally set the currentStepBuffer
        SETBUFFERCURRENT(state, value) {
            state.currentStepBuffer = value
        },
        // update the currentStepBuffer, making sure it's <= maxStepBuffer
        UPDATEBUFFERCURRENT(state, value) {
            state.currentStepBuffer = Math.max(1, Math.min(value, state.maxStepBuffer))
        },
        SETSTEPINTERVAL(state, value) {
            state.stepInterval = value
            if (state.timerID !== null) {
                state.timerID.changeInterval(state.stepInterval)
            }
        },
        SETAGENTTYPE(state, value) {
            const {step_num: step} = value
            const {total_agent_count} = value
            state.agentCount[step] = total_agent_count
        },
        SETAGENTGROWTH(state, value) {
            const {step_num: step, agent_growth} = value
            // If the plant skips a step we get a null, indicating that it didn't grow.
            // Instead of storing null, reuse the last value stored in lastAgentGrowth
            Object.entries(agent_growth).forEach(([name, val]) => {
                if (val === null) {
                    if (name in state.lastAgentGrowth) {  // use last value
                        agent_growth[name] = state.lastAgentGrowth[name]
                    } else {  // no value available, use 0 instead
                        agent_growth[name] = 0
                        state.lastAgentGrowth[name] = 0
                    }
                } else {  // save the last non-null value
                    state.lastAgentGrowth[name] = val
                }
            })
            state.agentGrowth[step] = agent_growth
        },
        SETTOTALCONSUMPTION(state, value) {
            const {step_num: step} = value
            const {total_consumption} = value

            state.totalConsumption[step] = total_consumption
        },
        SETTOTALPRODUCTION(state, value) {
            const {step_num: step} = value
            const {total_production} = value

            state.totalProduction[step] = total_production
        },
        SETSTORAGERATIOS(state, value) {
            const {step_num: step} = value
            const {storage_ratios} = value

            state.storageRatio[step] = storage_ratios
        },
        SETSTORAGECAPACITIES(state, value) {
            const {step_num: step} = value
            const {storage_capacities} = value

            state.storageCapacities[step] = storage_capacities
        },
        SETDETAILSPERAGENT(state, value) {
            const {step_num: step} = value
            const {details_per_agent} = value

            state.detailsPerAgent[step] = details_per_agent
        },


        // Populates the parameters object with the selected plants from the
        // configuration wizard. This should actually called and updated similar to how the
        // wizard store updates its plants list on the fly.
        SETPLANTSPECIESPARAM(state, value) {
            const {plantSpecies} = value

            plantSpecies.forEach(item => {
                state.parameters.agent_growth.push(item.type)
                state.agentGrowth[item.type] = 0
            })
        },
        SETACTIVEPANELS(state, panels) {
            state.activePanels = panels
        },
        SETDEFAULTPANELS(state, mode) {
            state.activePanels = {
                sim: [
                    'MissionInfo', 'ProductionConsumption:kwh', 'StorageLevels',
                    'InhabitantsStatus', 'ProductionConsumption:co2', 'AtmosphericMonitors',
                ],
                live: [
                    'Sensors', 'AtmosphericCO2', 'AtmosphericO2', 'Temperature',
                ],
            }[mode]
        },
        // Set current mode
        SETCURRENTMODE(state, value) {
            state.currentMode = value
        },
        INITGAME(state, value) {
            // set a new game_id and reset all other values
            state.parameters = {
                // the game is set before reaching the dashboard and
                // resetting, so preserve its value
                game_id: value,
                min_step_num: 0,
                n_steps: 10,
                total_agent_count: ['human_agent'],
                agent_growth: [],
                total_production: ['co2', 'o2', 'potable', 'kwh'],
                total_consumption: ['co2', 'o2', 'potable', 'kwh'],
                // we now calculate the ratios on the frontend
                // "storage_ratios": {"air_storage_1": ["co2", "o2", "ch4",
                //                                     "n2", "h2", "h2o"],},
                storage_capacities: {}, // empty obj == get all values
                details_per_agent: {agent_types: [], // empty obj == get all agents
                                    currency_types: ['kwh', 'co2'],
                                    directions: ['in']},
                parse_filters: [],
                single_agent: 1,
            }
            state.agentGrowth = {}
            state.totalProduction = {}
            state.totalConsumption = {}
            state.storageRatio = {}
            state.storageCapacities = {}
            state.detailsPerAgent = {}
        },
    },
    actions: {
        parseStep({commit, dispatch}, stepData) {
            console.log(stepData)
            stepData.forEach(item => {
                commit('SETTOTALCONSUMPTION', item)
                commit('SETTOTALPRODUCTION', item)
                commit('SETAGENTTYPE', item)
                commit('SETAGENTGROWTH', item)
                commit('SETSTORAGERATIOS', item)
                commit('SETSTORAGECAPACITIES', item)
                commit('SETDETAILSPERAGENT', item)
                commit('UPDATEBUFFERMAX', item)
                commit('SETNSTEPS', item)
                commit('UPDATEMINSTEPNUMBER', item)
                // commit('SETTERMINATED',item)
            })
        },
    },
}
