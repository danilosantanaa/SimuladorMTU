import { MESSAGE_ERROR_SEMATIC } from "../erros/ErroMessage.js";
import { ErrorSemantic } from "../erros/ErrorSemantic.js";
import { SCOPE, SymbolTable, TokenStruct } from "./SymbolTable.js";

export class ParserAnalyze {
    /**
     * 
     * @param {SymbolTable} symbolTable 
     */
    constructor(symbolTable) {
        this.erroSemantic = new ErrorSemantic()
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
    }

    /**
     * Atualiza todos os scope dos elementos declarado no código    
     *
     */
    updateScopes() {
        if(this.statesScopes == null) {
            this.statesScopes = this.symbolTable.symbols.filter(symbol => symbol.scopes.some(scope => scope == SCOPE.E))
        }

        if(this.alphabetScopes == null) {
            this.alphabetScopes = this.symbolTable.symbols.filter(symbol => symbol.scopes.some(scope => scope == SCOPE.A))
        }

        if(this.stateBeginScopes == null) {
            this.stateBeginScopes = this.symbolTable.symbols.filter(symbol => symbol.scopes.some(scope => scope == SCOPE.S0))
        }

        if(this.stateEndScopes == null) {
            this.stateEndScopes = this.symbolTable.symbols.filter(symbol => symbol.scopes.some(scope => scope == SCOPE.F))
        }

        if(this.stateNotFinalScopes == null) {
            this.stateNotFinalScopes = this.symbolTable.symbols.filter(symbol => symbol.scopes.some(scope => scope == SCOPE.NF))
        }

        if(this.ribbonAlphabetScopes == null) {
            this.ribbonAlphabetScopes = this.symbolTable.symbols.filter(symbol => symbol.scopes.some(scope => scope == SCOPE.AF))
        }

        if(this.delimiterScopes == null) {
            this.delimiterScopes = this.symbolTable.symbols.filter(symbol => symbol.scopes.some(scope => scope == SCOPE.D))
        }

        if(this.tapeBankScopes == null) {
            this.tapeBankScopes = this.symbolTable.symbols.filter(symbol => symbol.scopes.some(scope => scope == SCOPE.B))
        }
    }

    tryAllErro() {
        this.chechAlphabet()
        this.checkStateBegin()
        this.checkStateEnd()
        this.checkRibbonAlphabet()
    }

    checkStateBegin() {
        try {
            this.checkStateBeginScope()
        } catch(e) {
            console.error(e)
        }
    }

    checkStateEnd() {
        try {
            this.checkStateEndScope()
        } catch(e) {
            console.error(e)
        }
    }

    checkRibbonAlphabet() {
        try {
              /**@type {TokenStruct} */
                const tokenDuplicate = this.chechDuplicate(this.ribbonAlphabetScopes)

                if(tokenDuplicate != null) {
                    this.erroSemantic.addErroDuplicate(tokenDuplicate.line, tokenDuplicate.column, this.symbolTable.alphabetSet.set[tokenDuplicate.attribute].attribute, `no "Alfabeto de Fita"`)
                    throw this.erroSemantic.getLastErro()
                }

            this.checkObeyOrderRibbonAlphabetOfAlphabet()
        } catch(e) {
            console.error(e)
        }
    }

    chechAlphabet() {
       try {

           /**@type {TokenStruct} */
           const tokenDuplicate = this.chechDuplicate(this.alphabetScopes)
   
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
        const stateBeginToken =  this.stateBeginScopes.shift()
        const attributeValue = this.symbolTable.statesSet.set[stateBeginToken?.attribute]?.attribute
        const hasStateBegindeclared = this.statesScopes.some(token => token?.attribute == stateBeginToken?.attribute)

        if(!hasStateBegindeclared && stateBeginToken != undefined) {
            this.erroSemantic.addErroScope(stateBeginToken.line, stateBeginToken.column, attributeValue, "Estado Inicial", "Conjuntos de Estados")
            throw this.erroSemantic.getLastErro() + "\n"
        }
    }

    checkStateEndScope() {
         /**@type {TokenStruct} */
         const stateEndToken =  this.stateEndScopes.shift()
         const attributeValue = this.symbolTable.statesSet.set[stateEndToken?.attribute]?.attribute
         const hasStateBegindeclared = this.statesScopes.some(token => token?.attribute == stateEndToken?.attribute)
 
         if(!hasStateBegindeclared && stateEndToken != null) {
             this.erroSemantic.addErroScope(stateEndToken.line, stateEndToken.column, attributeValue, "Estado Final", "Conjuntos de Estados")
             throw this.erroSemantic.getLastErro() + "\n"
         }
    }

    /** CHECAGEM DE ORDEM */

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
     * Verifica se há elementos duplicados.
     * @param {Array} array
     * @returns {boolean}
     */
    chechDuplicate(array) {
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
}