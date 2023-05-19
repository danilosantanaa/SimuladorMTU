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

/** Classe que representa as expressões regulares */
export class ExpressaoRegular {
    constructor() {
        this.Validadores = {
            VALIDADOR_CONJUNTOS: /^(\s*[a-zA-Z0-9\>]+\s*)(\,\s*[a-zA-Z0-9\>]+\s*)*$/g,
            VALIDAR_PONTEIRO: /^q[0-9]+$/g,
            VALIDAR_COMANDOS: /^(q[0-9]+)\s+([a-zA-Z0-9\>\Б\►])\s+([R|L|P])$/g
        }

        this.ExtrairValores = {
            EXTRAIR_ELEMENTO_CONJUNTO: /[a-zA-Z0-9\>]+/g
        }

        this.Substituicao = {
            SUBSTITUIR_COMANDOS: /^\s*([qQ][0-9]+)(\s+)([a-pr-zA-KM-OS-Z0-9\>\Б\►])?(\s*)([R|L|P]?)\s*$/g,
            ESTADO: /^\s*([qQ][0-9]+)(\s*)$/g
        }
    }
}

export const gerarHashSHA256Text = async (text) => {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join("")
    
    return hashHex
}