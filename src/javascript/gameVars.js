/**
 * As of October '21, the backend no longer distinguishes between agents and storages.
 * Much of the dashboard was designed to pull directly from gameConfig.storages.
 * Here, we determine which agents have storage, and add them back manually.
 *
 * @param game_config
 * @param currency_desc
 * @returns {{gameConfig: *, currencyDict: {}, humanAtmosphere: string}}
 */
export const parseUpdatedGameVars = (game_config, currency_desc) => {
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
