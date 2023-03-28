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

/**
 * Cria um elemento DOM e retorna o elemento criado.
 * @param {string} el_tag 
 * @param {string} value 
 * @param {object} attributes 
 * @returns 
 */
export function createElement(el_tag, value = null, attributes = {}) {
    const el = document.createElement(el_tag)

    if(value != null && value != undefined) {
        el.innerHTML = value
    }

    for(let att in attributes) {
        el.setAttribute(att, attributes[att])
    }

    return el
}

/**
 * 
 * @param {Element} parent 
 * @param {Element} child 
 * @param {Element} tag_brother 
 */
export function insertElement(parent, child, tag_brother = null) {
    if(tag_brother == null) {
        parent.appendChild(child)
    } else {
        parent.insertBefore(child, tag_brother)
    }

    return parent
}