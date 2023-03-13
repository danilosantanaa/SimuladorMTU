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
                attribute,
                scope: []
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

export class TokenStruct {
    constructor(token, attribute, line, column) {
        this.token = token
        this.attribute = attribute
        this.line = line
        this.column = column
        this.columnTable = null
        this.scope = []
    }
}

export class SymbolTable {

    constructor() {
        this.symbols = []

        this.statesSet = new StateSet()

        this.alphabetSet = new AlphabetSet()
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
}