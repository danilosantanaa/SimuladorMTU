import {SymbolTable, TokenStruct } from "./SymbolTable.js"
import { TOKENIDENTIFIERS } from "./TokenIdentifiers.js"
import { ErrorLexer } from "../erros/ErrorLexer.js"

export class Lexer {

    /**
     * @param {string} source_code
     * @param {Token} symbolTable
     */
    constructor(source_code, symbolTable) {

        /**
         * @private
         */
        this.codigo_fonte = String(source_code)

        /**
         * @type  { Number }
         * @private
         */
        this.lookahead = 0

        /**
         * @type { SymbolTable }
         * @private
         */
        this.symbolTable = symbolTable

        /**
         * @type {ErrorLexer}
         * @private
         */
        this.errorLexer = new ErrorLexer()

        /**
         * @type {Number}
         * @private
         */
        this.linePosition = 1

        /**
         * @type {Number}
         * @private
         */
        this.columnPosition = 1

        /**
         * Será usado para localizar a posição da coluna da tabela que se encontra o código. 
         * A table irá gerar uma marcação {N} após cada código com objetivo de mapear a posição da coluna da tabela para mostrar erros mais precisos.
         * Exemplo: q1 1 R, se tornará: q1{1} 1{1} R{1}, esse "1" indica que esse código está na primeira coluna da tabela. 
         * Essa marcação só é gerada pela tabela, e quando for gerado o arquivo, essa marcação será retirada.
         * A primeira posição da string, irá armazenar qual dimensão da coluna, se for linha, terá "l" e se for coluna, terá "c"
         * @type {string}
         * @private
         */
        this.tablePosition = ""

        /**
         * Armazena pedaço de uma string quando for fazer a tokenização dos caracteres
         * @type {string}
         * @private
         */
        this.substring = ""

    }

    /** 
     * Faz os reconhecimentos dos tokens a adiciona na tabela de simbolos.
     */
    tokenize() {
        this.__q0()
    }

    /**
     * Retorna todos os erros capturado durante a tokenização
     * @returns {ErrorLexer}
     */
    getErros() {
        return this.errorLexer
    }

    /**
     * @private
     */
    __q0() {
        const caracter = this.getCaracter()

        if (caracter == 'E') {
            this.next()
            this.__q1()
        }
        else if (caracter == 'A') {
            this.next()
            this.__q2()
        }
        else if (caracter == 'S') {
            this.next()
            this.__q3()
        }
        else if (caracter == 'F') {
            this.next()
            this.__q4()
        }
        else if (caracter == 'N') {
            this.next()
            this.__q5()
        }
        else if (caracter == 'D') {
            this.next()
            this.__q7()
        }
        else if (caracter == 'B') {
            this.next()
            this.__q8();
        }
        else if (caracter == '>') {
            this.next()
            this.__q9()
        }
        else if (caracter == 'b') {
            this.next()
            this.__q10()
        }
        else if (this.isLineBreak(caracter)) {
            this.next()
            this.__q11()
        }
        else if (this.isEscapeCharacter(caracter)) {
           this.__iguinor()
        }
        else if (caracter == 'Q' || caracter == 'q') {
            this.next()
            this.__q18()
        }
        else if (this.isCaracter(caracter) || this.isSpecialCharacter(caracter) || this.isNumber(caracter)) {
            this.next()
            this.__q19()
        }
        else if (this.isMover(caracter)) {
            this.next()
            this.__q20()
        }
        else if (this.isModifier(caracter)) {
            this.next()
            this.__q21()
        }
        else if (this.isAssigment(caracter)) {
            this.next()
            this.__q22()
        }
        else if (this.isComma(caracter)) {
            this.next()
            this.__q23()
        }
        else if(caracter == '#') {
            this.next()
            this.__q16()
        }
        else if(caracter == '{') {
            this.next()
            this.__q28()
        }
        else if(caracter == '\t') {
            this.next()
            this.__q27()
        }   
        else if(caracter == undefined || caracter == null) {
            this.__accept(TOKENIDENTIFIERS.EOF)
        }
        else {
            this.__reject()
        }
    }

