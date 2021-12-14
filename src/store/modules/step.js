/**
 * step (step.js)
 *
 * This file contains the state for each step data.
 *
 * Raw sensor data is sent from the backend simoc-sam. The data received is sorted here into
 * step data that the dashboard can read. The function parseData is responsible for sorting the
 * raw data into the proper state variable.
 *
 * A stepData object can be received with the getter getStepData. A batch of stepData objects can
 * be received with the getter getStepBatch.
 *
 * The stepBatch may be received from the Dashboard (Dashboard.vue) and passed to parseStep in
 * the dashboard store (dashboard.js).
 *
 * @author Ryan Meneses
 * @version 1.0
 * @since December 13, 2021
 */
export default {
    // TODO: Remove unnecessary state variables and their associated setters and getters
    state: {
        id: 0, // Might not need
        stepNum: 0,
        userId: 0, // Might not need
        gameId: 0, // Might not need
        startTime: 0, // Might not need
        time: 0, // Might be more useful in another form e.g. {h: 0, m: 0, s: 0}
        hoursPerStep: 1,
        isTerminated: false, // Might not need
        terminationReason: null, // Might not need
        agentGrowth: {}, // Might not need
        totalAgentCount: {},
        totalProduction: {},
        totalConsumption: {},
        detailsPerAgent: {},
        storageCapacities: {},
        stepData: {},
        stepBatch: [],
    },
    getters: {
        getId: state => state.id,
        getStepNum: state => state.stepNum,
        getUserId: state => state.userId,
        getGameId: state => state.gameId,
        getStartTime: state => state.startTime,
        getTime: state => state.time,
        getHoursPerStep: state => state.hoursPerStep,
        getIsTerminated: state => state.isTerminated,
        getTerminationReason: state => state.terminationReason,
        getAgentGrowth: state => state.agentGrowth,
        getTotalAgentCount: state => state.totalAgentCount,
        getTotalProduction: state => state.totalProduction,
        getTotalConsumption: state => state.totalConsumption,
        getDetailsPerAgent: state => state.detailsPerAgent,
        getStorageCapacities: state => state.storageCapacities,
        getStepData(state) {
            return {
                id: state.id,
                step_num: state.stepNum,
                user_id: state.userId,
                game_id: state.gameId,
                start_time: state.startTime,
                time: state.time,
                hours_per_step: state.hoursPerStep,
                is_terminated: state.isTerminated,
                termination_reason: state.terminationReason,
                agent_growth: state.agentGrowth,
                total_agent_count: state.totalAgentCount,
                total_production: state.totalProduction,
                total_consumption: state.totalConsumption,
                details_per_agent: state.detailsPerAgent,
                storage_capacities: state.storageCapacities,
            }
        },
        getStepBatch: state => state.stepBatch,
    },
    mutations: {
        setId(state, value) {
            state.id = value
        },
        setStepNum(state, value) {
            state.stepNum = value
        },
        setUserId(state, value) {
            state.userId = value
        },
        setGameId(state, value) {
            state.gameId = value
        },
        setStartTime(state, value) {
            state.startTime = value
        },
        setTime(state, value) {
            state.time = value
        },
        setHoursPerStep(state, value) {
            state.hoursPerStep = value
        },
        setIsTerminated(state, value) {
            state.isTerminated = value
        },
        setTerminationReason(state, value) {
            state.terminationReason = value
        },
        setAgentGrowth(state, value) {
            // TODO: Build object based on step_data extracted from a sim
            state.agentGrowth = value
        },
        setTotalAgentCount(state, value) {
            // TODO: Build object based on step_data extracted from a sim
            state.totalAgentCount = value
        },
        setTotalProduction(state, value) {
            // TODO: Build object based on step_data extracted from a sim
            state.totalProduction = value
        },
        setTotalConsumption(state, value) {
            // TODO: Build object based on step_data extracted from a sim
            state.totalConsumption = value
        },
        setDetailsPerAgent(state, value) {
            // TODO: Build object based on step_data extracted from a sim
            state.detailsPerAgent = value
        },
        setStorageCapacities(state, value) {
            // TODO: Build object based on step_data extracted from a sim
            state.storageCapacities = value
        },
        setStepBatch(state, value) {
            // TODO: Add schema verification to ensure stepData is properly formatted
            state.stepBatch.push(state.stepData)
        },
    },
    actions: {
        parseData({commit, dispatch}, data) {
            console.log(data)
            data.forEach(item => {
                // TODO: Parse sensor data and sort into designated state variables
            })
        },
    },
}
