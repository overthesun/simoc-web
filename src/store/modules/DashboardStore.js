/**
 * Dashboard Store (DashboardStore.js)
 *
 * Contains the shared state for all things related to the Dashboard and the parameters for the
 * get_step route.
 *
 * In-Depth
 * Step data: stored as timeseries arrays in a nested Object in 'dashboard.data'.
 * These can be accessed with the 'getData' function, which accepts a lodash-style
 * path and returns the data in the appropriate format. The data structure follows
 * the 'Model Data' format described in:
 *   https://simoc.space/docs/user_guide/api/data-objects.html#model-data
 *
 * Examples:
 *  - Number of radishes: getData(['radish', 'amount', this.currentStepBuffer])
 *  - All o2 exchanges: getData(['*', 'flows', 'o2', 'SUM', this.currentStepBuffer])
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
import _ from 'lodash'
import {parseUpdatedGameVars} from '../../javascript/gameVars'
import {StepTimer} from '../../javascript/stepTimer'
import {parseData} from '../../javascript/parseData'

export const useDashboardStore = defineStore('DashboardStore', {
    state: () => ({
        // Game Management
        currentMode: '',
        activePanels: [],
        loadFromSimData: false,  // if true, load from imported sim data, not from the server
        terminated: false,       // true if we stopped or retrieved all steps from the server
        stopped: false,          // true if we forced termination, also set terminated
        getStepsTimerID: null,
        menuActive: false,
        leaveWithoutConfirmation: false,  // if true, don't ask confirmation while leaving

        // Time Control
        stepInterval: 1000,    // the time between the steps, in milliseconds
        isTimerRunning: false,
        timerId: null,

        // Data Handling
        parameters: {},  // parameters for the get_steps route
        gameConfig: {},  // the full game_config returned by /new_game
        gameCurrencies: {},  // the active list of currencies, grouped by class
        currencyDict: {},  // all gameCurrencies not grouped, but with 'currencyClass' param added
        humanAtmosphere: 'air_storage',  // the storage humans breathe; TODO: Revert ABM Workaround
        data: {},              // holds all step data; access with getData
        currentStepBuffer: 0,  // the step the simulation is displaying
        maxStepBuffer: 0,      // the number of steps in the buffer
    }),

    getters: {

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
                data: state.data,
            }
        },
    },

    actions: {
        /**
         * Restore simulation data returned by getSimulationData.
         *
         * @param value
         */
        setSimulationData({simdata, currency_desc}) {
            this.gameCurrencies = currency_desc   // TODO: Duplicated by currencyDict
            this.maxStepBuffer = simdata.steps
            this.parameters = simdata.parameters  // TODO: Unnecessary with websocket
            this.data = simdata.data

            // TODO: Revert ABM Workaround
            const game_vars = parseUpdatedGameVars(simdata.game_config, currency_desc)
            const {humanAtmosphere, currencyDict, gameConfig} = game_vars
            this.humanAtmosphere = humanAtmosphere
            this.currencyDict = currencyDict
            this.gameConfig = gameConfig          // TODO: Use only one copy of config
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
            this.currentStepBuffer = Math.min(Math.max(1, value), this.maxStepBuffer)
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
        resetData() {
            // Erase data from previous run
            this.data = {}
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
                kiosk: [
                    'MissionInfo', 'ThreeDPanel', 'InhabitantsStatus',
                    'ProductionConsumption:kwh', 'AtmosphericMonitors', 'StorageLevels',
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
                min_step_num: 0,  // Only supported value
                n_steps: 10,
            }
        },
    },
})
