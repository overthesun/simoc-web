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
            // Array indexing is 0-based, but the stepBuffer system is 1-based;
            // Correct manually here by subtracting 1 from indices in path,
            // so that requesting e.g. step 1 will return data[0]
            return parseData(data[index-1], remainder)
        }
        // Range i:j (string)
        // The range is 0-based, so for 0:24 it will return from data[0] to data[23]
        // and in the dashboard (1-based) these will correspond to steps 1 to 24
        const idx = index.split(':').map(Number)
        if (idx.length !== 2) {
            throw EvalError('Array index must be "*", numbers, or range "i:j".')
        } else if (idx[0] > idx[1]) {
            throw EvalError(`Invalid range ${idx[0]}:${idx[1]}.`)
        }
        if (idx[0] < 0) {
            // if the start index is negative, prepend empty values and clip the index to 0
            return Array(Math.abs(idx[0])).concat(
                data.slice(0, idx[1]).map(d => parseData(d, remainder)))
        } else {
            return data.slice(idx[0], idx[1]).map(d => parseData(d, remainder))
        }
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
                const values = Object.values(output)
                if (typeof values[0] === 'object') {
                    // for arrays, combine the elements so that e.g. [0,1,2] + [3,4,5] == [3,5,7]
                    return values.reduce((acc, array) => acc.map((sum, i) => sum + array[i]),
                                         new Array(values[0].length).fill(0))
                } else {
                    // otherwise just add together all the values
                    return values.reduce((a, b) => a + b)
                }
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
