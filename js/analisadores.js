import { criarElemento, adicionarElemento, trocarValores, SimbolosEspeciais, moverCursorContentEditableFinal } from "./ManipularDOM.js"
import { abrirFecharConsole, setTotErro, setTotAvisos, setConsoleLogs} from "./console.js"

/**
 *
 * Tabela de simbolos
 */
const SimbolosEstaticos = {
    delimitador: {
        display: "&#9658;",
        label: ">"
    },

    branco_fita: {
        display : "&#x411;",
        label: "b"
    }
}

class ExpressaoRegular {
    constructor() {
        this.Validadores = {
            VALIDADOR_CONJUNTOS: /^(\s*[a-zA-Z0-9\>]+\s*)(\,\s*[a-zA-Z0-9\>]+\s*)*$/g,
            VALIDAR_PONTEIRO: /^q[0-9]+$/g,
            VALIDAR_COMANDOS: /^(q[0-9]+)\s+([a-zA-Z0-9\>\Б\►])\s+([R|L|P])$/g
        }

        this.ExtrairValores = {
            EXTRAIR_ELEMENTO_CONJUNTO: /[a-zA-Z0-9\>]+/g
        }

        this.Substituicao = {
            SUBSTITUIR_COMANDOS: /^\s*([qQ][0-9]+)(\s+)([a-pr-zA-KM-OS-Z0-9\>\Б\►])?(\s*)([R|L|P]?)\s*$/g,
            ESTADO: /^\s*([qQ][0-9]+)(\s*)$/g
        }
    }
}

class AnalisadorSintaticoNonTuplas {
    constructor(el_conjunto_estado, el_alfaberto, el_estado_inicial, el_estado_final, el_estado_nao_final, el_alfaberto_fita, el_delimitador, el_branco_fita) {
        this.el_conjunto_estado = el_conjunto_estado
        this.el_alfaberto = el_alfaberto
        this.el_estado_inicial = el_estado_inicial
        this.el_estado_final = el_estado_final
        this.el_estado_nao_final = el_estado_nao_final
        this.el_alfaberto_fita = el_alfaberto_fita
        this.el_delimitador = el_delimitador
        this.el_branco_fita = el_branco_fita
        this.ExpressaoRegular = new ExpressaoRegular()
        
        // Tabela de transicao
        this.el_div_tb_content = document.querySelector(".tb-content")
        this.el_thead_codigo = document.querySelector("#tb-cabecalho")
        this.el_tbody_codigo = document.querySelector("#tb-corpo")
        
        this.tabelaTransicao = new TabelaTransicao(this.el_tbody_codigo, this)
        
        // Atribuindo eventos a cada elemento da nontupla
        this.eventosFocusOut()

        // 
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
                const gerarTabela = new GerarTabelaTransicao(this.getNontupla(), el_thead_codigo, el_tbody_codigo)
                gerarTabela.gerarTabela()
                tabelaTransicao.monitorandoTabela()
    
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
        return SimbolosEstaticos.delimitador.label
    }

