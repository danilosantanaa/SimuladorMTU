import { Lexer } from "./Lexer.js"
import { ErrorParser } from "../erros/ErrorParser.js"
import { SymbolTable, TokenStruct } from "./SymbolTable.js"
import { TOKENIDENTIFIERS } from "./TokenIdentifiers.js"

export class Parser {
    /**
     * @param {Lexer} lexer 
     * @param {SymbolTable} symbolTable 
     * 
     * 
     * @todo: Criar uma tabela de erros que dado um TOKEN ID, retorna à string.
     *      - No array, salva somente um template.
     */
    constructor(lexer, symbolTable) {
        /**
         * @private
         */
        this.lexer = lexer

        /**
         * @private
         */
        this.symbolTable = symbolTable

        /**
         * @private
         * Por padrão, a o lookaheader irá apontar para o primeiro token que ele encontrar
         */
        this.lookaheader = 0

        /**
         * @private
         */
        this.errorParser = new ErrorParser()
    }

    /**
     * Constroi a arvore de derivação.
     */
    parser() {
        this.__program()
    }

    nextLine() {
        for(let pos = this.lookaheader + 1; pos < this.symbolTable.symbols.length; pos++) {
            if(this.symbolTable.symbols[pos].token == TOKENIDENTIFIERS.ENDLINE) {
                this.lookaheader = pos + 1;
                break;
            }
        }
    }

