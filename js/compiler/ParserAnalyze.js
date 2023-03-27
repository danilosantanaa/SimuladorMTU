import { MESSAGE_ERROR_SEMATIC } from "../erros/ErroMessage.js";
import { ErrorSemantic } from "../erros/ErrorSemantic.js";
import { SCOPE, SymbolTable, TokenStruct } from "./SymbolTable.js";
import { TOKENIDENTIFIERS } from "./TokenIdentifiers.js";

class Command {
    constructor() {
        /**@type {TokenStruct} */
        this.state = null

        /**@type {TokenStruct} */
        this.alphabetOld = null

        /**@type {TokenStruct} */
        this.alphabetNew = null

        /**@type {TokenStruct} */
        this.move = null
    }
}

export class ParserAnalyze {
    /**
     * 
     * @param {SymbolTable} symbolTable 
     */
    constructor(symbolTable) {
        this.erroSemantic = new ErrorSemantic()
        this.warnningSemantic = []
        this.symbolTable = symbolTable

        /**@type {TokenStruct[]} */
        this.statesScopes = null

        /**@type {TokenStruct[]} */
        this.alphabetScopes = null

        /**@type {TokenStruct[]} */
        this.stateBeginScopes = null

        /**@type {TokenStruct[]} */
        this.stateEndScopes = null

        /**@type {TokenStruct[]} */
        this.stateNotFinalScopes = null

        /**@type {TokenStruct[]} */
        this.ribbonAlphabetScopes = null

        /**@type {TokenStruct[]} */
        this.delimiterScopes = null

        /**@type {TokenStruct[]} */
        this.tapeBankScopes = null

        /**@type {TokenStruct[]} */
        this.deltaScopes = null

        /**@type {Command} */
        this.command = new Command()
        
        /** Comandos obrigatório ser colocado no estado inicial
         * @type {Command[]}
         */
        this.commandColumDelimitor = []
    }


    /**
     * Atualiza todos os scope dos elementos declarado no código    
     *
     */
    updateScopes() {
        this.statesScopes = this.symbolTable.symbols.filter(symbol => symbol.scopes.some(scope => scope == SCOPE.E))

        this.alphabetScopes = this.symbolTable.symbols.filter(symbol => symbol.scopes.some(scope => scope == SCOPE.A))

        this.stateBeginScopes = this.symbolTable.symbols.filter(symbol => symbol.scopes.some(scope => scope == SCOPE.S0))

        this.stateEndScopes = this.symbolTable.symbols.filter(symbol => symbol.scopes.some(scope => scope == SCOPE.F))

        this.stateNotFinalScopes = this.symbolTable.symbols.filter(symbol => symbol.scopes.some(scope => scope == SCOPE.NF))

        this.ribbonAlphabetScopes = this.symbolTable.symbols.filter(symbol => symbol.scopes.some(scope => scope == SCOPE.AF))

        this.delimiterScopes = this.symbolTable.symbols.filter(symbol => symbol.scopes.some(scope => scope == SCOPE.D))

        this.tapeBankScopes = this.symbolTable.symbols.filter(symbol => symbol.scopes.some(scope => scope == SCOPE.B))

        this.deltaScopes = this.symbolTable.symbols.filter(symbol => symbol.scopes.some(scope => scope == SCOPE.DELTA))
    }

    addCommand() {
        if(this.command.alphabetOld.token == TOKENIDENTIFIERS.D_VAL_CONST) {
            this.commandColumDelimitor.push(this.command)
            this.command = new Command()
        }
    }

    catchAllErro() {
        this.updateScopes()
        this.chechAlphabet()
        this.checkStateBegin()
        this.checkStateEnd()
        this.checkRibbonAlphabet()
        this.checkDeltaScope()
        this.checkStateBeginCalled()
    }

    /**@private */
    checkStateBegin() {
        try {
            this.checkStateBeginScope()
        } catch(e) {
            console.error(e)
        }
    }

    /**@private */
    checkStateEnd() {
        try {
            this.checkStateEndScope()
        } catch(e) {
            console.error(e)
        }
    }

    /**@private */
    checkRibbonAlphabet() {
        try {
              /**@type {TokenStruct} */
                const tokenDuplicate = this.checkDuplicate(this.ribbonAlphabetScopes)

                if(tokenDuplicate != null) {
                    this.erroSemantic.addErroDuplicate(tokenDuplicate.line, tokenDuplicate.column, this.symbolTable.alphabetSet.set[tokenDuplicate.attribute].attribute, `no "Alfabeto de Fita"`)
                    throw this.erroSemantic.getLastErro()
                }

            this.checkObeyOrderRibbonAlphabetOfAlphabet()
        } catch(e) {
            console.error(e)
        }
    }

    /**@private */
    chechAlphabet() {
       try {

           /**@type {TokenStruct} */
           const tokenDuplicate = this.checkDuplicate(this.alphabetScopes)
   
           if(tokenDuplicate != null) {
               this.erroSemantic.addErroDuplicate(tokenDuplicate.line, tokenDuplicate.column, this.symbolTable.alphabetSet.set[tokenDuplicate.attribute].attribute, `no "Alfabeto"`)
               throw this.erroSemantic.getLastErro()
           }
       } catch(e) {
            console.error(e)
       }
        
    }

