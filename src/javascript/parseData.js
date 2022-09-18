// Recursive function to extract data at path from arbitrary object
export const parseData = (data, path) => {
    // Return what's at the end of the path
    if (!data && data !== 0) {
        return null
    } else if (path.length === 0) {
        return data === null ? 0 : data
    }
    // Shift the first element of path, pass on the rest of path
    const index = path[0]
    const remainder = path.slice(1)
    if (Array.isArray(data)) {
        // ARRAYS
        if (index === '*') {
            // All Items
            const output = data
                    .map(d => parseData(d, remainder))
                    .filter(d => d.length !== 0)
            return output
        } else if (typeof index === 'number') {
            // Single index (number)
            return parseData(data[index], remainder)
        }
        // Range i:j (string)
        const idx = index.split(':')
        if (idx.length !== 2) {
            throw EvalError('Array index must be "*", numbers, or range "i:j".')
        }
        return data.slice(idx[0], idx[1]).map(d => parseData(d, remainder))
    } else if (typeof data === 'object') {
        // OBJECTS
        if (index === '*' || index === 'SUM') {
            // All items, either an object ('*') or a number ('SUM')
            const output = {}
            Object.keys(data).forEach(key => {
                const res = parseData(data[key], remainder)
                if (res || res === 0) {
                    output[key] = res
                }
            })
            if (Object.keys(output).length === 0) {
                return null
            } else if (index === '*') {
                return output
            } else {
                // Return the sum of all entries (value only)
                return Object.values(output).reduce((a, b) => a + b)
            }
        } else if (Object.keys(data).includes(index)) {
            // Single Key
            return parseData(data[index], remainder)
        } else if (typeof (index) === 'string') {
            // Comma-separated list of keys. Return an object with all.
            const indices = index.split(',').map(i => i.trim())
            if (indices.length > 0) {
                const output = {}
                // eslint-disable-next-line no-restricted-syntax
                for (const i of indices) {
                    const res = parseData(data[i], remainder)
                    if (res || res === 0) {
                        output[i] = res
                    }
                }
                return Object.keys(output).length > 0 ? output : null
            }
        }
    }
    throw Error(`Unrecognized index type: ${index}`)
}