    /**
     * @private
     */
    __q1() {
        this.__accept(TOKENIDENTIFIERS.E)
    }


    /**
     * @private
     */
    __q2() {
        if(this.getCaracter() == 'F') {
            this.next()
            this.__q6()
        } else {
            this.__accept(TOKENIDENTIFIERS.A)
        }
    }

    /**
     * @private
     */
    __q3() {
        if (this.getCaracter() == '0') {
            this.next()
            this.__q3_1()
        } else {
            this.__reject()
        }
    }

    /**
     * @private
     */
    __q3_1() {
        this.__accept(TOKENIDENTIFIERS.S0)
    }

    /**
     * @private
     */
    __q4() {
        this.__accept(TOKENIDENTIFIERS.F)
    }

    /**
     * @private
     */
    __q5() {
        if(this.getCaracter() == 'F') {
            this.next()
            this.__q5_1()
        } else {
            this.__reject()
        }
    }

    /**
     * @private
     */
    __q5_1() {
        this.__accept(TOKENIDENTIFIERS.NF)
    }

    /**
     * @private
     */
    __q6() {
        this.__accept(TOKENIDENTIFIERS.AF)
    }

    /**
     * @private
     */
    __q7() {
        this.__accept(TOKENIDENTIFIERS.D)
    }

    /**
     * @private
     */
    __q8() {
        this.__accept(TOKENIDENTIFIERS.B)
    }

    /**
     * @private
     */
    __q9() {
        this.__accept(TOKENIDENTIFIERS.D_VAL_CONST)
    }

    /**
     * @private
     */
    __q10() {
        this.__accept(TOKENIDENTIFIERS.B_VAL_CONST)
    }

    /**
     * @private
     */
    __q11() {
        this.linePosition++
        this.columnPosition = 1
        this.__accept(TOKENIDENTIFIERS.ENDLINE)
    }

    /**
     * @private
     */
    __q16() {
        if(!this.isLineBreak(this.getCaracter())) {
            this.next()
            this.__q16()
        } else {
            this.__q17()
        }
    }

    /**
     * @private
     */
    __q17() {
        this.__iguinor()
    }

    /**
     * @private
     */
    __q18() {
        if (this.isNumber(this.getCaracter())) {
            this.next()
            this.__q18_1()
        } else {
            this.__reject()
        }
    }

    /**
     * @private
     */
    __q18_1() {
        if (this.isNumber(this.getCaracter())){
            this.next()
            this.__q18_1()
        } else {
            this.__accept(TOKENIDENTIFIERS.STATE)
        }
    }

    /**
     * @private
     */
    __q19() {
        this.__accept(TOKENIDENTIFIERS.ALPHABET)
    }

    /**
     * @private
     */
    __q20() {
        this.__accept(TOKENIDENTIFIERS.MOVER)
    }

    /**
     * @private
     */
    __q21() {
        this.__accept(TOKENIDENTIFIERS.MODIFIER)
    }

    /**
     * @private
     */
    __q22() {
        this.__accept(TOKENIDENTIFIERS.ASSIGMENT)
    }

    /**
     * @private
     */
    __q23() {
        this.__accept(TOKENIDENTIFIERS.COMMA)
    }

    /**
     * @private
     */
    __q28() {
        if(this.getCaracter() == 'l' || this.getCaracter() == 'c') {
            this.tablePosition += this.getCaracter()
            this.next()
            this.__q24();
        } else {
            this.__reject();
        }
    }

    /**
     * @private
     */
    __q24() {
        if(this.isNumber(this.getCaracter())) {
            this.tablePosition += this.getCaracter()
            this.next()
            this.__q25()
        } else {
            this.__reject()
        }
    }

    /**
     * @private
     */
    __q25() {
        if(this.isNumber(this.getCaracter())) {
            this.tablePosition += this.getCaracter()
            this.next()
            this.__q25()
        } 
        else if(this.getCaracter() == '}') {
            this.next();
            this.__q26();
        }
        else {
            this.__reject()
        }
    }
    