    // ----- metodos auxliares
    /**
     * @private
     */
    checkStateBeginScope() {
        /**@type {TokenStruct} */
        const stateBeginToken =  this.stateBeginScopes[0]
        const attributeValue = this.symbolTable.statesSet.set[stateBeginToken?.attribute]?.attribute
        const hasStateBegindeclared = this.statesScopes.some(token => token?.attribute == stateBeginToken?.attribute)

        if(!hasStateBegindeclared && stateBeginToken != undefined) {
            this.erroSemantic.addErroScope(stateBeginToken.line, stateBeginToken.column, attributeValue, "Estado Inicial", "Conjuntos de Estados")
            throw this.erroSemantic.getLastErro() + "\n"
        }
    }

     /**
     * @private
     */
    checkStateEndScope() {
         /**@type {TokenStruct} */
         const stateEndToken =  this.stateEndScopes[0]
         const attributeValue = this.symbolTable.statesSet.set[stateEndToken?.attribute]?.attribute
         const hasStateBegindeclared = this.statesScopes.some(token => token?.attribute == stateEndToken?.attribute)
 
         if(!hasStateBegindeclared && stateEndToken != null) {
             this.erroSemantic.addErroScope(stateEndToken.line, stateEndToken.column, attributeValue, "Estado Final", "Conjuntos de Estados")
             throw this.erroSemantic.getLastErro() + "\n"
         }
    }

    /**
     * @private
     */
    checkObeyOrderRibbonAlphabetOfAlphabet() {
        for(let pos = 0; pos < this.alphabetScopes.length; pos++) {
            if(this.alphabetScopes[pos]?.attribute != this.ribbonAlphabetScopes[pos]?.attribute) {
                this.erroSemantic.addErroSequenceObey(this.ribbonAlphabetScopes[pos]?.line, this.ribbonAlphabetScopes[pos]?.column - 1,  "Alfabeto de Fita" , "Alfabeto")
                throw this.erroSemantic.getLastErro()
            }
        }
    }

    /** CHECAGEM DE DUPLICIDADE */

    /**
     * @private
     * Verifica se há elementos duplicados.
     * @param {Array} array
     * @returns {boolean}
     */
    checkDuplicate(array) {
        const map = new Map()
        let is_burst = null

        array.forEach(el => {
            if(map.has(el.attribute)) {
                const value = map.get(el.attribute) + 1
                map.set(el.attribute, value)
                
                // Se encontrar um valor que já passou do limite, quebrar.
                if(value > 1) {
                    is_burst = el
                    return
                }
            } else {
                map.set(el.attribute, 1)
            }
        })

       return is_burst
    }

    /**
     * @private
     */
    checkDeltaScope() {
        /**@type {TokenStruct[]} */
        const deltaStatesScope = this.deltaScopes.filter(el => el.token == TOKENIDENTIFIERS.STATE)

        /**@type {TokenStruct[]} */
        const deltaAlphabetScope = this.deltaScopes.filter(el => el.token == TOKENIDENTIFIERS.ALPHABET || el.token == TOKENIDENTIFIERS.B_VAL_CONST || el.token == TOKENIDENTIFIERS.D_VAL_CONST)
        
        // Verificar se os estados estão declarados
       for(let tokenStruct of deltaStatesScope) {
            let stateFound = this.statesScopes.some(x => x.attribute == tokenStruct.attribute)

            if(!stateFound) {
                const attributeValue = this.symbolTable.statesSet.getAttributeValue(tokenStruct.attribute)
                this.erroSemantic.addErroScope(tokenStruct.line, tokenStruct.column, attributeValue, "Delta", "Conjunto de Estados")
            }
       }

       // Verificar se os alfabeto de fita foi declarados
       for(let tokenStruct of deltaAlphabetScope) {
            let alphabetFound = this.ribbonAlphabetScopes.some(x => x.attribute == tokenStruct.attribute)

            if(!alphabetFound) {
                const attributeValue = 
                    tokenStruct.token == TOKENIDENTIFIERS.ALPHABET ? 
                        this.symbolTable.alphabetSet.getAttributeValue(tokenStruct.attribute) 
                    : tokenStruct.attribute

                    this.erroSemantic.addErroScope(tokenStruct.line, tokenStruct.column, attributeValue, "Delta", "Alfabeto de Fita")
            }
       }
    }

    /**@private */
    checkStateBeginCalled() {
        
        const state_begin_command = 
            this.commandColumDelimitor.find(x => this.stateBeginScopes.some(y => y.attribute == x.state.attribute))

        // Valida se existe o comando: {Q} > R, esse Q pertence ao conjunto de estados(E) e ao estado inicial (S0).
        const valid_command = 
            state_begin_command != undefined &&
            state_begin_command?.alphabetNew?.token == TOKENIDENTIFIERS.D_VAL_CONST &&
            state_begin_command?.move.attribute == 'R'

        if(!valid_command) {
            this.erroSemantic.addErroStateBegin(
                this.stateBeginScopes.reduce((next, current) => `${next} ${this.symbolTable.statesSet.getAttributeValue(current.attribute)}`, this.stateBeginScopes.length == 0 ? "<ESTADO>" : "")
            )
        }
    }
}