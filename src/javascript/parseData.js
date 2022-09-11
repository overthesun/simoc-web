// Recursive function to extract data at path from arbitrary object
export const parseData = (data, path) => {
    // Return what's at the end of the path
    if (!data && data !== 0) {
        return
    } else if (path.length === 0) {
        data = data === null ? 0 : data
        return data
    }

    // Shift the first element of path, pass on the rest of path
    const index = path[0]
    const remainder = path.slice(1)

    // ARRAYS
    if (Array.isArray(data)) {
        if (index === "*") {  // All Items
            const output = data
                .map((d) => parseData(d, remainder))
                .filter((d) => d.length !== 0)
            return output
        } else if (typeof index === "number") {  // One index
            return parseData(data[index], remainder)
        }
        const idx = index.split(":") // Range i:j
        if (idx.length !== 2) {
            throw EvalError('Array index must be "*", numbers, or range "i:j".')
        }
        return data.slice(idx[0], idx[1]).map((d) => parseData(d, remainder))
    }

    // OBJECTS
    else if (typeof data === "object") {
        if (index === "*" || index === "SUM") {  // All Items
            const output = {}
            Object.keys(data).forEach((key) => {
                const res = parseData(data[key], remainder)
                if (res || res === 0) {
                    output[key] = res
                }
            })
            if (Object.keys(output).length > 0) {
                if (index === "*") {
                    return output
                } else {
                    // Return the sum of all entries (value only)
                    return Object.values(output).reduce((a, b) => a + b)
                }
            }
        } else if (Object.keys(data).includes(index)) {  // One key
            return parseData(data[index], remainder)
        } else if (typeof(index) === "string") {  // Comma-separated keys
            const indices = index.split(",").map(i => i.trim())
            if (indices.length > 0) {
                const output = {}
                for (let i of indices) {
                    const res = parseData(data[i], remainder)
                    if (res || res === 0) {
                        output[i] = res
                    }
                }
                if (Object.keys(output).length > 0) {
                    return output
                }
            }
        }
    }
}
