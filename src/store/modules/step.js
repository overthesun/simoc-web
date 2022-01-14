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
 * @version 2.1
 * @since December 13, 2021
 */
export default {
    // TODO: Remove unnecessary state variables and their associated setters and getters
    state: {
        // mission options and metadata state variables
        id: 0, // Might not need
        stepNum: 0,
        userId: 0, // Might not need
        gameId: 0, // Might not need
        startTime: 0, // Might not need
        time: 0, // Might be more useful in another form e.g. {h: 0, m: 0, s: 0}
        hoursPerStep: 1,
        isTerminated: false, // Might not need
        terminationReason: null, // Might not need

        // containers for atomic state variables
        agentGrowth: {}, // Might not need
        totalAgentCount: {},
        totalProduction: {},
        totalConsumption: {},
        detailsPerAgent: {},
        storageCapacities: {},

        // details_per_agent atomic state variables
        solidWasteAerobicBioreactor: {value: 0, unit: 'kWh'},
        multifiltrationPurifierPostTreatment: {value: 0, unit: 'kWh'},
        oxygenGenerationSFWE: {value: 0, unit: 'kWh'},
        urineRecyclingProcessorVCD: {value: 0, unit: 'kWh'},
        co2RemovalSAWD: {value: 0, unit: 'kWh'},
        co2ReductionSabatier: {value: 0, unit: 'kWh'},
        ch4RemovalAgent: {value: 0, unit: 'kWh'},
        dehumidifier: {value: 0, unit: 'kWh'},
        crewHabitat: {value: 0, unit: 'kWh'},

        // air_storage atomic state variables
        atmoO2: {value: 0, unit: 'kg'},
        atmoCO2: {value: 0, unit: 'kg'},
        atmoN2: {value: 0, unit: 'kg'},
        atmoCH4: {value: 0, unit: 'kg'},
        atmoH2: {value: 0, unit: 'kg'},
        atmoH2O: {value: 0, unit: 'kg'},
        atmoHum: {value: 0, unit: '%'},
        atmoTemp: {value: 0, unit: 'C°'},

        // water_storage atomic state variables
        h2oPotb: {value: 0, unit: 'kg'},
        h2oUrin: {value: 0, unit: 'kg'},
        h2oWste: {value: 0, unit: 'kg'},
        h2oTret: {value: 0, unit: 'kg'},

        // nutrient_storage atomic state variables
        biomassTotl: {value: 0, unit: 'kg'},
        soldN: {value: 0, unit: 'kg'},
        soldP: {value: 0, unit: 'kg'},
        soldK: {value: 0, unit: 'kg'},
        soldWste: {value: 0, unit: 'kg'},

        // power_storage atomic state variables
        enrgKwh: {value: 0, unit: 'kWh'},

        // food_storage atomic state variables
        foodEdbl: {value: 0, unit: 'kg'},

        // step_data of atomic state variable containers
        stepData: null,
        stepBatch: [],
    },
    getters: {
        // mission options and metadata state variable getters
        getId: state => state.id,
        getStepNum: state => state.stepNum,
        getUserId: state => state.userId,
        getGameId: state => state.gameId,
        getStartTime: state => state.startTime,
        getTime: state => state.time,
        getHoursPerStep: state => state.hoursPerStep,
        getIsTerminated: state => state.isTerminated,
        getTerminationReason: state => state.terminationReason,

        // plant and human_agent getters
        getAgentGrowth: state => state.agentGrowth,
        getTotalAgentCount: state => state.totalAgentCount,

        // atomic container getters returns dictionaries in proper format
        getTotalProduction(state) {
            return {
                atmo_co2: state.atmoCO2,
                atmo_o2: state.atmoO2,
                h2o_potb: state.h2oPotb,
                enrg_kwh: state.enrgKwh,
            }
        },
        getTotalConsumption(state) {
            return {
                atmo_co2: state.atmoCO2,
                atmo_o2: state.atmoO2,
                h2o_potb: state.h2oPotb,
                enrg_kwh: state.enrgKwh,
            }
        },
        getDetailsPerAgent(state) {
            return {
                in: {
                    enrg_kwh: {
                        solid_waste_aerobic_bioreactor: state.solidWasteAerobicBioreactor,
                        // eslint-disable-next-line max-len,vue/max-len
                        multifiltration_purifier_post_treatment: state.multifiltrationPurifierPostTreatment,
                        oxygen_generation_SFWE: state.oxygenGenerationSFWE,
                        urine_recycling_processor_VCD: state.urineRecyclingProcessorVCD,
                        co2_removal_SAWD: state.co2RemovalSAWD,
                        co2_reduction_sabatier: state.co2ReductionSabatier,
                        ch4_removal_agent: state.ch4RemovalAgent,
                        dehumidifier: state.dehumidifier,
                        crew_habitat_small: state.crewHabitat,
                    },
                    atmo_co2: {
                        co2_removal_SAWD: state.co2RemovalSAWD,
                        co2_reduction_sabatier: state.co2ReductionSabatier,
                    },
                },
            }
        },
        getStorageCapacities(state) {
            return {
                air_storage: {
                    1: {
                        atmo_o2: state.atmoO2,
                        atmo_co2: state.atmoCO2,
                        atmo_n2: state.atmoN2,
                        atmo_ch4: state.atmoCH4,
                        atmo_h2: state.atmoH2,
                        atmo_h2o: state.atmoH2O,
                    },
                },
                water_storage: {
                    1: {
                        h2o_potb: state.h2oPotb,
                        h2o_urin: state.h2oUrin,
                        h2o_wste: state.h2oWste,
                        h2o_tret: state.h2oTret,
                    },
                },
                nutrient_storage: {
                    1: {
                        biomass_totl: state.biomassTotl,
                        sold_n: state.soldN,
                        sold_p: state.soldP,
                        sold_k: state.soldK,
                        sold_wste: state.soldWste,
                    },
                },
                power_storage: {
                    1: {
                        enrg_kwh: state.enrgKwh,
                    },
                },
                food_storage: {
                    1: {
                        food_edbl: state.foodEdbl,
                    },
                },
            }
        },

        // atomic state getters
        getAtmoO2: state => state.atmoO2,
        getAtmoCO2: state => state.atmoCO2,
        getAtmoN2: state => state.atmoN2,
        getAtmoCH4: state => state.atmoCH4,
        getAtmoH2: state => state.atmoH2,
        getAtmoH2O: state => state.atmoH2O,
        getAtmoHum: state => state.atmoHum,
        getAtmoTemp: state => state.atmoTemp,

        // step_data getters
        getStepData(state, getters) {
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
                total_production: getters.getTotalProduction,
                total_consumption: getters.getTotalConsumption,
                details_per_agent: getters.getDetailsPerAgent,
                storage_capacities: getters.getStorageCapacities,
            }
        },
        getStepBatch: state => state.stepBatch,
    },
    mutations: {
        // mission options and metadata state variable mutators
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

        // plant and human_agent mutators
        setAgentGrowth(state, value) {
            state.agentGrowth = value
        },
        setTotalAgentCount(state, value) {
            state.totalAgentCount = {
                human_agent: value,
            }
        },

        // atomic state variable mutators
        // -- details_per_agent --
        setSolidWasteAerobicBioreactor(state, value) {
            state.solidWasteAerobicBioreactor = {
                value: value,
                unit: 'kWh',
            }
        },
        setMultifiltrationPurifierPostTreatment(state, value) {
            state.multifiltrationPurifierPostTreatment = {
                value: value,
                unit: 'kWh',
            }
        },
        setOxygenGenerationSFWE(state, value) {
            state.oxygenGenerationSFWE = {
                value: value,
                unit: 'kWh',
            }
        },
        setUrineRecyclingProcessorVCD(state, value) {
            state.urineRecyclingProcessorVCD = {
                value: value,
                unit: 'kWh',
            }
        },
        setCO2RemovalSAWD(state, value) {
            state.co2RemovalSAWD = {
                value: value,
                unit: 'kWh',
            }
        },
        setCO2ReductionSabatier(state, value) {
            state.co2ReductionSabatier = {
                value: value,
                unit: 'kWh',
            }
        },
        setCH4RemovalAgent(state, value) {
            state.ch4RemovalAgent = {
                value: value,
                unit: 'kWh',
            }
        },
        setDehumidifier(state, value) {
            state.dehumidifier = {
                value: value,
                unit: 'kWh',
            }
        },
        setCrewHabitat(state, value) {
            state.crewHabitat = {
                value: value,
                unit: 'kWh',
            }
        },
        // -- air_storage --
        setAtmoO2(state, value) {
            state.atmoO2 = {
                value: value,
                unit: 'kg',
            }
        },
        setAtmoCO2(state, value) {
            state.atmoCO2 = {
                value: value,
                unit: 'kg',
            }
        },
        setAtmoN2(state, value) {
            state.atmoN2 = {
                value: value,
                unit: 'kg',
            }
        },
        setAtmoCH4(state, value) {
            state.atmoCH4 = {
                value: value,
                unit: 'kg',
            }
        },
        setAtmoH2(state, value) {
            state.atmoH2 = {
                value: value,
                unit: 'kg',
            }
        },
        setAtmoH2O(state, value) {
            state.atmoH2O = {
                value: value,
                unit: 'kg',
            }
        },
        setAtmoHum(state, value) {
            state.atmoHum = {
                value: value,
                unit: '%',
            }
        },
        setAtmoTemp(state, value) {
            state.atmoTemp = {
                value: value,
                unit: 'C°',
            }
        },
        // -- water_storage --
        setH2OPotb(state, value) {
            state.h2oPotb = {
                value: value,
                unit: 'kg',
            }
        },
        setH2OUrin(state, value) {
            state.h2oUrin = {
                value: value,
                unit: 'kg',
            }
        },
        setH2OWste(state, value) {
            state.h2oWste = {
                value: value,
                unit: 'kg',
            }
        },
        setH2OTret(state, value) {
            state.h2oTret = {
                value: value,
                unit: 'kg',
            }
        },
        // -- nutrient_storage --
        setBiomassTotl(state, value) {
            state.biomassTotl = {
                value: value,
                unit: 'kg',
            }
        },
        setSoldN(state, value) {
            state.soldN = {
                value: value,
                unit: 'kg',
            }
        },
        setSoldP(state, value) {
            state.soldP = {
                value: value,
                unit: 'kg',
            }
        },
        setSoldK(state, value) {
            state.soldK = {
                value: value,
                unit: 'kg',
            }
        },
        setSoldWste(state, value) {
            state.soldWste = {
                value: value,
                unit: 'kg',
            }
        },
        // -- power_storage --
        setEnrgKwh(state, value) {
            state.enrgKwh = {
                value: value,
                unit: 'kWh',
            }
        },
        // -- food_storage --
        setFoodEdbl(state, value) {
            state.foodEdbl = {
                value: value,
                unit: 'kg',
            }
        },

        // step_data mutators
        // stepBatch mutator pushes new step_data onto an array
        setStepBatch(state, value) {
            console.log('Adding step data to batch...')
            console.log(value)

            state.stepBatch.push(value)
        },
    },
    actions: {
        parseData({commit, getters}, data) {
            console.log(data)
            data.forEach(item => {
                let newStepData = true
                Object.keys(item).forEach(value => {
                    switch (value) {
                        case 'step_num':
                            // console.log(`step_num[${item.step_num}]:  ${item.step_num}`)
                            commit('setStepNum', item.step_num)
                            break
                        case 'co2_ppm':
                            // console.log(`co2_ppm[${item.step_num}]:   ${item.co2_ppm}`)
                            commit('setAtmoCO2', item.co2_ppm)
                            break
                        case 'hum_perc':
                            // console.log(`hum_perc[${item.step_num}]:  ${item.hum_perc}`)
                            commit('setAtmoHum', item.hum_perc)
                            break
                        case 'temp':
                            // console.log(`temp[${item.step_num}]:      ${item.temp}`)
                            // TODO: Create temperature state
                            commit('setAtmoTemp', item.temp)
                            break
                        default:
                            newStepData = false
                            console.log('Data not found')
                    }
                })

                if (newStepData) {
                    commit('setStepBatch', getters.getStepData)
                }
            })
        },
    },
}
