// Misc util functions

export function StringFormatter(value) {
    // special case
    if (value.toLowerCase() === 'kwh') {
        return 'kWh'
    }

    // replace underscores with spaces and capitalizes the first letter of each word
    // e.g. 'food_ration' -> 'Food Ration'
    let formatted = ''

    formatted = value.replace(/_/g, ' ')
    formatted = formatted.toLowerCase()
            .split(' ')
            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ')

    return formatted
}

export function ensure_within(value, min, max) {
    // ensure that min <= value <= max, return 0 if value is not a number
    return Math.max(min, Math.min(max, parseInt(value, 10) || 0))
}

export const colors = [
    '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0',
    '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8',
    '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff',
    '#000000',
]  // A long arbitrary list of colors, used by GreenhouseDoughnut and AgentExplorer
