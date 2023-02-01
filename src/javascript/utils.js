// Misc util functions

export function StringFormatter(value) {
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

export function make_labels(start, end, nsteps) {
    // create nsteps labels from start to end, possibly adding empty slots at the beginning
    const s = Math.max(start+1, 1)  // don't generate steps <1
    const len = (end+1) - s
    return Array(nsteps-len).concat(Array(len).fill().map((d, i) => i + s))
}
