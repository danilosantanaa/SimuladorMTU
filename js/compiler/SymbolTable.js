import * as setting from "../setting.js"
import { TOKENIDENTIFIERS } from "./TokenIdentifiers.js"

class SetCustom {
    constructor() {
        this.set = []
    }

    /**
     * Se caso não tiver o elemento no conjunto, ele adiciona na última posição e retorna a última chave. Caso contrário,
     * ele retorna a posição aonde se encontra o elemento.
     * @param {string} attribute 
     * @returns {Number}
     */
    add(attribute) {
        const position_find = this.set.findIndex(x => x.attribute == attribute)
        const NOT_FOUND = -1

        if(position_find == NOT_FOUND) {
            this.set.push({
                attribute
            })

            return this.lastPosition()
        }

        return position_find
    }

    /**
     * @returns {Number}
     */
    lastPosition() {
        return this.set.length - 1
    }

    /**
     * Retorna um objeto com as chaves: attribute e scope, caso não encontrar, retorna underfined.
     * @param {string} attribute
     * @returns {object}
     */
    getAttribute(attribute) {
        return this.set.find(x => x.attribute == attribute)
    }
}

class AlphabetSet extends SetCustom {}

class StateSet extends SetCustom {}

class RibbonBlankSet extends SetCustom {}

class DelimiterSet extends SetCustom {}


export class TokenStruct {
    constructor(token, attribute, line, column) {
        this.token = token
        this.attribute = attribute
        this.line = line
        this.lineTable = null
        this.column = column
        this.columnTable = null,
        this.scopes = []
    }
}


export class SymbolTable {

    constructor(ENVIRONMENT = setting.TYPE_ENVORONMENT.CODEFIRST) {
        this.symbols = []

        this.statesSet = new StateSet()

        this.alphabetSet = new AlphabetSet()

        this.ribbonBlankSet = new RibbonBlankSet()

        this.delimiterSet = new DelimiterSet()

        this.ENVIRONMENT = ENVIRONMENT
    }

    /**
     * @param { TokenStruct } symbol 
     */
    add(symbol) {
        this.symbols.push(symbol)
    }

    /**
     * @returns { TokenStruct }
     */
    getLastToken() {
        return this.symbols[this.symbols.length - 1]
    }

    /**
     * @returns { TokenStruct }
     */
    getAll() {
        return this.symbols
    }

    /**
     * Retorna o token passando a posição
     * @param {Number} position
     * @returns {TokenStruct}
     */
    getToken(position) {
        return this.symbols[position]
    }

    /**
     * Retorna o objeto que armazena o valor original do atributo, contendo os seguinte campos.
     * @param {Number} position
     * @returns {{attribute, scope}}
     */
    getAttributeValue(position) {

        /**@type {TokenStruct} */
        const token =  this.symbols[position]

        if(Number.isInteger(token.attribute)) {
            if(token.token == TOKENIDENTIFIERS.STATE) {
                return this.statesSet.set[token.attribute]
            }

            if(token.token == TOKENIDENTIFIERS.ALPHABET) {
                return this.alphabetSet.set[token.attribute]
            }

            if(token.token == TOKENIDENTIFIERS.B_VAL_CONST) {
                return this.ribbonBlankSet.set[token.attribute]
            }

            if(token.token == TOKENIDENTIFIERS.D_VAL_CONST) {
                return this.delimiterSet.set[token.attribute]
            }
        }

        return token
    }

    /**
     * Reponsável por atribuir escopo na qual a funcionadade pertence.
     * @param {Number} id
     * @param {Number} position
     * 
     * @returns {boolean}
     */
    addScope(id, position) {
       const token = this.getToken(position)

       if(token != null) {
            const not_found_scope = !token.scopes.some(scope => scope == id)
            if(not_found_scope) {
                token.scopes.push(id)
            }

            return true
       }

        return false
    }
}


export const SCOPE = {
    ...TOKENIDENTIFIERS,
    DELTA: 900
}