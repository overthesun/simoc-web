import {reactive} from 'vue'
import _ from 'lodash'

import {StepTimer} from '../javascript/stepTimer'

export const dashboardState = reactive({
    // Info
    gameId: null,

    // Time Control
    stepInterval: 1000,    // the time between the steps, in milliseconds
    isTimerRunning: false,
    timerId: null,
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

    // Step Buffer
    currentStepBuffer: 0,  // the step the simulation is displaying
    setCurrentStepBuffer(value) {
        this.currentStepBuffer = Math.min(Math.max(0, value), this.maxStepBuffer)
    },

    // Data Handling
    data: {},              // Initialize state empty
    maxStepBuffer: 0,      // the number of steps in the buffer
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
    getData(path, range=null) {
        // Return a subset of data using lodash path and (optional) range
        const fromPath = _.get(this.data, path)
        return range ? fromPath.slice(range[0], range[1]) : fromPath
    },
})
