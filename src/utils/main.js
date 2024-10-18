const truncate = (str, n) => (str.length > n ? str.slice(0, n-3) + '...' : str)

export function truncateDeep(value, n=20) {
    if (typeof value === 'string') {
        return truncate(value, n)
    } else if (Array.isArray(value)) {
        return value.map(item => truncateDeep(item, n))
    } else if (typeof value === 'object' && value !== null) {
        const nestedObj = {}
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
            nestedObj[truncate(nestedKey, n)] = truncateDeep(nestedValue, n)
        }
        return nestedObj
    }
    return value
}