    get branco_fita() {
        return SimbolosEstaticos.branco_fita.label
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

class Nontupla {
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

class GerarTabelaTransicao {
    constructor(nontuplaObj, thead, tbody) {
        this.nontuplaObj = nontuplaObj
        this.thead = thead
        this.tbody = tbody

        this.gerarTabela()
    }

    gerarTabela() {
        this.thead.innerHTML = ""
        this.tbody.innerHTML = ""
        adicionarElemento(this.thead, this.gerarCabecalho())
        adicionarElemento(this.tbody, this.gerarCorpo())
    }

    gerarCabecalho() {
        const tr = criarElemento("tr");

        const thlinha = criarElemento("th", null, {
            class: "cmd-linha cl-codigo"
        })
        const thinfor = criarElemento("th")
        const divinfo = criarElemento("div")
        const divestado = criarElemento("div", "Q", {
            class: "estado"
        })
        const divsigma = criarElemento("div", "&Sigma;", {
            class: "sigma"
        })

        // Adicionando os elemento estáticos
        adicionarElemento(tr, thlinha)

        adicionarElemento(divinfo, divsigma)
        adicionarElemento(divinfo, divestado)
        adicionarElemento(thinfor, divinfo)

        adicionarElemento(tr, thinfor)

        this.adicionarAlfabetoFita(tr)

        return tr
    }

    gerarCorpo() {
        const tr = criarElemento("tr")

        const tdlinha = criarElemento("td", "1", {
            class: "cmd-linha"
        })
        adicionarElemento(tr, tdlinha)

        // Linhas Dinamica
        for(let i = 0; i <= this.totAlfabetoFita(); i++) {

            if(i == 0) {
                this.el_primeiraLinha = criarElemento("td", null, {
                    "contenteditable": "true",
                    "estado-apontador": "",
                    "tabindex": "0",
                    "id": "primeira-linha-focus"
                })

                adicionarElemento(tr, this.el_primeiraLinha)
            } else {
                adicionarElemento(tr, criarElemento("td", null, {
                    "contenteditable": "true"
                }))
            }
            
        }

        return tr
    }

    adicionarAlfabetoFita(tr) {
        this.nontuplaObj.alfaberto_fita.forEach(fita => {
            let th = criarElemento("th", fita)
            adicionarElemento(tr, th)
        })
    }

    totAlfabetoFita() {
        return this.nontuplaObj.alfaberto_fita.length
    }
}

class TabelaTransicao {
    constructor(el_tbody, analisadorSintaticoNontupla) {
        this.el_tbody = el_tbody
        this._ultima_linha = 0;
        this.analisadorSintaticoNontupla = analisadorSintaticoNontupla

        // TECLAS
        this.TECLA_TAB = 9
        this.TECLA_ENTER = 13
        this.DELETE = 8

        this.el_primeiraLinha = undefined

        this.isCtrlPrecionado = false
        this.IsLetraA = false
    }

    get ultima_linha() {
        return this.getLinhas().length
    }


    monitorandoTabela() {
        let tot_linha = 0
        for(let linha of this.getLinhas()) {

            for(let coluna of this.getColuna(linha)) {

                if(coluna.classList.contains('cmd-linha')) {
                    coluna.innerText = tot_linha + 1
                } else if(coluna.hasAttribute("estado-apontador")) {
                    this.apontadorFormatoChange(coluna)
                } else {
                    this.codigoFormatadoChange(coluna)
                }

                this.ultimaLinhaEvento(linha, coluna, tot_linha)
            }

            if(tot_linha > 0) {
                this.addEventoRemoverUltimaLinha(linha)
            }

            tot_linha++
        }

    }

    apontadorFormatoChange(td) {
        const callback = () => {
            let exRegular = new ExpressaoRegular()
            td.innerHTML = td.innerText.replace(exRegular.Substituicao.ESTADO, `<span class='cmd-apontador'>$1</span>`)
        }
        td.addEventListener("keyup", (e) => {
            if(!this.isCtrlPrecionado) {
                this.isCtrlPrecionado = e.keyCode == 17
            } 

            if(this.isCtrlPrecionado && !this.IsLetraA) {
                this.IsLetraA = e.keyCode == 65
            } else if(this.isCtrlPrecionado) {
                this.isCtrlPrecionado = false
            }

            if(this.isCtrlPrecionado && this.IsLetraA) {
                this.isCtrlPrecionado = false
                this.IsLetraA = false
            }else if(e.keyCode >= 48 && e.keyCode <= 126 || e.keyCode == 9) {
                callback()
                moverCursorContentEditableFinal(td)
            }
        })
        
        td.addEventListener("focus", callback)
        td.addEventListener("blur",  callback)
    }

    codigoFormatadoChange(td) {

        const callback = () => {
            let exRegula = new ExpressaoRegular()
            td.innerHTML = td.innerText.replace(exRegula.Substituicao.SUBSTITUIR_COMANDOS, "<span class='cmd-estado'>$1</span> <span class='cmd-transicao'>$3</span> <span class='cmd-direcao'>$5</span>")
        }

        td.addEventListener("keyup", (e) => {
            if(!this.isCtrlPrecionado) {
                this.isCtrlPrecionado = e.keyCode == 17
            } 

            if(this.isCtrlPrecionado && !this.IsLetraA) {
                this.IsLetraA = e.keyCode == 65
            } else if(this.isCtrlPrecionado) {
                this.isCtrlPrecionado = false
            }

            if(this.isCtrlPrecionado && this.IsLetraA) {
                this.isCtrlPrecionado = false
                this.IsLetraA = false
            }else if(e.keyCode >= 48 && e.keyCode <= 126 || e.keyCode == 9) {
                callback()
                moverCursorContentEditableFinal(td)
            }
        })

        td.addEventListener("focus", callback)
        td.addEventListener("blur",  callback)
    }

    addEventoRemoverUltimaLinha(linha) {
        const td = linha.querySelector("[estado-apontador]")

        const listener = (linha, e) => {
            
            if(td.innerText.trim() == "" && e.keyCode == this.DELETE) {
                try {
                    this.el_tbody.removeChild(linha)
                } catch(e) {
                    console.log(e)
                } finally {
                    this.monitorandoTabela()
                }
            }
        } 

        td.onkeydown = e => {
            listener(linha, e)
        }
    }

    ultimaLinhaEvento(linha, coluna, tot) {
        const obj_escopo = this

        if(this.isUltimaLinha(coluna)) {
            
            // Gerar uma nova linha
            const listener = e => {
                if(e.keyCode == obj_escopo.TECLA_TAB || e.keyCode == obj_escopo.TECLA_ENTER) {
                    e.preventDefault()
                    
                    const el_nova_linha = obj_escopo.gerarNovaLinha(tot)
                    obj_escopo.el_tbody.appendChild(el_nova_linha)
                    obj_escopo.getColuna(el_nova_linha)[1].focus()

                    obj_escopo.monitorandoTabela()
                }
            }

            coluna.onkeydown = listener

        } else {
            coluna.onkeydown = e => {
                if(obj_escopo.TECLA_ENTER == e.keyCode) {
                    e.preventDefault()
                }
            }
        }
    }

    gerarNovaLinha(tot) {
       const tr = criarElemento("tr")
       const total_nontuplas = this.analisadorSintaticoNontupla.getNontupla().alfaberto_fita.length + 1

       for(let contador = 0; contador <= total_nontuplas; contador++) {
            if(contador == 0) { // gera o td com o número da linha
                tr.appendChild(criarElemento("td", tot + 2, {
                    class: "cmd-linha"
                }))

            } else if(contador == 1) {
                tr.appendChild(criarElemento("td", null, {
                    "contenteditable": "true",
                    "estado-apontador": ""
                }))
            } else {
                tr.appendChild(criarElemento("td", null, {
                    "contenteditable": "true"
                }))
            }
       }

       return tr
    }

    getLinhas() {
        return this.el_tbody.querySelectorAll("tr");
    }

    getColuna(el_linha) {
        return el_linha.querySelectorAll("td")
    }

    isUltimaLinha(el_td) {
        const total_nontuplas = this.analisadorSintaticoNontupla.getNontupla().alfaberto_fita.length

        if(this.getLinhas().length > 0 && total_nontuplas > 0) {
            const pos_ultima_linha = this.getLinhas().length - 1
            const pos_ultima_coluna = total_nontuplas

            const ultima_linha = this.getColuna(this.getLinhas()[pos_ultima_linha])
            return ultima_linha[pos_ultima_coluna + 1] == el_td
        }
        return false
    }
}

/** DECLARAÇÃO DE VARIAVEIS */

// ELEMENTOS DOM DA NONTUPLAS
const el_estados = document.querySelector("#estados")
const el_alfaberto = document.querySelector("#alfaberto")
const el_estado_inicial = document.querySelector("#estado-inicial")
const el_estado_final = document.querySelector("#estado-final")
const el_estado_nao_final = document.querySelector("#estado-nao-final")
const el_alfaberto_fita = document.querySelector("#alfaberto-fita")
const el_delimitador = document.querySelector("#delimitador")
const el_branco_fita = document.querySelector("#branco-fita")

// TABELA DE TRANSIÇÕES
const el_div_tb_content = document.querySelector(".tb-content")
const el_thead_codigo = document.querySelector("#tb-cabecalho")
const el_tbody_codigo = document.querySelector("#tb-corpo")

// OBJETOS
const analisadorSintaticoNontupla = new AnalisadorSintaticoNonTuplas(el_estados, el_alfaberto, el_estado_inicial, el_estado_final, el_estado_nao_final, el_alfaberto_fita, el_delimitador, el_branco_fita)
const tabelaTransicao = new TabelaTransicao(el_tbody_codigo, analisadorSintaticoNontupla)

const Dicionario = {
    MOVER: {
        R: "R",
        L: "L",
        P: "P"
    }
}

const ListaTokens = {
    ESTADO: 100,
    ALFABERTOFITA: 200,
    MOVIMENTO: 300,
    PONTOVIRGULA: 400,
    DELIMITADOR_APONTADOR: 500,
    NOVA_LINHA: 600
}

class AnalisadorLexico {
    constructor() {
        this.el_table_row = document.querySelectorAll("#tb-corpo tr")
        this.string_lang = ""
        
        /**
         * Guardará uma sequência de token no formato [token, valor, linha, coluna]
         */
        this.tabelaSimbolos = []

        /**
         * Guardará os erros de reconhecimentos de lexemas [mensage, linha, coluna]
         */
        this.errorList = []
    }


    /**
     * Ler a tabela gerada no HTML e gera a sequência de caracteres
     */
    lerTabela() {
        // Lendo as linhas
        for(let i = 0; i < this.el_table_row.length; i++) {
            const table_data = this.el_table_row[i].querySelectorAll("td:not(.cmd-linha)")

            // lendos as colunas
            for(let j = 0; j < table_data.length; j++) {

                if(j == 0) {
                    this.string_lang += '$'
                }

                this.string_lang += `${table_data[j].innerText.trim()}; `
            }

            this.string_lang += "\n "
        }
    }

    /**
     * Será gerado a tabela de símbolos através da implementação do autômato finito deterministico - AFD.
     * Será gerado a tabela de simbolo que será compartilhado para qualquer fase de analise. 
     */
    gerarTokens() {
        let pos = 0
        let tot_linha = 1
        let tot_coluna = 1

        let estado_atual = 0;
        const ESTADO = {
            Q0: 0,
            Q1: 1,
            Q2: 2,
            Q3: 3,
            Q4: 4,
            Q5: 5,
            Q6: 6,
            Q8: 8,
            REJEICAO: 7
        }

        let cadeia = ""
        while(pos < this.string_lang.length) {
            let caracter =  this.string_lang[pos]

            switch(estado_atual) {
                case ESTADO.Q0:
                    if(caracter == 'Q' || caracter == 'q') {
                        estado_atual = ESTADO.Q1
                        cadeia += caracter
                    } else if(this.isQuebraLinha(caracter)) {
                        estado_atual = ESTADO.Q8;
                        tot_linha++
                        tot_coluna = 1
                        cadeia += caracter
                    } else if(caracter == ';') {
                       estado_atual = ESTADO.Q3
                       cadeia += caracter
                    } else if(this.isAlfabertoFita(caracter)) {
                        estado_atual = ESTADO.Q4
                        cadeia += caracter
                    } else if(this.isMovimentador(caracter)) {
                        estado_atual = ESTADO.Q5
                        cadeia += caracter
                    } else if(caracter == '$') {
                        estado_atual = ESTADO.Q6
                        cadeia += caracter
                    } else if(!this.isIguinorarCaracter(caracter)) {
                        estado_atual = ESTADO.REJEICAO
                        cadeia += caracter
                    }
                    break
                case ESTADO.Q1:
                    if(this.isNumero(caracter)) {
                        estado_atual = ESTADO.Q2
                        cadeia += caracter
                    } else {
                        estado_atual = ESTADO.REJEICAO
                        cadeia += caracter
                    }
                    break
                case ESTADO.Q2:
                    if(this.isNumero(caracter)) {
                        estado_atual = ESTADO.Q2
                        cadeia += caracter
                    }else if(!this.isNumero(caracter)) {
                        estado_atual = ESTADO.Q0
                        pos-- // Back()
                        this.setTabelaSimbolos(ListaTokens.ESTADO, cadeia, tot_linha, tot_coluna)
                        cadeia = ""
                    } else {
                        estado_atual = ESTADO.REJEICAO
                    }
                    break
                    case ESTADO.Q3: 
                    estado_atual = ESTADO.Q0
                    pos--
                    this.setTabelaSimbolos(ListaTokens.PONTOVIRGULA, cadeia, tot_linha, tot_coluna)
                    tot_coluna++
                    cadeia = ""
                    break
                case ESTADO.Q4:
                    estado_atual = ESTADO.Q0
                    pos--
                    this.setTabelaSimbolos(ListaTokens.ALFABERTOFITA, cadeia, tot_linha, tot_coluna)
                    cadeia= ""
                    break
                case ESTADO.Q5:
                    estado_atual = ESTADO.Q0
                    pos--
                    this.setTabelaSimbolos(ListaTokens.MOVIMENTO, cadeia, tot_linha, tot_coluna)
                    cadeia = ""
                    break
                case ESTADO.Q6:
                    estado_atual = ESTADO.Q0
                    pos--
                    this.setTabelaSimbolos(ListaTokens.DELIMITADOR_APONTADOR, cadeia, tot_linha, tot_coluna)
                    cadeia = ""
                    break
                case ESTADO.Q8:
                    estado_atual = ESTADO.Q0
                    pos--
                    this.setTabelaSimbolos(ListaTokens.NOVA_LINHA, cadeia, tot_linha, tot_coluna)
                    cadeia = ""
                    break
                case ESTADO.REJEICAO:
                    if( caracter != 'Q' && 
                        caracter != 'q' && 
                        !this.isNumero(caracter) && 
                        !this.isAlfabertoFita(caracter) && 
                        !this.isIguinorarCaracter(caracter) &&
                        !this.isMovimentador(caracter) &&
                        !this.isQuebraLinha(caracter)
                    ) {
                        estado_atual = ESTADO.REJEICAO
                        cadeia += caracter
                    } else {
                        estado_atual = ESTADO.Q0
                        pos--
                        this.setErros(`A cadeia "${cadeia}" não foi reconhecida!`, tot_linha, tot_coluna)
                        cadeia = ""
                    }
                
            }

            pos++;
        }
    }

    setErros(mensagem, linha, coluna) {
        this.errorList.push({
            mensagem: `<span class='erro-code'>${mensagem}</span>`,
            linha,
            coluna
        })
    }

    setTabelaSimbolos(token, valor, linha, coluna) {
        this.tabelaSimbolos.push({
            token,
            valor,
            linha,
            coluna
        })
    }

    isAlfabertoFita(carater) {
        return  this.isNumero(carater) ||
                carater >= 'a' && carater <= 'p' ||
                carater >= 'r' && carater <= 'z' ||
                carater >= 'A' && carater <= 'K' ||
                carater >= 'M' && carater <= 'O' ||
                carater >= 'S' && carater <= 'Z' ||
                carater == SimbolosEspeciais.branco_fita.simbolo1 ||
                carater == SimbolosEspeciais.branco_fita.simbolo2 ||
                carater == SimbolosEspeciais.delimitador.simbolo1 ||
                carater == SimbolosEspeciais.delimitador.simbolo2 ||
                carater == '+' ||
                carater == '-' ||
                carater == '*' ||
                carater == '/'
    }

    isMovimentador(caracter) {
        return caracter == 'P' || caracter == 'R' || caracter == 'L'
    }

    isQuebraLinha(caracter) {
        return caracter == '\n'
    }

    isIguinorarCaracter(caracter) {
        return caracter[0] == '\s' || caracter[0] == '\r' || caracter[0] == '\b' || caracter[0] == ' ' || caracter == " "
    }

    isNumero(caracter) {
        return caracter >= '0' && caracter <= '9'
    }

}

class AnalisadorSintatico {
    constructor(obj_nontuplas) {
        this.analisadorLexico = new AnalisadorLexico()
        this.obj_nontuplas = obj_nontuplas
        this.comandos = []

        this.lookahead = 0
        this.errosSintaticos = []
        this.avisosSintaticos = []

        this.analisadorLexico.lerTabela()
        this.analisadorLexico.gerarTokens()

        // Analisador sematico
        this.analisadorSematico = new AnalisadorSemantico()

        if(this.analisadorLexico.errorList.length == 0) {
            this.programa()

            this.verificarDeclaracaoTodosEstados()
            this.verificarErrosMovimentadorParada()
            this.verificarErrosEstadoInicial()
            this.verificarErrosEstadoFinal()
        }
    }

    // Gramatica livre de contexto
    programa() {
        const stmt = this.analisadorLexico.tabelaSimbolos[this.lookahead]

        if(stmt == undefined) return

        if(stmt.token == ListaTokens.DELIMITADOR_APONTADOR) {
            this.delimitadorApontador()
            this.estado()
            if(!this.analisadorSematico.estado_apontador_declarado.has(this.analisadorSematico.estado)) {
                if(this.obj_nontuplas.estado_final.some(estado_final => estado_final == this.analisadorSematico.estado)) {
                    this.setAvisos(`O Estado "${this.analisadorSematico.estado}" não pode ser declarado. Estado final não precisa ser declarado na primeira coluna.`)
                } else {
                    this.analisadorSematico.estado_apontador_declarado.set(this.analisadorSematico.estado, ListaTokens.ESTADO)
                    this.analisadorSematico.estado_apontador = this.analisadorSematico.estado
                }
            } else {
                this.setErros(`O ESTADO "${this.analisadorSematico.estado}" já foi declarado.`, this.analisadorSematico.num_linha, this.analisadorSematico.num_coluna)
            }

            this.pontoVirgula()
            this.comando()
            this.programa()
        }
    }

    delimitadorApontador() {
        const stmt = this.analisadorLexico.tabelaSimbolos[this.lookahead]

        if(stmt.token != ListaTokens.DELIMITADOR_APONTADOR) {
            this.setErros(`Deve haver um operador no código-fonte que simboliza estado apontador"`, stmt.linha, stmt.coluna)
        }

        this.proximoToken()
    }
    
    pontoVirgula(apontador = true) {
        const stmt = this.analisadorLexico.tabelaSimbolos[this.lookahead]

        if(stmt.token != ListaTokens.PONTOVIRGULA) {
            this.setErros(`${apontador ? "Deve haver somente único ESTADO. Deve ser q0 até qN, tal que qN pertença ao conjuntos de estados." : "Deve haver &lt;ESTADO&gt;&lt;ALFABERTO DE FITA&gt;&lt;MOVIMENTADOR&gt;: Exemplo de comando: \"qN A M\", esses elementos deve pertence ao conjuntos informado na nontuplas."}`, stmt.linha, stmt.coluna)
        }

        this.proximoToken()
    }

    comando() {
        const stmt = this.analisadorLexico.tabelaSimbolos[this.lookahead]

        if(stmt == undefined) return;
    
        if(stmt.token == ListaTokens.ESTADO ) {
            this.estado()
            this.alfabertoFita()
            this.movimento()
            this.analisadorSematico.setComandos()
            this.comandos.push({
                estado_apontador: this.analisadorSematico.estado_apontador,
                estado: this.analisadorSematico.estado,
                alfaberto_fita_header: this.obj_nontuplas.alfaberto_fita[stmt.coluna-2],
                alfaberto_fita_subs: this.analisadorSematico.alfaberto_fita,
                movimentador: this.analisadorSematico.movimentador
            })

            this.pontoVirgula(false)
            this.comando()
        } else if(stmt.token == ListaTokens.PONTOVIRGULA) {
            this.pontoVirgula(false)
            this.comando()
        } else if(stmt.token == ListaTokens.NOVA_LINHA) {
            this.proximoToken();
            this.programa();
        } else {
            this.setErros(`Deve haver &lt;ESTADO&gt;&lt;ALFABERTO DE FITA&gt;&lt;MOVIMENTADOR&gt;: Exemplo de comando: \"qN A M\", esses elementos deve pertence ao conjuntos informado na nontuplas.`, stmt.linha, stmt.coluna)
        }
    }

    estado() {
        const stmt = this.analisadorLexico.tabelaSimbolos[this.lookahead]

        if(stmt.token != ListaTokens.ESTADO) {
            this.setErros(`Esperava um ESTADO, e não um "${stmt.valor != ";"? stmt.valor : "" }". Para ser um estado válido, os estados deve ser de q0, q1, q2, ... qN.`, stmt.linha, stmt.coluna)
        } else if(stmt != null) {
           if(!this.obj_nontuplas.conjunto_estado.some(estado => estado == stmt.valor)) {
                this.setAvisos(`O Estado "${stmt.valor}" não pertence ao conjuntos de estados informado na nontuplas.`, stmt.linha, stmt.coluna)
           } 
        }

        // Será usada para fazer analise sematica
        this.analisadorSematico.setEstado(stmt.valor, stmt.linha, stmt.coluna)

        this.proximoToken()
    }

    alfabertoFita() {
        const stmt = this.analisadorLexico.tabelaSimbolos[this.lookahead]

        if(stmt.token != ListaTokens.ALFABERTOFITA) {
            this.setErros(`Esperava um ALFABERTO DE FITA e não um "${stmt.valor != ";" ? stmt.valor : ""}"`, stmt.linha, stmt.coluna)
        } else if(stmt != null) {

            // Verificando se o alfaberto de fita pertence ao conjuntos de alfaberto declarada na nontuplas
            if(!this.obj_nontuplas.alfaberto_fita.some(alfaberto_fita => alfaberto_fita == stmt.valor)) {
                this.setAvisos(`O Alfaberto de fita "${stmt.valor}" não pertence ao conjuntos de alfaberto de fita informada na nontuplas.`, stmt.linha, stmt.coluna)
           } 
        }

        this.analisadorSematico.setAlfaberto(stmt.valor, stmt.linha, stmt.coluna)
        this.proximoToken()
    }

    movimento() {
        const stmt = this.analisadorLexico.tabelaSimbolos[this.lookahead] 

        if(stmt.token != ListaTokens.MOVIMENTO) {
            this.setErros(`Esperava um MOVIMENTADOR não um "${stmt.valor != ";" ? stmt.valor : ""}". O movimentador válido são: R, L ou P e somente um deles.`, stmt.linha, stmt.coluna)
        }

        if(!this.isEstadoFinal) {
           this.isEstadoFinal = Dicionario.MOVER.P == stmt && this.obj_nontuplas.estado_final.some(estado_final => estado_final == this.atributos.estado)
        }

        this.analisadorSematico.setMovimentador(stmt.valor, stmt.linha, stmt.coluna)
        this.proximoToken()
    }

    proximoToken() {
        this.lookahead++
    }

    setErros(msg, linha, coluna) {
        this.errosSintaticos.push({
            mensagem: `<span class='erro-code'>${msg}</span>`,
            linha: linha ?? 0,
            coluna: coluna ?? 0
        })
    }

    setAvisos(msg, linha, coluna) {
        this.avisosSintaticos.push({
            mensagem: `<span class='aviso-code'>${msg}</span>`,
            linha: linha ?? 0,
            coluna: coluna ?? 0
        })
    }


    verificarErrosMovimentadorParada() {
        const movimentador_parada = this.analisadorSematico.movimentadorList.filter(mov => mov.movimentador == Dicionario.MOVER.P)

        if(movimentador_parada.length == 0) {
            this.setAvisos(`Foi detectado possível loop infinito, por favor verifique seu código e certifique de colocar o movimentador "${Dicionario.MOVER.P}".`, 0, 0)
        } 

        if(movimentador_parada.length > 1) {
           this.setAvisos(`Existe duplicidade de comando de parada! Só pode haver somente um único comando movimentador "${Dicionario.MOVER.P}".`, 0, 0)
        }
    }

    verificarErrosEstadoInicial() {
        const estado_inicial = this.analisadorSematico.comandosList.filter(cmd => cmd.estado == this.obj_nontuplas.estado_inicial.join(' ').trim() && 
                                                                                  (cmd.alfaberto_fita == SimbolosEspeciais.delimitador.simbolo1 ||  cmd.alfaberto_fita == SimbolosEspeciais.delimitador.simbolo2) &&
                                                                                  cmd.movimentador == Dicionario.MOVER.R)

        // Verifica se o estado de partida está na coluna do delimitador de fita
        let posDelimitadorColuna = this.obj_nontuplas.alfaberto_fita.indexOf(SimbolosEspeciais.delimitador.simbolo1) + 2
        // Verifica se há algum comando de partida informada
        if(estado_inicial.length == 0) {
            this.setAvisos(`Não foi encontrado o estado de partida (estado inicial). O estado inicial deve está no formato "${this.obj_nontuplas.estado_inicial.join('')} ${SimbolosEspeciais.delimitador.simbolo1} ${Dicionario.MOVER.R}".`, 1, posDelimitadorColuna)
            return
        }


        if(estado_inicial[0].coluna != posDelimitadorColuna) {
            this.setAvisos(`Não foi encontrado o estado inicial na coluna do delimitador na linha 1 e coluna ${posDelimitadorColuna}.`, 0, 0)
        }

    }

    verificarErrosEstadoFinal() {
        const estado_final = this.analisadorSematico.comandosList.filter(cmd => cmd.estado == this.obj_nontuplas.estado_final.join('').trim() && cmd.movimentador == Dicionario.MOVER.P)

        if(estado_final.length == 0) {
            this.setAvisos(`Não foi encontrado o estado final "${this.obj_nontuplas.estado_final.join('')}" codificado. Por favor codifique o estado final`)
        }
    }

    verificarDeclaracaoTodosEstados() {
        const estados_nao_finais_nao_declados = this.obj_nontuplas.estado_nao_final.filter(estados_nao_finais => !this.analisadorSematico.estado_apontador_declarado.has(estados_nao_finais))

        if(estados_nao_finais_nao_declados.length > 0) {
            this.setAvisos(`Os estados "{${estados_nao_finais_nao_declados.join(', ')}}" precisa ser declarado na primeira coluna.`)
        }
    }

    isErrosOuAvisos() {
        return this.errosSintaticos.length > 0 || this.analisadorLexico.errorList.length > 0 || this.avisosSintaticos.length > 0
    }

}

class AnalisadorSemantico {
    constructor() {
        this.estado_apontador = null
        this.estado = null
        this.alfaberto_fita = null
        this.movimentador = null

        this.num_linha = 0
        this.num_coluna = 0

        this.estado_apontador_declarado = new Map()
        this.estado_inicial_declarado = new Map()
        this.estado_final_declarado = new Map()
        
        this.comandosList = []
        this.movimentadorList = []

        this.matrAdjacente = new Map()
    }

    setEstado(estado, linha, coluna) {
        this.estado = estado.trim()
        this.num_linha = linha
        this.num_coluna = coluna
    }

    setAlfaberto(alfaberto_fita, linha, coluna) {
        this.alfaberto_fita = alfaberto_fita.trim()
        this.num_linha = linha
        this.num_coluna = coluna
    }

    setMovimentador(movimentador, linha, coluna) {
        this.movimentador = movimentador.trim()
        this.num_linha = linha
        this.num_coluna = coluna
        this.setMovimentadorList()
    }

    setComandos() {
        this.comandosList.push({
            estado: this.estado,
            alfaberto_fita: this.alfaberto_fita,
            movimentador: this.movimentador,
            linha: this.num_linha,
            coluna: this.num_coluna
        })
    }

    setMovimentadorList() {
        this.movimentadorList.push({
            movimentador: this.movimentador,
            linha: this.num_linha,
            coluna: this.num_coluna
        })
    }

}

class Linguagem {
    constructor(el_tbody, obj_nontuplas) {
        const escopo = this
        this.el_fita = document.querySelector(".fitas")
        this.el_entrada = document.querySelectorAll(".fitas > div")
        // this.el_tbody = el_tbody
        this.obj_nontuplas = obj_nontuplas
        this.el_ponteiro = document.querySelector("#cabecote")

        this.analisadorSintatico = new AnalisadorSintatico(obj_nontuplas)
        this.is_executar = !this.analisadorSintatico.isErrosOuAvisos()

        // Parte que será mostrada no console
        this.el_cli = document.querySelector(".cmd-line-display")
        
        // Variavel de controle
        this.el_btn_parar = document.querySelector(".btn.parar")
        this.is_parar = false
        this.el_btn_parar.addEventListener("click", () => {
            escopo.is_parar = true
        }, true)
        
        
       this.el_range_input = document.querySelector("#velocidade")
       this.setVelocidade()
    }

    setVelocidade() {
        this.calcularVelocidade()
        this.time = 500 * Number(this.el_range_input.value) / 
        this.el_range_input.addEventListener("change", (e) => {
            this.calcularVelocidade()
        })
    }

    calcularVelocidade() {
        const valorAtual = Number(this.el_range_input.value)
        this.time = Math.floor(1 / valorAtual * 500)
    } 


    mostrarBarraRolagem() {
        if(this.el_fita.classList.contains("rolagem")) {
            this.el_fita.classList.remove("rolagem")
            this.el_ponteiro.classList.add("rolagem")
        } else {
            this.el_fita.classList.add("rolagem")
            this.el_ponteiro.classList.remove("rolagem")
        }
    }

    async executarComandos() {
        this.mostrarValidCadeia(true)
        this.setErrosConsoles()
        
        if(this.is_executar) {
            this.lerComandos()
        }
    }

    statusBtnExecutar(executando = false) {
        const btn_executar = document.querySelector(".executar")
        const btn_resertar = document.querySelector(".resertar")
        const btn_parar = document.querySelector(".parar")

        if(!executando) {
            btn_executar.removeAttribute("disabled")
            btn_resertar.removeAttribute("disabled")
            btn_parar.setAttribute("disabled", "")
           
        } else {
            btn_executar.setAttribute("disabled", "")
            btn_resertar.setAttribute("disabled", "")
            btn_parar.removeAttribute("disabled")
        }
    }
    
    async lerComandos() {

        // Contadores
        let contador = 0
        let totRodada = 0
        
        // DOM
        this.mostrarBarraRolagem()
        this.setPosCabecote()
        this.statusBtnExecutar(true)

        // Coloca o estado inicial declarado na nontupla
        let estado = this.obj_nontuplas.estado_inicial.join('').trim()
        
        // Executa os comandos
        while(contador >= 0 && totRodada <= 3000 && !this.is_parar) {
            let entrada = this.el_entrada[contador].innerText.trim()

            entrada = entrada.replace(SimbolosEspeciais.delimitador.simbolo2, SimbolosEspeciais.delimitador.simbolo1)
            entrada = entrada.replace(SimbolosEspeciais.branco_fita.simbolo2, SimbolosEspeciais.branco_fita.simbolo1)

            const cmds = this.analisadorSintatico.comandos.filter(cmd => cmd.alfaberto_fita_header == entrada && cmd.estado_apontador == estado)[0]

            if(cmds != undefined) {
                estado = cmds.estado
                document.querySelector("#estado-display").innerText = estado

                if(Dicionario.MOVER.L == cmds.movimentador) {
                    this.setEntrada(contador, cmds.alfaberto_fita_subs)
                    await this.moverEsquerda(this.el_entrada[contador], contador)
                    contador--
                }

                if(Dicionario.MOVER.R == cmds.movimentador) {
                    this.setEntrada(contador, cmds.alfaberto_fita_subs)
                    await this.moverDireita(this.el_entrada[contador], contador)
                    contador++
                } 
                
                if(Dicionario.MOVER.P == cmds.movimentador) {
                    await this.dormir(this.time)
                    this.setEntrada(contador, cmds.alfaberto_fita_subs)
                    await this.dormir(this.time)
                }


                if(Dicionario.MOVER.P == cmds.movimentador) break
            }

            totRodada++
        }

        this.mostrarBarraRolagem();
        this.setPosCabecote()
        this.setValidarCadeia(this.is_parar)
        this.statusBtnExecutar(false)
    }

    mostrarValidCadeia(esconder =  false) {
        const span = document.querySelector("#cadeia-info")

        if(span.style.display.trim() == 'flex' || esconder) {
            span.style.display = 'none'
        } else {
            span.style.display = 'flex'
        }
    }

    setValidarCadeia(is_parar = false) {
        const saida = document.querySelector("#estado-display")
        const span = document.querySelector("#cadeia-info")

       this.mostrarValidCadeia()
        if(saida.innerText.trim() == this.obj_nontuplas.estado_final.join('').trim()) {
            span.innerHTML = '<i class="fa-solid fa-circle-check"></i>&nbsp;Aceita!'
            span.classList.add("aceita")
            span.classList.remove("rejeicao")
        } else {
            span.innerHTML = `<i class="fa-solid fa-circle-xmark"></i>&nbsp;${is_parar ? "Interrompido" : "Rejeição"}`
            span.classList.add("rejeicao")
            span.classList.remove("aceita")
        }

    }

    setEntrada(pos, caracter) {

        if(caracter == SimbolosEspeciais.branco_fita.simbolo1) {
            this.el_entrada[pos].innerText = SimbolosEspeciais.branco_fita.simbolo2
        } else if (caracter == SimbolosEspeciais.delimitador.simbolo1) {
            this.el_entrada[pos].innerText = SimbolosEspeciais.delimitador.simbolo2
        } else {
            this.el_entrada[pos].innerText = caracter
        }
    }

    setPosCabecote() {
        // Resertando configurações de estilo colocaod pelo script
        this.el_ponteiro.style.left = '0px'
        this.el_fita.scrollLeft = 0
        //document.querySelector("#estado-display").innerHTML = '-';
    }

    setErrosConsoles() {
        abrirFecharConsole(!this.is_executar)
        setConsoleLogs(this.analisadorSintatico.analisadorLexico.errorList, this.analisadorSintatico.errosSintaticos, this.analisadorSintatico.avisosSintaticos)
    }

    // Move o cabecote para o lado direto da fita
    async moverDireita(el_cedula, pos) {
        pos++;
        await this.dormir(this.time)
        
        const coords_cedula = el_cedula.getBoundingClientRect()
        const coords_fita = this.el_fita.getBoundingClientRect()

        this.calcularVelocidade()
        const quadro_por_segundos = Math.floor(10 * this.time / 500)
        if(pos * coords_cedula.width - coords_cedula.width / 2 >= coords_fita.width / 2 && this.el_fita.scrollWidth - coords_fita.width != this.el_fita.scrollLeft) {
            let inicio = this.el_fita.scrollLeft
            for(let i = inicio; i <= inicio + coords_cedula.width; i++) {
                await this.dormir(quadro_por_segundos)
                this.el_fita.scrollLeft = i
            }
            await this.dormir(quadro_por_segundos)
        } else {
            for(let i = this.el_ponteiro.offsetLeft; i < coords_cedula.left + coords_cedula.width / 2; i++) {
                await this.dormir(quadro_por_segundos)
                this.el_ponteiro.style.left = `${i}px`
            }
        }


    }

    // Move o cabeçote para lado esquerdo da fita
    async moverEsquerda(el_cedula, pos) {
        pos--
        await this.dormir(this.time)
        
        const coords_cedula = el_cedula.getBoundingClientRect()
        const coords_fita = this.el_fita.getBoundingClientRect()

        this.calcularVelocidade()
        const quadro_por_segundos = Math.floor(10 * this.time / 500)
        if(pos * coords_cedula.width < coords_fita.width / 2 - coords_cedula.width / 2) {
            let final =  this.el_ponteiro.offsetLeft
            let inicio = final - coords_cedula.width

            for(let i = final; i >= inicio; i--) {
                await this.dormir(quadro_por_segundos)
                this.el_ponteiro.style.left = `${i}px`
            }
        } else {
            let final = this.el_fita.scrollLeft
            let inicio = final - coords_cedula.width
            for(let i = final ; i >= inicio ; i--) {
                await this.dormir(quadro_por_segundos)
                this.el_fita.scrollLeft = i
            }
            await this.dormir(quadro_por_segundos)
        }
    }

    async dormir(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}


const el_btn_executar = document.querySelector(".btn.executar")
const el_btn_parar = document.querySelector(".btn.parar")
const el_btn_resertar = document.querySelector(".btn.resertar")

el_btn_executar.addEventListener("click", async() => {
    const linguagem = new Linguagem(el_tbody_codigo, analisadorSintaticoNontupla.getNontupla())

    await linguagem.executarComandos()
}, true)

el_btn_resertar.addEventListener("click", () => {

    let tot = 0
    for(let i of document.querySelectorAll(".fitas > div") ){

        if(tot == 0) {
            i.innerText = "►"
        }

        if(i.innerText.trim() != "Б" && i.innerText.trim() != "b" && i.innerText.trim() != "►" && i.innerText.trim() != ">") {
            i.innerText = "Б"
        }

        tot++
    }
}, false)
