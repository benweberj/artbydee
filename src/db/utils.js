

export const requiredFields = ['title', 'description', 'materials', 'mainPhoto']

export function validatePainting(obj) {
    const errors = {}
    // let isValid = true

    for (let key of requiredFields) {
        if (!obj[key]) errors[key] = `${key} required`
    }

    return [Object.keys(errors).length==0, errors]
}