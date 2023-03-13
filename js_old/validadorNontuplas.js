import * as configuracoes from "./configuracoes.js"
import { TabelaTransicao, GerarTabelaTransicao } from "./manipularTabela.js"

export class ValidadorNonTuplas {
    constructor() {
        this.el_conjunto_estado = document.querySelector(configuracoes.STR_ESTADO_POR_ID)
        this.el_alfaberto = document.querySelector(configuracoes.STR_ALFABERTO_POR_ID)
        this.el_estado_inicial = document.querySelector(configuracoes.STR_ESTADO_INICIAL_POR_ID)
        this.el_estado_final = document.querySelector(configuracoes.STR_ESTADO_FINAL_POR_ID)
        this.el_estado_nao_final = document.querySelector(configuracoes.STR_ESTADO_NAO_FINAl_POR_ID)
        this.el_alfaberto_fita = document.querySelector(configuracoes.STR_ALFABERTO_FITA_POR_ID)
        this.el_delimitador = document.querySelector(configuracoes.STR_DELIMITADOR_POR_ID)
        this.el_branco_fita = document.querySelector(configuracoes.STR_BRANCO_DE_FITA_POR_ID)

        this.ExpressaoRegular = new configuracoes.ExpressaoRegular()
        
        // Tabela de transicao
        this.el_div_tb_content = document.querySelector(configuracoes.STR_TABLE_CONTENT_POR_CLASS)
        this.el_thead_codigo = document.querySelector(configuracoes.STR_TABLE_CABECALHO_POR_ID)
        this.el_tbody_codigo = document.querySelector(configuracoes.STR_TABLE_CORPO_POR_ID)
        
        this.tabelaTransicao = new TabelaTransicao(this)
        
        // Atribuindo eventos a cada elemento da nontupla
        this.eventosFocusOut()

        this.is_tabela_gerada = false
    }

