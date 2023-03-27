import { Lexer } from "./Lexer.js"
import { ErrorParser } from "../erros/ErrorParser.js"
import { SymbolTable, TokenStruct, SCOPE } from "./SymbolTable.js"
import { TOKENIDENTIFIERS } from "./TokenIdentifiers.js"
import { CodeGeneration, Instruction, StateMain, StateBegin, StateEnd} from "./CodeGeneration.js"
import { ParserAnalyze } from "./ParserAnalyze.js"

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

        /**
         * @type {Number} 
         * Será responsável para atribuir em qual escopo as declaração estã declada.
         * Armazena o ID do token
         */
        this.scopeID = null

        /**
         * @type {ParserAnalyze}
         * Responsável por armazenar possíveis erros semânticos. 
         */
        this.parserAnalyze = new ParserAnalyze(this.symbolTable)

        /**
         * Geração de Códigos Final
         */
        this.codeGeneration = new CodeGeneration()
        this.stateMain = null
        this.instruction = null
    }

    /**
     * Constroi a arvore de derivação.
     */
    parser() {
        if(this.symbolTable.symbols.length > 0) {
            this.__program()
            console.log('code generation')
            console.log('------------------------')
            console.log(this.codeGeneration.generationFinalCode())
            this.parserAnalyze.updateScopes()
            this.parserAnalyze.tryAllErro()
        }
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

        try {
            const tokenStruct = this.__getToken()

            if(tokenStruct.token != TOKENIDENTIFIERS.E)
                throw this.__reject('E')

            this.scopeID = SCOPE.E
            this.__recognize(tokenStruct)

            this.__assigment()
            this.__exprStates()
            this.__endLine()
                
            
        } catch(e) {
            console.error(e)
        }
       

    }

    /**
     * @private
     */
    __a() {
        try {
            const tokenStruct = this.__getToken()

            if(tokenStruct.token != TOKENIDENTIFIERS.A)
                throw this.__reject('A')
            
            this.scopeID = SCOPE.A
            this.__recognize(tokenStruct)
            this.__assigment()
            this.__exprAlphabet()
            this.__endLine()

        } catch(e) {
            console.error(e)
        }
    }

    /**
     * @private
     */
    __s0() {

        try {
            const tokenStruct = this.__getToken()
            
            if(tokenStruct.token != TOKENIDENTIFIERS.S0)
                throw this.__reject('S0')
            
            this.scopeID = SCOPE.S0
            this.__recognize(tokenStruct)
            this.__assigment()

            this.__states()
            this.codeGeneration.add(new StateBegin(this.__getAttribute(this.__lastCaughtToken())), true)
            this.assignScope()

            this.__endLine()
            
        } catch(e) {
            console.error(e)
        }

    }

    /**
     * @private
     */
    __f() {
        try {

            const tokenStruct = this.__getToken()
    
            if(tokenStruct.token != TOKENIDENTIFIERS.F)
                throw this.__reject('F')
            
            this.scopeID = SCOPE.F
            this.__recognize(tokenStruct)
            this.__assigment()

            this.__states()
            this.codeGeneration.add(new StateEnd(this.__getAttribute(this.__lastCaughtToken())), true)
            this.assignScope()

            this.__endLine()
        
        } catch(e) {
            console.error(e)
        }

    }

    /**
     * @private
     */
    __nF() {
        try {
            const tokenStruct = this.__getToken()

            if(tokenStruct.token != TOKENIDENTIFIERS.NF)
                throw this.__reject('NF')

            this.scopeID = SCOPE.NF
            this.__recognize(tokenStruct)
            this.__assigment()
            this.__exprStates()
            this.__endLine()
        
        } catch(e) {
            console.error(e)
        }

    }

    /**
     * @private
     */
    __aF() {

        try {

            const tokenStruct = this.__getToken()
            
            if(tokenStruct.token != TOKENIDENTIFIERS.AF)
                throw this.__reject('AF')
            
            this.scopeID = SCOPE.AF
            this.__recognize(tokenStruct)
            this.__assigment()
            this.__alphabet()
            this.__comma()
            this.exprRibbonAlphabet()
            this.__dValueConst()
            this.__comma()
            this.__bValueConst()

            this.__endLine()
          
        } catch(e) {
            console.error(e)
        }

    }

    /**
     * @private
     */
    __d() {

        try {

            const tokenStruct = this.__getToken()
            
            if(tokenStruct.token != TOKENIDENTIFIERS.D) 
                throw this.__recognize('D')

            this.scopeID = SCOPE.D
            this.__recognize(tokenStruct)
            this.__assigment()
            this.__dValueConst()
            this.__endLine()
       
        } catch(e) {
            console.error(e)
        }
    }

    /**
     * @private
     */
    __dValueConst() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token != TOKENIDENTIFIERS.D_VAL_CONST)
            throw this.__reject('>')
    
        this.__recognize(tokenStruct)
        this.assignScope()

        this.__endLine()
    }

    /**
     * @private
     */
    __b() {
        try {

            const tokenStruct = this.__getToken()
            
            if(tokenStruct.token != TOKENIDENTIFIERS.B)
                throw this.__reject('B')
            
            this.scopeID = SCOPE.B
            this.__recognize(tokenStruct)
            this.__assigment()
            this.__bValueConst()
            this.__endLine()
        } catch(e) {
            console.error(e)
        }
    }

    /**
     * @private
     */
    __bValueConst() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token != TOKENIDENTIFIERS.B_VAL_CONST)
            throw this.__reject('b')
        
            this.__recognize(tokenStruct)
            this.assignScope()
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
    
        try {
            if (tokenStruct.token == TOKENIDENTIFIERS.EOF || tokenStruct.token == TOKENIDENTIFIERS.ENDLINE)
                return

            this.__states()
            const lastState = this.__getAttribute(this.__lastCaughtToken())
            this.stateMain = new StateMain(lastState)
            this.scopeID = SCOPE.DELTA

            this.__endLine()
            this.codeGeneration.add(this.stateMain)
            
            this.__cmds()

            this.__delta()
            
        } catch(e) {
            console.error(e)
            return
        } 
        
    }

    /**
     * @private
     */
    __cmds() {
        try {
          
            const tokenStruct = this.__getToken()
            this.instruction = new Instruction()

            if(tokenStruct.token != TOKENIDENTIFIERS.TAB)
                throw this.__reject('TAB', false)

            this.__tab();

            this.__states()
            this.instruction.state = this.__getAttribute(this.__lastCaughtToken())
            this.assignScope()

            this.__alphabet()
            this.instruction.alphabetParams = this.__getAttribute(this.__lastCaughtToken())
            this.assignScope()

            this.__modifier()

            this.__alphabet()
            this.instruction.alphabetModifier = this.__getAttribute(this.__lastCaughtToken())
            this.assignScope()

            this.__mover()
            const lastToken = this.__lastCaughtToken()

            if(lastToken.attribute == 'R') {
                this.instruction.setRightCommand()
            }

            if(lastToken.attribute == 'L') {
                this.instruction.setLeftCommand()
            }

            if(lastToken.attribute == 'P') {
                this.instruction.setStopCommand()
            }

            this.__endLine()
            this.stateMain.add(this.instruction)

            this.__subCmds()
            
            
        } catch(e) {
            console.error(e)
            return
        }
    }

    /**
     * @private
     */
    __subCmds() {
        const tokenStruct = this.__getToken()
        this.instruction = new Instruction()

        if(tokenStruct.token == TOKENIDENTIFIERS.TAB) {

            this.__tab()

            this.__states()
            this.instruction.state = this.__getAttribute(this.__lastCaughtToken())
            this.assignScope()

            this.__alphabet()
            this.instruction.alphabetParams = this.__getAttribute(this.__lastCaughtToken())
            this.assignScope()

            this.__modifier()

            this.__alphabet()
            this.instruction.alphabetModifier = this.__getAttribute(this.__lastCaughtToken())
            this.assignScope()

            this.__mover()
            const lastToken = this.__lastCaughtToken()

            if(lastToken.attribute == 'R') {
                this.instruction.setRightCommand()
            }

            if(lastToken.attribute == 'L') {
                this.instruction.setLeftCommand()
            }

            if(lastToken.attribute == 'P') {
                this.instruction.setStopCommand()
            }

            this.__endLine()
            this.stateMain.add(this.instruction)

            this.__subCmds()
        }
     }
        
    /**
     * @private
     */
    __program() {
        this.__nontuple()
        this.__delta()

        // Adicionando as chamadas do estado inicial

    }

    /**
     * @private
     */
    __exprStates() {
        const tokenStruct = this.__getToken()
        
        if(tokenStruct.token != TOKENIDENTIFIERS.STATE)
            throw this.__reject('Estado')

        this.__states()
        this.assignScope()

        this.__subExprStates()
    }

    /**
     * @private
     */
    __subExprStates() {
        const tokenStruct = this.__getToken()
        
        if(tokenStruct.token == TOKENIDENTIFIERS.COMMA) {
            this.__comma()

            this.__states()
            this.assignScope()

            this.__subExprStates()
        }
    }

    /**
     * @private
     */
    __exprAlphabet() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token != TOKENIDENTIFIERS.ALPHABET) 
            throw this.__reject('Alfabeto')

        this.__alphabet()
        this.assignScope()

        this.__subExprAlphabet()
    }

    /**
     * @private
     */
    __subExprAlphabet() {
        const tokenStruct = this.__getToken()

        if(tokenStruct.token == TOKENIDENTIFIERS.COMMA) {
            this.__comma()
            this.__alphabet()
            this.assignScope()

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
            throw this.__reject('Estado')
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
            this.assignScope()
        } else {
            throw this.__reject('Alfabeto')
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
            throw this.__reject('=')
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
            throw this.__reject('L, R ou P')
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
            throw this.__reject('&')
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
            throw this.__reject(',')
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
     * Realizar o reconhecimento dos token e muda o ponteiro para o próximo token da tabela
     * @private
     * @param {TokenStruct} tokenStruct
     */
    __recognize(tokenStruct) {
        //console.log("'" + this.__getAttribute(tokenStruct) + "'")
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
        return this.symbolTable.symbols[this.lookaheader - 1]
    }

    /**
     * @private
     * @param {string} expected
     */
    __reject(expected, isNewLine = true) {

        const tokenCaught = this.__lastCaughtToken()

        if(isNewLine)
            this.nextLine()

        return `Esperava um ${expected}  e não um ${ this.__getAttribute(tokenCaught)}`
    }

    /**
     * @param {TokenStruct} tokenStruct
     * @private
     */
    __getAttribute(tokenStruct) {
        if(Number.isInteger(tokenStruct?.attribute)) {
            if (tokenStruct?.token == TOKENIDENTIFIERS.STATE) {
                return this.symbolTable.statesSet.set[tokenStruct.attribute].attribute
            }

            return this.symbolTable.alphabetSet.set[tokenStruct.attribute].attribute
        }

        return tokenStruct?.attribute
    }

    /**
     * Reponsável por indentificar em qual escopo os estados, alfabeto, delimitador ou branco de fita se encontra.
     */
    assignScope() {
        const lastToken = this.symbolTable.getToken(this.lookaheader - 1)

        const token_valid  = lastToken != null && (
            lastToken.token == TOKENIDENTIFIERS.STATE ||
            lastToken.token == TOKENIDENTIFIERS.ALPHABET ||
            lastToken.token == TOKENIDENTIFIERS.B_VAL_CONST ||
            lastToken.token == TOKENIDENTIFIERS.D_VAL_CONST
        )

        if(token_valid) {
            this.symbolTable.addScope(this.scopeID, this.lookaheader - 1)
        }
    }
}