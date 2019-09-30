// Universally used string formating method. Used to remove underscore from returned values from the backend.
//Also capitalizes just the first letter.
//Can be used to replace existing internal methods that do a similar function within a number of components. Specically the
//Greenhouse configuration form.

export function StringFormatter(value){
    let formatted = ""

    formatted = value.replace(/_/g," ")
    formatted = formatted.toLowerCase()
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ")

    return formatted

}

export function ensure_within(value, min, max) {
    // ensure that min <= value <= max, return 0 if value is not a number
    return Math.max(min, Math.min(max, parseInt(value) || 0))
}
