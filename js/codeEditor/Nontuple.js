import * as setting from '../setting.js'
import * as utils from '../utils.js'
import { Table } from './Table.js'

export class Nontuple {
    constructor() {
        this.stateSetsEl = document.querySelector("#estados")
        this.alphabetEl = document.querySelector("#alfabeto")
        this.stateBeginEl = document.querySelector("#estado-inicial")
        this.stateFinalEl = document.querySelector("#estado-final")
        this.stateNotFinal = document.querySelector("#estado-nao-final")
        this.ribbonAlphabetSetsEl = document.querySelector("#alfabeto-fita")
        this.delimiter = document.querySelector("#delimitadir")
        this.tangeBlank = document.querySelector("#branco-fita")

        this.eventosFocusOut();

        this.table = new Table()
        this.ExpressaoRegular = new utils.ExpressaoRegular()
    }

    eventosFocusOut() {
        this.stateSetsEl.addEventListener("focusout", () => {
            this.tirarEspacos(this.stateSetsEl)
            this.preencherCamposAutomaticamente()
            this.verificarLocaisNoErros()
            this.gerarTabela()
        })
        
        this.alphabetEl.addEventListener("focusout", () => {
            this.tirarEspacos(this.alphabetEl)
            this.preencherCamposAutomaticamente()
            this.verificarLocaisNoErros()
            this.gerarTabela()
        })
        
        this.stateBeginEl.addEventListener("focusout", () => {
            this.tirarEspacos(this.stateBeginEl)
            this.preencherCamposAutomaticamente()
            this.verificarLocaisNoErros()
            this.gerarTabela()
        })

        this.stateFinalEl.addEventListener("focusout", () => {
            this.tirarEspacos(this.stateFinalEl)
            this.preencherCamposAutomaticamente()
            this.verificarLocaisNoErros()
            this.gerarTabela()
        })

        this.stateNotFinal.addEventListener("focusout", () => {
            this.tirarEspacos(this.stateNotFinal)
            this.preencherCamposAutomaticamente()
            this.verificarLocaisNoErros()
            this.gerarTabela()
        })

        this.ribbonAlphabetSetsEl.addEventListener("focusout", () => {
            this.tirarEspacos(this.ribbonAlphabetSetsEl)
            this.verificarLocaisNoErros()
            this.gerarTabela()
        })
    }

    tirarEspacos(elem) {
        if(elem.innerText.trim().length > 0) {
            elem.innerText = elem.innerText.trim()
        } else {
            elem.innerText = " "
        }
    }

    verificarLocaisNoErros() {
        this.atribuirErro(this.stateSetsEl, this.isConjuntosEstado())
        this.atribuirErro(this.alphabetEl, this.isAlfaberto())
        this.atribuirErro(this.stateBeginEl, this.isEstadoInicial())
        this.atribuirErro(this.stateFinalEl, this.isEstadoFinal())
        this.atribuirErro(this.ribbonAlphabetSetsEl, this.isAlfabertoFita())
    }

    atribuirErro(el, status) {
        if(el.classList.contains("erro-code") && el.innerText.trim() != "") {
                if(status) {
                    el.classList.remove("erro-code")
                    el.removeAttribute("title")
                }
            } else {
                if(!status && el.innerText.trim() != "") {
                    el.classList.add("erro-code")
                    el.setAttribute("title", "Conjunto Inválido")
                }
            } 
    }

    gerarTabela() {
        this.table.ribbonAlphabet = this.alfaberto_fita
        this.table.init()
    }

    preencherCamposAutomaticamente() {
        if(this.isAlfaberto() && this.alfaberto_fita.length == 0) {
            this.ribbonAlphabetSetsEl.innerText = `${this.alfaberto.join(",")}, ${this.delimitador}, ${this.branco_fita}`
        }

        if(this.isEstadoFinal()) {
            // Colocando os estados não finais como padrão
            this.stateNotFinal.innerText = this.conjunto_estado.filter(value => {
                if(!this.estado_final.includes(value)) {
                    return value
                }
            }).join(", ")
        }
    }

    get conjunto_estado() {
        return this.isConjuntosEstado() ? this.extrairConjuntos(this.stateSetsEl) : []
    }

    isConjuntosEstado() {
        return this.stateSetsEl != undefined && this.isConjuntos(this.stateSetsEl.innerText)
    }

    get alfaberto() {
        if(this.isAlfaberto()) {
            const alf = this.extrairConjuntos(this.alphabetEl)

            return alf
        }
        return []
    }

    isAlfaberto() {
        return this.alphabetEl != undefined && this.isConjuntos(this.alphabetEl.innerText)
    }

