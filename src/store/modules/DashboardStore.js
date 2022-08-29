/**
 * Dashboard Store (DashboardStore.js)
 *
 * Contains the shared state for all things related to the Dashboard and the parameters for the
 * get_step route.
 *
 * In-Depth
 * Step data: broken down into objects based on filter type.
 * These can be accessed via the getters below using the scrubber on the Timeline to select a step.
 * Object deconstruction is used to set the variables for the individual parts within the calling
 * methods for: agentCount | agentGrowth | totalProduction | totalConsumption | storageRatio
 *
 * currentStepBuffer/maxStepBuffer: indicate the current step in the buffer being visualized,
 * and the highest step in the buffer. A number of watcher functions within components reference
 * currentStepBuffer for updating various data points such as panels and charts.
 *
 * Timer ID: this is used to pause, resume, speed controls or kill the setTimeout object within.
 * See stepTimer.js in javascript folder for further details.
 *
 * Termination flag: Universally accessible point to check if the simulation has terminated.
 *
 * Versions
 * <  3.0 dashboard.js: Prior to version 3.0 this store managed state using Vuex. Vuex is no longer
 * the recommended solution for state management in a Vue application since around the launch of
 * Pinia. This older version included a utility function parse_updated_game_vars which was moved
 * into its own js file @/javascript/gameVars.js wrt maintaining the structure of the store.
 *
 * >= 3.0 DashboardStore.js: Versions 3.0 and beyond converts Vuex to Pinia. This version improves
 * readability of the store using Pinia conventions. It also improves accessibility to the store
 * via Pinia state management features. This version also introduces versioning and JSDoc to
 * standardize function documentation.
 *
 * @author Ezio Melotti, Grant Hawkins, Ryan Meneses
 * @version 3.0
 * @since August 20, 2022
 */
import {defineStore} from 'pinia'
import {parseUpdatedGameVars} from '@/javascript/gameVars'
import {StepTimer} from '@/javascript/stepTimer'
import {parseData} from '@/javascript/parseData'
import _ from 'lodash'

