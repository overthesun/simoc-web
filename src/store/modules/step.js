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
            state.agentGrowth = value
        },
        setTotalAgentCount(state, value) {
            const total_agent_count = {
                human_agent: value,
            }

            state.totalAgentCount = total_agent_count
        },
        setTotalProduction(state, value) {
            const total_production = {
                atmo_co2: {
                    value: value.atmo_co2,
                    unit: '1.0 kg',
                },
                atmo_o2: {
                    value: value.atmo_o2,
                    unit: '1.0 kg',
                },
                h2o_potb: {
                    value: value.h2o_potb,
                    unit: '1.0 kg',
                },
                enrg_kwh: {
                    value: value.enrg_kwh,
                    unit: '1.0 kWh',
                },
            }

            state.totalProduction = total_production
        },
        setTotalConsumption(state, value) {
            const total_consumption = {
                atmo_co2: {
                    value: value.atmo_co2,
                    unit: '1.0 kg',
                },
                atmo_o2: {
                    value: value.atmo_o2,
                    unit: '1.0 kg',
                },
                h2o_potb: {
                    value: value.h2o_potb,
                    unit: '1.0 kg',
                },
                enrg_kwh: {
                    value: value.enrg_kwh,
                    unit: '1.0 kWh',
                },
            }

            state.totalConsumption = total_consumption
        },
        setDetailsPerAgent(state, value) {
            const details_per_agent = {
                in: {
                    enrg_kwh: {
                        solid_waste_aerobic_bioreactor: {
                            value: value.solid_waste_aerobic_bioreactor,
                            unit: '1.0 kWh',
                        },
                        multifiltration_purifier_post_treatment: {
                            value: value.multifiltration_purifier_post_treatment,
                            unit: '1.0 kWh',
                        },
                        oxygen_generation_SFWE: {
                            value: value.oxygen_generation_SFWE,
                            unit: '1.0 kWh',
                        },
                        urine_recycling_processor_VCD: {
                            value: value.urine_recycling_processor_VCD,
                            unit: '1.0 kWh',
                        },
                        co2_removal_SAWD: {
                            value: value.co2_removal_SAWD,
                            unit: '1.0 kWh',
                        },
                        co2_reduction_sabatier: {
                            value: value.co2_reduction_sabatier,
                            unit: '1.0 kWh',
                        },
                        ch4_removal_agent: {
                            value: value.ch4_removal_agent,
                            unit: '1.0 kWh',
                        },
                        dehumidifier: {
                            value: value.dehumidifier,
                            unit: '1.0 kWh',
                        },
                        crew_habitat_small: {
                            value: value.crew_habitat_small,
                            unit: '1.0 kWh',
                        },
                    },
                    atmo_co2: {
                        co2_removal_SAWD: {
                            value: value.co2_removal_SAWD,
                            unit: '1.0 kWh',
                        },
                        co2_reduction_sabatier: {
                            value: value.co2_reduction_sabatier,
                            unit: '1.0 kWh',
                        },
                    },
                },
            }

            state.detailsPerAgent = details_per_agent
        },
        setStorageCapacities(state, value) {
            const storage_capacities = {
                air_storage: {
                    1: {
                        atmo_o2: {
                            value: value.atmo_o2,
                            unit: 'kg',
                        },
                        atmo_co2: {
                            value: value.atmo_co2,
                            unit: 'kg',
                        },
                        atmo_n2: {
                            value: value.atmo_n2,
                            unit: 'kg',
                        },
                        atmo_ch4: {
                            value: value.atmo_ch4,
                            unit: 'kg',
                        },
                        atmo_h2: {
                            value: value.atmo_h2,
                            unit: 'kg',
                        },
                        atmo_h2o: {
                            value: value.atmo_h2o,
                            unit: 'kg',
                        },
                    },
                },
                water_storage: {
                    1: {
                        h2o_potb: {
                            value: value.h2o_potb,
                            unit: 'kg',
                        },
                        h2o_urin: {
                            value: value.h2o_urin,
                            unit: 'kg',
                        },
                        h2o_wste: {
                            value: value.h2o_wste,
                            unit: 'kg',
                        },
                        h2o_tret: {
                            value: value.h2o_tret,
                            unit: 'kg',
                        },
                    },
                },
                nutrient_storage: {
                    1: {
                        biomass_totl: {
                            value: value.biomass_totl,
                            unit: 'kg',
                        },
                        sold_n: {
                            value: value.sold_n,
                            unit: 'kg',
                        },
                        sold_p: {
                            value: value.sold_p,
                            unit: 'kg',
                        },
                        sold_k: {
                            value: value.sold_k,
                            unit: 'kg',
                        },
                        sold_wste: {
                            value: value.sold_wste,
                            unit: 'kg',
                        },
                    },
                },
                power_storage: {
                    1: {
                        enrg_kwh: {
                            value: value.enrg_kwh,
                            unit: 'kWh',
                        },
                    },
                },
                food_storage: {
                    1: {
                        food_edbl: {
                            value: value.food_edbl,
                            unit: 'kg',
                        },
                    },
                },
            }

            state.storageCapacities = storage_capacities
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