    get estado_inicial() {
        return this.isEstadoInicial() ? this.extrairConjuntos(this.stateBeginEl) : []
    }

    isEstadoInicial() {
        const estado_inicial = this.extrairConjuntos(this.stateBeginEl)
        return this.isConjuntos(this.stateBeginEl.innerText) && this.pertence(estado_inicial, this.conjunto_estado)
    }

    get estado_final() {
        if( this.isEstadoFinal()) {
            const conj_estados_finais = this.extrairConjuntos(this.stateFinalEl) 
            return conj_estados_finais
        }
        return []
    }

    isEstadoFinal() {
        const estado_final = this.extrairConjuntos(this.stateFinalEl)
        return this.isConjuntos(this.stateFinalEl.innerText) && this.pertence(estado_final, this.conjunto_estado)
    }

    get estado_nao_final() {
        return this.isEstadoNaoFinal() ? this.extrairConjuntos(this.stateNotFinal) : []
    }

    isEstadoNaoFinal() {
        const estado_nao_final = this.extrairConjuntos(this.stateNotFinal)
        return this.isConjuntos(this.stateNotFinal.innerText) && 
               !this.pertence(estado_nao_final, this.estado_final) && 
               this.pertence(estado_nao_final, this.conjunto_estado)
    }

    get alfaberto_fita() {
        return this.isAlfabertoFita() ? this.extrairConjuntos(this.ribbonAlphabetSetsEl) : []
    }

    isAlfabertoFita() {
        const lista_elementos = this.extrairConjuntos(this.ribbonAlphabetSetsEl)
        let ultimo_elemento =  lista_elementos.length - 1
        let penultimo_elemento = lista_elementos.length - 2

        return lista_elementos.length > 2 && 
                this.isConjuntos(this.ribbonAlphabetSetsEl.innerText) && 
                this.isAlfaberto() &&
                this.isTodosElementoConjuntosPertence(this.alfaberto, lista_elementos) && 
                this.branco_fita == lista_elementos[ultimo_elemento] && 
                this.delimitador == lista_elementos[penultimo_elemento]
    }

    isAlfabertoFitaPreenchida() {
        return this.ribbonAlphabetSetsEl.innerText.trim() != ""
    }

    get delimitador() {
        return setting.SIMBOLOS_ESPECIAIS.DELIMITADOR.SIMBOLO_NIVEL_LABEL
    }

    get branco_fita() {
        return setting.SIMBOLOS_ESPECIAIS.BRANCO_DE_FITA.SIMBOLO_NIVEL_LABEL
    }

    /** MÉTODOS AUXILIARES */
    pertence(subconjunto = [], conjunto_universo = []) {
        return subconjunto.filter(x => conjunto_universo.includes(x)).length > 0
    }

    isConjuntosIguais(conjunto1, conjunto2) {

        if(conjunto1.length == conjunto2.length) {

            let is_igual = true

            for(let i = 0; i < conjunto1.length; i++) {
                is_igual = is_igual && conjunto1[i] == conjunto2[i]
            }

            return is_igual
        }

        return false
    }

    isTodosElementoConjuntosPertence(subconjunto = [], conjunto_universo = []) {
        if(conjunto_universo.length >= subconjunto.length) {
            let is_pertence = true
            for(let i = 0; i < subconjunto.length; i++) {
                is_pertence = is_pertence && conjunto_universo.includes(subconjunto[i])
            }

            return is_pertence
        }

        return false
    }

    extrairConjuntos(el) {

       if(el != undefined && el != null && el.innerText) {
            const texto = el.innerText.trim()
            this.ExpressaoRegular.ExtrairValores.EXTRAIR_ELEMENTO_CONJUNTO.lastIndex = 0
            const elementos_lista = texto.match(this.ExpressaoRegular.ExtrairValores.EXTRAIR_ELEMENTO_CONJUNTO)
            const conjuntos = new Set(elementos_lista)
            return [... conjuntos]
       }

        return []
    }

    isConjuntos(texto) {
        this.ExpressaoRegular.Validadores.VALIDADOR_CONJUNTOS.lastIndex = 0
        return this.ExpressaoRegular.Validadores.VALIDADOR_CONJUNTOS.test(texto)
    }

    getNontupla() {
        return [
            this.conjunto_estado,
            this.alfaberto,
            this.estado_inicial,
            this.estado_final,
            this.estado_nao_final,
            this.alfaberto_fita,
            this.delimitador,
            this.branco_fita
        ]
    }

    isNontuplaValida() {
        return  this.isConjuntosEstado() &&
                this.isAlfaberto() &&
                this.isEstadoInicial() &&
                this.isEstadoNaoFinal() &&
                this.isEstadoNaoFinal() &&
                this.isAlfabertoFita()
    }

}