export const useDashboardStore = defineStore('DashboardStore', {
    state: () => ({
        parameters: {},  // parameters for the get_steps route
        agentCount: {1: {human_agent: 0}},
        agentGrowth: {},
        lastAgentGrowth: {},  // store the last non-null growth
        totalProduction: {},
        totalConsumption: {},
        storageRatio: {},
        storageCapacities: {},
        detailsPerAgent: {},
        stopped: false,        // true if we forced termination, also set terminated
        terminated: false,     // true if we stopped or retrieved all steps from the server
        getStepsTimerID: null,
        menuActive: false,
        leaveWithoutConfirmation: false,  // if true, don't ask confirmation while leaving
        loadFromSimData: false,  // if true, load from imported sim data, not from the server
        gameConfig: {},  // the full game_config returned by /new_game
        gameCurrencies: {},  // the active list of currencies, grouped by class
        currencyDict: {},  // all gameCurrencies not grouped, but with 'currencyClass' param added
        humanAtmosphere: 'air_storage',  // the storage humans breathe; TODO: Revert ABM Workaround
        activePanels: [],
        currentMode: '',

        // Time Control
        stepInterval: 1000,    // the time between the steps, in milliseconds
        isTimerRunning: false,
        timerId: null,

        // Data Handling
        data: {},              // Initialize state empty
        currentStepBuffer: 0,  // the step the simulation is displaying
        maxStepBuffer: 0,      // the number of steps in the buffer
    }),

    getters: {
        getAgentType: state => stepNumber => state.agentCount[stepNumber],
        getAgentGrowth: state => stepNumber => state.agentGrowth[stepNumber],
        getTotalProduction: state => stepNumber => state.totalProduction[stepNumber],
        getTotalConsumption: state => stepNumber => state.totalConsumption[stepNumber],
        getStorageRatio: state => stepNumber => state.storageRatio[stepNumber],
        getAirStorageRatio: state => stepNumber => state.storageRatio[stepNumber].air_storage_1,
        getStorageCapacities: state => stepNumber => state.storageCapacities[stepNumber],
        getDetailsPerAgent: state => stepNumber => state.detailsPerAgent[stepNumber],

        /**
         * Returns a json obj that contains all the simulation data.
         *
         * @param state
         */
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

    actions: {
        /**
         * Restore simulation data returned by getSimulationData.
         *
         * @param value
         */
        setSimulationData(value) {
            const {simdata, currency_desc} = value
            this.gameCurrencies = currency_desc

            // TODO: Revert ABM Workaround
            const game_vars = parseUpdatedGameVars(simdata.game_config, currency_desc)
            const {humanAtmosphere, currencyDict, gameConfig} = game_vars
            this.humanAtmosphere = humanAtmosphere
            this.currencyDict = currencyDict
            this.gameConfig = gameConfig

            this.parameters = simdata.parameters
            this.totalConsumption = simdata.total_consumption
            this.totalProduction = simdata.total_production
            this.agentCount = simdata.total_agent_count
            this.agentGrowth = simdata.agent_growth
            this.storageRatio = simdata.storage_ratios
            this.storageCapacities = simdata.storage_capacities
            this.detailsPerAgent = simdata.details_per_agent
        },

        // Time Control
        initTimer() {
            // initialize and return the step timer that updates the
            // current step and triggers watchers that update the panels
            this.stopTimer()
            this.timerId = new StepTimer(() => {
                // increment the step only if we have enough buffered steps
                // TODO (old) check the number of steps requests so we can still
                // run simulations with a number of steps <= the limit
                if (this.maxStepBuffer >= 30) {
                    this.setCurrentStepBuffer(this.currentStepBuffer + 1)
                }
            }, this.stepInterval)
            this.startTimer()
        },
        startTimer() {
            this.timerId.resume()
            this.isTimerRunning = true
        },
        pauseTimer() {
            this.timerId.pause()
            this.isTimerRunning = false
        },
        stopTimer() {
            if (this.timerId !== null) {
                this.timerId.stop()
            }
            this.isTimerRunning = true
        },
        setStepInterval(value) {
            this.stepInterval = value
            if (this.timerId !== null) {
                this.timerId.changeInterval(this.stepInterval)
            }
        },

        // Data Handling
        setCurrentStepBuffer(value) {
            this.currentStepBuffer = Math.min(Math.max(0, value), this.maxStepBuffer)
        },
        parseStep(value) {
            const {
                game_id,       // Same for each batch
                n_steps,       // N steps contained in this batch
                step_num,      // Latest step sent
                ...agent_data  // Agent-specific data
            } = value
            if (!this.gameId) {
                this.gameId = game_id
            }
            console.log(`Received ${n_steps} new steps (${step_num} total).`)
            this.maxStepBuffer = step_num

            // For arrays (timeseries data), concatenate value to state
            /* eslint-disable consistent-return */
            _.mergeWith(this.data, agent_data, (a, b) => {
                // Define custom handler to for arrays
                if (_.isArray(a)) {
                    return a.concat(b)
                }
                // Others types are overwritten
            })
        },
        getData(path) {
            // Return a subset of data from path
            return parseData(this.data, path)
        },

        /**
         * Stops and terminates the simulation if the sim is interrupted before receiving all steps.
         *
         * @param value
         */
         setStopped(value) {
            // this var should be set only when we interrupt the
            // simulation before receiving all the steps
            this.stopped = value
            // if the sim has been stopped, it's also terminated
            // but it could terminate cleanly without being stopped
            this.terminated = value
        },
        /**
         * Accesses game_id key in parameters and sets it to id.
         *
         * @param id
         */
        setGameId(id) {
            this.parameters.game_id = id
        },
        /**
         * Sets all game parameters from the full game_config returned by the backend after a
         * /new_game.
         *
         * @param config
         */
        setGameParams(config) {
            const {game_config, currency_desc} = config
            this.gameCurrencies = currency_desc

            // TODO: Revert ABM Workaround
            const game_vars = parseUpdatedGameVars(game_config, currency_desc)
            const {humanAtmosphere, currencyDict, gameConfig} = game_vars
            this.humanAtmosphere = humanAtmosphere
            this.currencyDict = currencyDict
            this.gameConfig = gameConfig
        },

        /**
         * Accesses min_step_num key in parameters and sets it to min.
         *
         * @param min
         */
        setMinStepNumber(min) {
            this.parameters.min_step_num = min
        },
        /**
         * Used for the starting step of get_step batches. Updated after every get_step call.
         *
         * @param min
         */
        updateMinStepNumber(min) {
            const {step_num: step} = min
            this.parameters.min_step_num = Math.max(step+1, this.parameters.min_step_num)
        },
        /**
         * Used for the number of steps to grab from get_step_to, after 100 steps have been
         * buffered. Updated after every get_step call.
         */
        setNSteps() {
            this.parameters.n_steps = this.maxStepBuffer > 100 ? 100 : 10
        },


        /**
         * Sets the agent type.
         *
         * @param value
         */
        setAgentType(value) {
            const {step_num: step} = value
            const {total_agent_count} = value
            this.agentCount[step] = total_agent_count
        },
        /**
         * Sets the agent growth.
         *
         * @param value
         */
        setAgentGrowth(value) {
            const {step_num: step, agent_growth} = value
            // If the plant skips a step we get a null, indicating that it didn't grow.
            // Instead of storing null, reuse the last value stored in lastAgentGrowth
            Object.entries(agent_growth).forEach(([name, val]) => {
                if (val === null) {
                    if (name in this.lastAgentGrowth) {  // use last value
                        agent_growth[name] = this.lastAgentGrowth[name]
                    } else {  // no value available, use 0 instead
                        agent_growth[name] = 0
                        this.lastAgentGrowth[name] = 0
                    }
                } else {  // save the last non-null value
                    this.lastAgentGrowth[name] = val
                }
            })
            this.agentGrowth[step] = agent_growth
        },

        /**
         * Sets the total consumption.
         *
         * @param value
         */
        setTotalConsumption(value) {
            const {step_num: step} = value
            const {total_consumption} = value

            this.totalConsumption[step] = total_consumption
        },
        /**
         * Sets the total production.
         *
         * @param value
         */
        setTotalProduction(value) {
            const {step_num: step} = value
            const {total_production} = value

            this.totalProduction[step] = total_production
        },
        /**
         * Sets the storage ratios.
         *
         * @param value
         */
        setStorageRatios(value) {
            const {step_num: step} = value
            const {storage_ratios} = value

            this.storageRatio[step] = storage_ratios
        },
        /**
         * Sets the storage capacities.
         *
         * @param value
         */
        setStorageCapacities(value) {
            const {step_num: step} = value
            const {storage_capacities} = value

            this.storageCapacities[step] = storage_capacities
        },
        /**
         * Sets details per agent.
         *
         * @param value
         */
        setDetailsPerAgent(value) {
            const {step_num: step} = value
            const {details_per_agent} = value

            this.detailsPerAgent[step] = details_per_agent
        },

        /**
         * Populates the parameters object with the selected plants from the configuration wizard.
         * This is called and updated similar to how the wizard store updates its plants list on the
         * fly.
         *
         * @param value
         */
        setPlantSpeciesParam(value) {
            const {plantSpecies} = value

            plantSpecies.forEach(item => {
                this.parameters.agent_growth.push(item.type)
                this.agentGrowth[item.type] = 0
            })
        },
        /**
         * Sets the default panels.
         *
         * @param mode
         */
        setDefaultPanels(mode) {
            this.activePanels = {
                sim: [
                    'MissionInfo', 'ProductionConsumption:kwh', 'StorageLevels',
                    'InhabitantsStatus', 'ProductionConsumption:co2', 'AtmosphericMonitors',
                ],
            }[mode]
        },
        /**
         * Initializes a new game. Constructs the parameters state variable and initializes
         * the agent objects to empty objects.
         *
         * @param value
         */
        initGame(value) {
        // set a new game_id and reset all other values
            this.parameters = {
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
            this.agentGrowth = {}
            this.totalProduction = {}
            this.totalConsumption = {}
            this.storageRatio = {}
            this.storageCapacities = {}
            this.detailsPerAgent = {}
        },
    },
})
