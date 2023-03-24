/**
 * 
 * @param {string} template_string 
 * @param  {...any} values
 * @returns {string} 
 */
export function stringFormat(template_string, ...values) {
    for (let pos = 0; pos < values.length; pos++) {
        template_string = template_string.replace(`{${pos}}`, values[pos])
    }

    return template_string
}