    /**
     * @private
     */
    __e() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.E) {
            this.__recognize(tokenStruct)
            this.__assigment()
            this.__exprStates()
            this.__endLine()
            
        } else {
            this.__reject('E')
        }

    }

    /**
     * @private
     */
    __a() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.A) {
            this.__recognize(tokenStruct)
            this.__assigment()
            this.__exprAlphabet()
            this.__endLine()
        } else {
            this.__reject('A')
        }

    }

    /**
     * @private
     */
    __s0() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.S0) {
            this.__recognize(tokenStruct)
            this.__assigment()
            this.__states()
            this.__endLine()
        } else {
            this.__reject('S0')
        }

    }

    /**
     * @private
     */
    __f() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.F) {
            this.__recognize(tokenStruct)
            this.__assigment()
            this.__states()
            this.__endLine()
        } else {
            this.__reject('F')
        }

    }

    /**
     * @private
     */
    __nF() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.NF) {
            this.__recognize(tokenStruct)
            this.__assigment()
            this.__exprStates()
            this.__endLine()
        } else {
            this.__reject('NF')
        }

    }

    /**
     * @private
     */
    __aF() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.AF) {
            this.__recognize(tokenStruct)
            this.__assigment()
            this.__alphabet()
            this.__comma()
            this.exprRibbonAlphabet()
            this.__dValueConst()
            this.__comma()
            this.__bValueConst()
            this.__endLine()
        } else {
            this.__reject('AF')
        }

    }

    /**
     * @private
     */
    __d() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.D) {
            this.__recognize(tokenStruct)
            this.__assigment()
            this.__dValueConst()
            this.__endLine()
        } else {
            this.__recognize('D')
        }
    }

    /**
     * @private
     */
    __dValueConst() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.D_VAL_CONST) {
            this.__recognize(tokenStruct)
            this.__endLine()
        } else {
            this.__reject('>')
        }
    }

    /**
     * @private
     */
    __b() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.B) {
            this.__recognize(tokenStruct)
            this.__assigment()
            this.__bValueConst()
            this.__endLine()
        } else {
            this.__reject('B')
        }
    }

    /**
     * @private
     */
    __bValueConst() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.B_VAL_CONST) {
            this.__recognize(tokenStruct)
        } else {
            this.__reject('b')
        }
    }

    /**
     * @private
     */
    __nontuple() {
        this.__e()
        this.__a()
        this.__s0()
        this.__f()
        this.__nF()
        this.__aF()
        this.__d()
        this.__b()
    }

    /**
     * @private
     */
    __delta() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.STATE) {
            this.__states()
            this.__endLine()
            this.__cmds()
            this.__delta()
        } else if(tokenStruct.token == TOKENIDENTIFIERS.EOF) {
            this.__eof()
            console.log('--- FIM ANALISE ---')
        } else {
            this.__reject('Esperava um estado')
        }
    }

    /**
     * @private
     */
    __cmds() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.TAB) {
            this.__tab()
            this.__states()
            this.__alphabet()
            this.__modifier()
            this.__alphabet()
            this.__mover()
            this.__endLine()
            this.__subCmds()
        } else if(tokenStruct.token == TOKENIDENTIFIERS.EOF) {
            this.__eof()
            console.log('--- FIM ANALISE ---')
        } else {
            this.__reject('Esperava um TAB!!!')
        }
    }

    /**
     * @private
     */
    __subCmds() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.TAB) {
            this.__tab()
            this.__states()
            this.__alphabet()
            this.__modifier()
            this.__alphabet()
            this.__mover()
            this.__endLine()
            this.__subCmds()
        }
    }

    /**
     * @private
     */
    __program() {
        this.__nontuple()
        this.__delta()
    }

    /**
     * @private
     */
    __exprStates() {
        const tokenStruct = this.__getToken()
        
        if(tokenStruct.token == TOKENIDENTIFIERS.STATE) {
            this.__states()
            this.__subExprStates()
        } else {
            this.__reject('Estado')
        }
    }

    /**
     * @private
     */
    __subExprStates() {
        const tokenStruct = this.__getToken()
        
        if(tokenStruct.token == TOKENIDENTIFIERS.COMMA) {
            this.__comma()
            this.__states()
            this.__subExprStates()
        }
    }

    /**
     * @private
     */
    __exprAlphabet() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.ALPHABET) {
            this.__alphabet()
            this.__subExprAlphabet()
        } else {
            this.__reject('Alfabeto')
        }
    }

    /**
     * @private
     */
    __subExprAlphabet() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.COMMA) {
            this.__comma()
            this.__alphabet()
            this.__subExprAlphabet()
        }
    }

     /**
     * @private
     */
     exprRibbonAlphabet() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.ALPHABET) {
            this.__alphabet()
            this.__comma()
            this.exprRibbonAlphabet()
        }
    }

    /**
     * @private
     */
    __states() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.STATE) {
            this.__recognize(tokenStruct)
        } else {
            this.__reject('Estado')
        }
    }

    /**
     * @private
     */
    __alphabet() {
        const tokenStruct = this.__getToken()

        if(
            tokenStruct.token == TOKENIDENTIFIERS.ALPHABET || 
            tokenStruct.token == TOKENIDENTIFIERS.B_VAL_CONST || 
            tokenStruct.token == TOKENIDENTIFIERS.D_VAL_CONST
        ) {
            this.__recognize(tokenStruct)
        } else {
            this.__reject('Alfabeto')
        }
    }

    /**
     * @private
     */
    __assigment() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.ASSIGMENT) {
            this.__recognize(tokenStruct)
        } else {
            this.__reject('=')
        }
    }

    /**
     * @private
     */
    __mover() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.MOVER) {
            this.__recognize(tokenStruct)
        } else {
            this.__reject('L, R ou P')
        }
    }

    /**
     * @private
     */
    __modifier() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.MODIFIER) {
            this.__recognize(tokenStruct)
        } else {
            this.__reject('&')
        }
    }

    /**
     * @private
     */
    __comma() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.COMMA) {
            this.__recognize(tokenStruct)
        } else {
            this.__reject(',')
        }
    }

    /**
     * @private
     */
    __endLine() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.ENDLINE) {
            this.__recognize(tokenStruct)
            this.__endLine()
        }
    }

    /**
     * @private
     */
    __tab() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.TAB) {
            this.__recognize(tokenStruct)
        }
    }

    /**
     * @private
     */
    __eof() {
        const tokenStruct = this.__getToken()

        // if(tokenStruct.token == TOKENIDENTIFIERS.EOF) {
        //     this.__recognize(tokenStruct)
        // }
    }

    /**
     * Realizar o reconhecimento dos token e muda o ponteiro para o próximo token da tabela
     * @private
     * @param {TokenStruct} tokenStruct
     */
    __recognize(tokenStruct) {
        console.log(this.__getAttribute(tokenStruct))
        this.lookaheader++
    }

    /**
     * Retorna informação do token qu está na tabela.
     * @private
     * @returns {TokenStruct}
     */
    __getToken() {
        return this.symbolTable.symbols[this.lookaheader]
    }

    /**
     * Retorna o último token capturado.
     * @private
     * @returns {TokenStruct}
     */
    __lastCaughtToken() {
        return this.symbolTable.symbols[this.lookaheader]
    }

    /**
     * @private
     * @param {string} expected
     */
    __reject(expected) {

        const tokenCaught = this.__lastCaughtToken()

        console.error(`Esperava um ${expected}  e não um ${ this.__getAttribute(tokenCaught)}`)
        this.nextLine()
    }

    /**
     * @param {TokenStruct} tokenStruct
     * @private
     */
    __getAttribute(tokenStruct) {
        if(Number.isInteger(tokenStruct.attribute)) {
            if (tokenStruct.token == TOKENIDENTIFIERS.STATE) {
                return this.symbolTable.statesSet.set[tokenStruct.attribute].attribute
            }

            return this.symbolTable.alphabetSet.set[tokenStruct.attribute].attribute
        }

        return tokenStruct.attribute
    }

}