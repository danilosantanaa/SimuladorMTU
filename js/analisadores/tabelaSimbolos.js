class Simbolo {
    /**
     * @param {Number} token 
     * @param {string} atributo 
     * @param {number} linha
     * @param {number} coluna
     */
    constructor(token, atributo = null, linha, coluna) {
        this.token = token
        this.atributo = atributo
        this.linha = linha
        this.coluna = coluna
    }
}

export class TabelaSimbolo {
    constructor() {
        /**@type {Array} */
        this.tabelas = []
    }

    /**
     * @param {Number} token 
     * @param {string} atributo 
     * @param {number} linha
     * @param {number} coluna
     */
    addToken(token, atributo = null, linha, coluna) {
        this.tabelas.push(new Simbolo(token, atributo))
    }

    /**
     * @returns {Array}
     */
    getTokens() {
        return this.tabelas
    }
}