    /**
     * @private
     */
    __q26() {
        this.__assigmentColumnTablePosition()
    }

    /**
     * @private
     */
    __q27() {
        this.__accept(TOKENIDENTIFIERS.TAB)
    }

    /**
     * @private
     * @param {Number} TOKEN_ID 
     */
    __accept(TOKEN_ID) {
        this.back()

        let attribute = this.substring

        if(TOKEN_ID == TOKENIDENTIFIERS.ALPHABET) {
            attribute = this.symbolTable.alphabetSet.add(attribute)
        }

        if(TOKEN_ID == TOKENIDENTIFIERS.STATE) {
            attribute = this.symbolTable.statesSet.add(attribute)
        }

        this.symbolTable.add(
            new TokenStruct(
                TOKEN_ID, 
                attribute, 
                this.linePosition, 
                this.columnPosition
            )
        )

        this.next()
        this.substring = ""

        if(TOKEN_ID != TOKENIDENTIFIERS.EOF)
            this.__q0()
    }

    /**
     * @private
     */
    __reject() {
        this.errorLexer.add(this.getCaracter(), this.linePosition, this.columnPosition)
        this.next()
        this.substring = ""
        this.__q0()
    }

    /**
     * @private
     */
    __iguinor() {
        this.next()
        this.substring = ""
        this.__q0()
    }

    /**
     * @private
     */
    __assigmentColumnTablePosition() {
        const last_token = this.symbolTable.getLastToken()

        const isLine = this.tablePosition.substring(0, 1) == 'l'
        const position = this.tablePosition.substring(1)

        if(isLine) {
            last_token.lineTable = Number(position)
        } else {
            last_token.columnTable = Number(position)
        }

        this.tablePosition = ""
        this.substring = ""
    
        this.__q0()
    }

    /**
     * @private
     */
    getCaracter() {
        if(this.codigo_fonte.length == 0) throw 'No content!'

        return this.codigo_fonte[this.lookahead]
    }

    /**
     * @private
     */
    back() {
        this.lookahead--
        this.columnPosition--
    }

    /**
     * @private
     */
    next() {
        this.substring += this.getCaracter()
        this.lookahead++
        this.columnPosition++
    }

    /**
     * @private
     * @param {string} caracter 
     * @returns {boolean}
     */
    isCaracter(caracter) {
        return  caracter == 'a' ||
                caracter >= 'c' && caracter <= 'p' ||
                caracter >= 'r' && caracter <= 'z' ||
                caracter == 'C' ||
                caracter >= 'G' && caracter <= 'K' ||
                caracter == 'M' ||
                caracter == 'O' ||
                caracter >= 'T' && caracter <= 'Z'
    }

    /**
     * @private
     * @param {string} caracter 
     * @returns {boolean}
     */
    isSpecialCharacter(character) {
        return  character == '+' ||
                character == '-' ||
                character == '/' ||
                character == '*'
    }

    /**
     * @private
     * @param {string} caracter 
     * @returns {boolean}
     */
    isNumber(character) {
        return character >= '0' && character <= '9'
    }

    /**
     * @private
     * @param {string} caracter 
     * @returns {boolean}
     */
    isLineBreak(character) {
        return character == '\n'
    }

    /**
     * @private
     * @param {string} caracter 
     * @returns {boolean}
     */
    isMover(character) {
        return character == 'R' ||
               character == 'L' ||
               character == 'P'
    }


    /**
     * @private
     * @param {string} caracter 
     * @returns {boolean}
     */
    isEscapeCharacter(character) {
        return  character == '\s' ||
                character == ' ' ||
                character == '\r'
    }

    /**
     * @private
     * @param {string} caracter 
     * @returns {boolean}
     */
    isModifier(character) {
        return character == '&'
    }

    /**
     * @private
     * @param {string} caracter 
     * @returns {boolean}
     */
    isAssigment(character) {
        return character == '='
    }

    /**
     * @private
     * comma == vírgula
     * @param {string} caracter 
     * @returns {boolean}
     */
    isComma(character) {
        return character == ','
    }
}