    eventosFocusOut() {
        this.el_conjunto_estado.addEventListener("focusout", () => {
            this.tirarEspacos(this.el_conjunto_estado)
            this.preencherCamposAutomaticamente()
            this.verificarLocaisNoErros()
            this.gerarTabela(!this.is_tabela_gerada)
        })
        
        this.el_alfaberto.addEventListener("focusout", () => {
            this.tirarEspacos(this.el_alfaberto)
            this.preencherCamposAutomaticamente()
            this.verificarLocaisNoErros()
            this.gerarTabela()
        })
        
        this.el_estado_inicial.addEventListener("focusout", () => {
            this.tirarEspacos(this.el_estado_inicial)
            this.preencherCamposAutomaticamente()
            this.verificarLocaisNoErros()
            this.gerarTabela(!this.is_tabela_gerada)
        })

        this.el_estado_final.addEventListener("focusout", () => {
            this.tirarEspacos(this.el_estado_final)
            this.preencherCamposAutomaticamente()
            this.verificarLocaisNoErros()
            this.gerarTabela(!this.is_tabela_gerada)
        })

        this.el_estado_nao_final.addEventListener("focusout", () => {
            this.tirarEspacos(this.el_estado_nao_final)
            this.preencherCamposAutomaticamente()
            this.verificarLocaisNoErros()
            this.gerarTabela(!this.is_tabela_gerada)
        })

        this.el_alfaberto_fita.addEventListener("focusout", () => {
            this.tirarEspacos(this.el_alfaberto_fita)
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
        this.atribuirErro(this.el_conjunto_estado, this.isConjuntosEstado())
        this.atribuirErro(this.el_alfaberto, this.isAlfaberto())
        this.atribuirErro(this.el_estado_inicial, this.isEstadoInicial())
        this.atribuirErro(this.el_estado_final, this.isEstadoFinal())
        this.atribuirErro(this.el_alfaberto_fita, this.isAlfabertoFita())
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

    gerarTabela(is_gerar_novamente = true) {
        if(this.isAlfabertoFitaPreenchida() && is_gerar_novamente) {
            if(this.isNontuplaValida()) {
                this.el_div_tb_content.classList.add("mostrar")
                this.el_div_tb_content.classList.remove("ocultar")
                const gerarTabela = new GerarTabelaTransicao(this.getNontupla(), this.el_thead_codigo, this.el_tbody_codigo)
                gerarTabela.gerarTabela()
                this.tabelaTransicao.monitorandoTabela()
    
                // Focando na primeira linha
                const td_focus = document.querySelector("#primeira-linha-focus")
                td_focus.focus({focusVisible: true})
                
                this.is_tabela_gerada = true
            } else {
                this.el_div_tb_content.classList.add("ocultar")
                this.el_div_tb_content.classList.remove("mostrar")
            }
        }
    }

    preencherCamposAutomaticamente() {
        if(this.isAlfaberto()) {
            this.el_alfaberto_fita.innerText = `${this.alfaberto.join(",")}, ${this.delimitador}, ${this.branco_fita}`
        }

        if(this.isEstadoFinal()) {
            // Colocando os estados não finais como padrão
            this.el_estado_nao_final.innerText = this.conjunto_estado.filter(value => {
                if(!this.estado_final.includes(value)) {
                    return value
                }
            }).join(", ")
        }
    }

    get conjunto_estado() {
        return this.isConjuntosEstado() ? this.extrairConjuntos(this.el_conjunto_estado) : []
    }

    isConjuntosEstado() {
        return this.el_conjunto_estado != undefined && this.isConjuntos(this.el_conjunto_estado.innerText)
    }

    get alfaberto() {
        if(this.isAlfaberto()) {
            const alf = this.extrairConjuntos(this.el_alfaberto)

            return alf
        }
        return []
    }

    isAlfaberto() {
        return this.el_alfaberto != undefined && this.isConjuntos(this.el_alfaberto.innerText)
    }

    get estado_inicial() {
        return this.isEstadoInicial() ? this.extrairConjuntos(this.el_estado_inicial) : []
    }

    isEstadoInicial() {
        const estado_inicial = this.extrairConjuntos(this.el_estado_inicial)
        return this.isConjuntos(this.el_estado_inicial.innerText) && this.pertence(estado_inicial, this.conjunto_estado)
    }

    get estado_final() {
        if( this.isEstadoFinal()) {
            const conj_estados_finais = this.extrairConjuntos(this.el_estado_final) 
            return conj_estados_finais
        }
        return []
    }

    isEstadoFinal() {
        const estado_final = this.extrairConjuntos(this.el_estado_final)
        return this.isConjuntos(this.el_estado_final.innerText) && this.pertence(estado_final, this.conjunto_estado)
    }

    get estado_nao_final() {
        return this.isEstadoNaoFinal() ? this.extrairConjuntos(this.el_estado_nao_final) : []
    }

    isEstadoNaoFinal() {
        const estado_nao_final = this.extrairConjuntos(this.el_estado_nao_final)
        return this.isConjuntos(this.el_estado_nao_final.innerText) && 
               !this.pertence(estado_nao_final, this.estado_final) && 
               this.pertence(estado_nao_final, this.conjunto_estado)
    }

    get alfaberto_fita() {
        return this.isAlfabertoFita() ? this.extrairConjuntos(this.el_alfaberto_fita) : []
    }

    isAlfabertoFita() {
        const lista_elementos = this.extrairConjuntos(this.el_alfaberto_fita)
        let ultimo_elemento =  lista_elementos.length - 1
        let penultimo_elemento = lista_elementos.length - 2

        return lista_elementos.length > 2 && 
                this.isConjuntos(this.el_alfaberto_fita.innerText) && 
                this.isAlfaberto() &&
                this.isTodosElementoConjuntosPertence(this.alfaberto, lista_elementos) && 
                this.branco_fita == lista_elementos[ultimo_elemento] && 
                this.delimitador == lista_elementos[penultimo_elemento]
    }

    isAlfabertoFitaPreenchida() {
        return this.el_alfaberto_fita.innerText.trim() != ""
    }

    get delimitador() {
        return configuracoes.SIMBOLOS_ESPECIAIS.DELIMITADOR.SIMBOLO_NIVEL_LABEL
    }

    get branco_fita() {
        return configuracoes.SIMBOLOS_ESPECIAIS.BRANCO_DE_FITA.SIMBOLO_NIVEL_LABEL
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
        return new Nontupla(
            this.conjunto_estado,
            this.alfaberto,
            this.estado_inicial,
            this.estado_final,
            this.estado_nao_final,
            this.alfaberto_fita,
            this.delimitador,
            this.branco_fita
        )
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

export class Nontupla {
    constructor(conjunto_estado, alfaberto, estado_inicial, estado_final, estado_nao_final, alfaberto_fita, delimitador, branco_fita) {
        this._conjunto_estado = conjunto_estado
        this._alfaberto = alfaberto
        this._estado_inicial = estado_inicial
        this._estado_final = estado_final
        this._estado_nao_final = estado_nao_final
        this._alfaberto_fita = alfaberto_fita
        this._delimitador = delimitador
        this._branco_fita = branco_fita
    }

    get conjunto_estado() {
        return this._conjunto_estado
    }

    get alfaberto() {
        return this._alfaberto
    }

    get estado_inicial() {
        return this._estado_inicial
    }

    get estado_final() {
        return this._estado_final
    }

    get estado_nao_final() {
        return this._estado_nao_final
    }

    get alfaberto_fita() {
        return this._alfaberto_fita
    }

    get delimitador() {
        return this._delimitador
    }

    get branco_fita() {
        return this._branco_fita
    }

}