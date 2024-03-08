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
 * isLive: Different from but applies only to live-mode, isLive variable determines which Timeline
 * visualization and buttons are available between the PlayButton and LiveButton components. If
 * true, a red Timeline is presented with the tag LIVE next to the PlayButton indicating the
 * Dashboard is live, else, a green Timeline appears with a circle button, PlayButton, replacing the
 * LIVE tag indicating the Timeline is not live. Note that when LiveButton is pressed, the Resume
 * button is replaced with the Pause button. This takes advantage of the getIsTimerRunning variable
 * above that is updated when the timer is running which is in the template of the PlayButton
 * component.
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
import {StepTimer} from '../../javascript/stepTimer'
import {parseData} from '../../javascript/parseData'

export const useDashboardStore = defineStore('DashboardStore', {
    state: () => ({
        // Game Management
        currentMode: '',  // either 'sim' or 'live'
        kioskMode: false,  // if true, enable kiosk mode
        simLocation: 'mars',
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
        isLive: false,  // live Dashboard variable, not "live mode"; if true change to live Timeline
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
                gameConfig: state.gameConfig,
                steps: state.maxStepBuffer,
                parameters: state.parameters,
                data: state.data,
                currencyDict: state.currencyDict,
                humanAtmosphere: state.humanAtmosphere,
            }
        },
        getLayoutName(state) {
            // return the panel layout name, either `sim:mars`, `sim:b2`, or `live`
            if (state.currentMode === 'sim') {
                return `${state.currentMode}:${state.simLocation}`
            } else {
                return state.currentMode
            }
        },
    },

    actions: {
        /**
         * Restore simulation data returned by getSimulationData.
         *
         * @param value
         */
        setSimulationData(simdata) {
            const {gameConfig, steps, parameters, data, currencyDict, humanAtmosphere} = simdata
            this.gameConfig = gameConfig
            this.maxStepBuffer = steps
            this.parameters = parameters
            this.data = data
            this.currencyDict = currencyDict
            this.humanAtmosphere = humanAtmosphere
        },

        // Time Control
        initTimer() {
            // initialize and return the step timer that updates the
            // current step and triggers watchers that update the panels
            this.stopTimer()
            this.timerId = new StepTimer(() => {
                // only start incrementing steps once we have some
                if (this.maxStepBuffer > 0) {
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
                game_id,
                n_steps,       // N steps contained in this batch
                step_num,      // List of steps contained in this batch
                agents,        // Agent-specific data
            } = value
            if (!this.gameId) {
                this.gameId = game_id
            }
            const latest_step_num = step_num[step_num.length - 1]
            console.log(`Received ${n_steps} new steps (${latest_step_num} total).`)
            this.maxStepBuffer = latest_step_num

            // For arrays (timeseries data), concatenate value to state
            /* eslint-disable consistent-return */
            _.mergeWith(this.data, agents, (a, b) => {
                // Define custom handler to for arrays
                if (_.isArray(a)) {
                    return a.concat(b)
                }
                // Others types are overwritten
            })

            // Keep up to date in case of disconnect/reconnect
            this.updateMinStepNumber(latest_step_num)
        },
        parseAttributes(attributes) {
            // Split list of attributes names into three categories
            const output = {growth: [], deprive: [], attributes: []}
            const plantGrowthAttrs = ['grown', 'par_factor', 'growth_rate', 'cu_factor',
                                      'te_factor']
            attributes.forEach(a => {
                if (a.includes('deprive')) {
                    output.deprive.push(a)
                } else if (a.includes('growth') || plantGrowthAttrs.includes(a)) {
                    output.growth.push(a)
                } else {
                    output.attributes.push(a)
                }
            })
            // Return non-empty fields of output
            Object.keys(output).forEach(k => {
                if (output[k].length === 0) {
                    delete output[k]
                }
            })
            return output
        },
        getData(path) {
            if (Object.keys(this.data).length === 0) {
                // If data is empty, return undefined. If the last element of path
                // is a range, return an array of undefineds of the correct length.
                const index = path[path.length - 1]
                if (typeof index === 'string' && index !== '*') {
                    const [start, end] = index.split(':').map(Number)
                    return Array(end - start)
                } else {
                    return undefined
                }
            } else {
                // Return a subset of data from path
                return parseData(this.data, path)
            }
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
        setGameParams(game_config) {
            this.gameConfig = game_config
            this.currencyDict = game_config.currencies
            if (Object.keys(game_config.agents).includes('human')) {
                this.humanAtmosphere = game_config.agents.human.flows.in.o2.connections[0]
            }
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
            this.parameters.min_step_num = Math.max(min, this.parameters.min_step_num)
        },

        setDefaultPanels(layout) {
            this.activePanels = {
                'sim:mars': [
                    'MissionInfo', 'ProductionConsumption:kwh', 'StorageLevels',
                    'InhabitantsStatus', 'ProductionConsumption:co2', 'AtmosphericMonitors',
                ],
                'sim:b2': [
                    'MissionInfo', 'Concrete', 'StorageLevels',
                    'InhabitantsStatus', 'ProductionConsumption:co2', 'AtmosphericMonitors',
                ],
                // Sensors is duplicated so there's more room to see the values of all sensors
                'live': [
                    'Sensors', 'AtmosphericCO2', 'LiveSensors',
                    'Sensors', 'Temperature', 'RelativeHumidity',
                ],
            }[layout]
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
            this.data = {}
        },
        getUnit(currency) {
            const desc = this.currencyDict[currency]
            if (desc?.unit) {
                return desc.unit
            } else {
                console.log(`Missing units for currency ${currency}, using kg`)
                return 'kg'
            }
        },
    },
})
