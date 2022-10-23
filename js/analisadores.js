import { criarElemento, adicionarElemento, trocarValores, SimbolosEspeciais } from "./ManipularDOM.js"
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
            VALIDAR_PONTEIRO: /^[a-zA-Z0-9]+$/g,
            VALIDAR_COMANDOS: /^([a-zA-Z0-9]+)\s+([a-zA-Z0-9\>\Б\►]+)\s+([R|L|P])$/g
        }

        this.ExtrairValores = {
            EXTRAIR_ELEMENTO_CONJUNTO: /[a-zA-Z0-9\>]+/g
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
    }

    eventosFocusOut() {
        this.el_conjunto_estado.addEventListener("focusout", () => {
            this.preencherCamposAutomaticamente()
            this.verificarLocaisNoErros()
            this.gerarTabela()
        })
        
        this.el_alfaberto.addEventListener("focusout", () => {
            this.preencherCamposAutomaticamente()
            this.verificarLocaisNoErros()
            this.gerarTabela()
        })
        
        this.el_estado_inicial.addEventListener("focusout", () => {
            this.preencherCamposAutomaticamente()
            this.verificarLocaisNoErros()
            this.gerarTabela()
        })

        this.el_estado_final.addEventListener("focusout", () => {
            this.estado_final
            this.preencherCamposAutomaticamente()
            this.verificarLocaisNoErros()
            this.gerarTabela()
        })

        this.el_estado_nao_final.addEventListener("focusout", () => {
            this.preencherCamposAutomaticamente()
            this.verificarLocaisNoErros()
            this.gerarTabela()
        })

        this.el_alfaberto_fita.addEventListener("focusout", () => {
            this.verificarLocaisNoErros()
            this.gerarTabela()
        })
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

    gerarTabela() {
        if(this.isAlfabertoFitaPreenchida()) {
            if(this.isNontuplaValida()) {
                this.el_div_tb_content.classList.add("mostrar")
                this.el_div_tb_content.classList.remove("ocultar")
                const gerarTabela = new GerarTabelaTransicao(this.getNontupla(), el_thead_codigo, el_tbody_codigo)
                gerarTabela.gerarTabela()
                tabelaTransicao.monitorandoTabela()
    
                // Focando na primeira linha
                const td_focus = document.querySelector("#primeira-linha-focus")
                td_focus.focus({focusVisible: true})
    
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
        return this.estado_nao_final
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

        this.el_primeiraLinha = undefined
    }

    get ultima_linha() {
        return this.getLinhas().length
    }

    monitorandoTabela() {
        for(let linha of this.getLinhas()) {
            for(let coluna of this.getColuna(linha)) {
                this.ultimaLinhaEvento(linha, coluna)
            }
        }
    }

    ultimaLinhaEvento(linha, coluna) {
        const obj_escopo = this

        if(this.isUltimaLinha(coluna)) {
            // Gerar uma nova linha
            const listener = e => {
                if(e.keyCode == obj_escopo.TECLA_TAB || e.keyCode == obj_escopo.TECLA_ENTER) {
                    e.preventDefault()
                    
                    const el_nova_linha = obj_escopo.gerarNovaLinha()
                    obj_escopo.el_tbody.appendChild(el_nova_linha)
                    obj_escopo.getColuna(el_nova_linha)[1].focus()

                    obj_escopo.monitorandoTabela()
                    
                    coluna.removeEventListener("keydown", listener, false)
                }
            }

            coluna.addEventListener("keydown", listener, false)

        } else {
            coluna.addEventListener("keydown", e => {
                if(obj_escopo.TECLA_ENTER == e.keyCode) {
                    e.preventDefault()
                }
            }, false)
        }
    }

    gerarNovaLinha() {
       const tr = criarElemento("tr")
       const total_nontuplas = this.analisadorSintaticoNontupla.getNontupla().alfaberto_fita.length + 1

       for(let contador = 0; contador <= total_nontuplas; contador++) {
            if(contador == 0) { // gera o td com o número da linha
                tr.appendChild(criarElemento("td", this.ultima_linha + 1, {
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
    },

    TIPO_TOKEN: {
        PONTEIRO: 1,
        COMANDO: 2
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
     * Ler o arquivo e gera a sequência de caracteres
     */
    lerArquivo() {

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
                        this.setErros(`A cadeia ${cadeia} não foi reconhecida!`, tot_linha, tot_coluna)
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
        return caracter == '\s' || caracter == '\r' || caracter == '\b' || caracter == ' '
    }

    isNumero(caracter) {
        return caracter >= '0' && caracter <= '9'
    }

}

class AnalisadorSintatico {
    constructor(obj_nontuplas) {
        this.analisadorLexico = new AnalisadorLexico()
        this.obj_nontuplas = obj_nontuplas

        this.lookahead = 0
        this.errosSintaticos = []
        this.avisosSintaticos = []

        this.analisadorLexico.lerTabela()
        this.analisadorLexico.gerarTokens()

        // Analisador sematico
        this.analisadorSematico = new AnalisadorSemantico()

        if(this.analisadorLexico.errorList.length == 0) {
            this.programa()

            this.verificarErrosMovimentadorParada()
            this.verificarErrosEstadoInicial()
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
                this.analisadorSematico.estado_apontador_declarado.set(this.analisadorSematico.estado, ListaTokens.ESTADO)
            } else {
                this.setErros(`O ESTADO ${this.analisadorSematico.estado} já foi declarado.`, this.analisadorSematico.num_linha, this.analisadorSematico.num_coluna)
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
        } else {

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
            this.setErros(`Esperava um ESTADO, e não um "${stmt.valor}. Para ser um estado válido, os estados deve ser de q0, q1, q2, ... qN.`, stmt.linha, stmt.coluna)
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
            this.setErros(`Esperava um ALFABERTO DE FITA e não um "${stmt.valor}"`, stmt.linha, stmt.coluna)
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
            this.setErros(`Esperava um MOVIMENTADOR não um "${stmt.valor}". O movimentador válido são: R, L ou P e somente um deles.`, stmt.linha, stmt.coluna)
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
            linha,
            coluna
        })
    }

    setAvisos(msg, linha, coluna) {
        this.avisosSintaticos.push({
            mensagem: `<span class='aviso-code'>${msg}</span>`,
            linha,
            coluna
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
            this.setAvisos(`Não foi entrado o estado de partida. O estado inicial deve está no formato "${this.obj_nontuplas.estado_inicial.join('')} ${SimbolosEspeciais.delimitador.simbolo1} ${Dicionario.MOVER.R}".`, 1, posDelimitadorColuna)
            return
        }


        if(estado_inicial[0].coluna != posDelimitadorColuna) {
            this.setAvisos(`Não foi encontrado o estado inicial na coluna do delimitador na linha 1 e coluna ${posDelimitadorColuna}.`, 0, 0)
        }

    }

    verificarErrosEstadoFinal() {
        
    }

}

class AnalisadorSemantico {
    constructor() {
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
    }

    setEstado(estado, linha, coluna) {
        this.estado = estado
        this.num_linha = linha
        this.num_coluna = coluna
    }

    setAlfaberto(alfaberto_fita, linha, coluna) {
        this.alfaberto_fita = alfaberto_fita
        this.num_linha = linha
        this.num_coluna = coluna
    }

    setMovimentador(movimentador, linha, coluna) {
        this.movimentador = movimentador
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
        this.el_tbody = el_tbody
        this.obj_nontuplas = obj_nontuplas
        this.ponteiro = document.querySelector("#cabecote")

        this.analisadorSintatico = new AnalisadorSintatico(obj_nontuplas)
        this.is_executar = true

        // Parte que será mostrada no console
        this.el_cli = document.querySelector(".cmd-line-display")


        this.string_lang = ""
        // FASE DO ANALISADOR
        this.comandosExecutar = []
        this.lookahead = 0
        this.TOKENS = {
            ESTADO_PONTEIRO: 100,
            ESTADO: 200,
            ALFABERTOFITA: 300,
            MOVIMENTO: 400
        }

        // ARMAZENA A LISTA DE TOKENS IDENTIFICADO NA FASE LEXICA
        this.listStmts = []

        // GUARDAR OS ERROS DETECTADOS NA FASE DA ANALISE LEXICA E SINTATICA
        this.totErroLexico = 0
        this.totErroSintatico = 0
        this.totColunaLida = 0
        this.erroListLexico = []
        this.erroListSintatico = []

        this.caracter_especial = {
            delimitador: {
                simbolo1: ">",
                simbolo2: "►"
            },

            branco_fita: {
                simbolo1: "b",
                simbolo2: "Б"
            }
        }

        this.qtdCedulaPercorrida = 0;
        
        // Variavel de controle
        this.el_btn_parar = document.querySelector(".btn.parar")
        this.is_stop = false
        
        this.el_btn_parar.addEventListener("click", () => {
            escopo.is_stop = true
        }, true)
        
        
        this.el_range_input = document.querySelector("#velocidade")
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

    get cadeia() {
        return this.el_entrada.value.replaceAll(" ", "")
    }

    get caracter() {

        if(this.pos_lido < this.cadeia) {
            return this.cadeia.substring(this.pos_lido, this.pos_lido + 1)
        }

        return null
    }

    proximoCaracter() {
        this.pos_lido++
    }

    lerTabela() {
        // Analise lexica
        this.comandosExecutar = []
        let totLinha = 1
        for(let linha of this.el_tbody.querySelectorAll("tr")) {
            const elementos = []
            
            let totColuna = 1
            for(let coluna of linha.querySelectorAll("td:not(.cmd-linha)")) {

                // Gerando sequência de strings para transformar em linguagem
                if(coluna.innerText.trim() != "") {
                    this.string_lang += `${coluna.innerText.trim()}, `
                
                    // Salvando o código, pode esta salvando código inválido, não há implementação da geração de código intermediario, será feita mais adiante
                    let stmt = this.gerarComandos(coluna.innerText.trim(), totLinha, totColuna)
                    if(stmt != undefined) {
                        elementos.push(stmt)
                    }
                }

                totColuna++
            }

            this.string_lang += "\n"
            
            this.comandosExecutar.push(elementos)
            
            totLinha++
        }

        setTotErro(0)
        setTotAvisos(0)
        this.is_executar = true
        if(this.analisadorSintatico.analisadorLexico.errorList.length > 0) {
            setTotErro(this.analisadorSintatico.analisadorLexico.errorList.length)
            abrirFecharConsole(true)
            this.is_executar = false
        } 

        if(this.analisadorSintatico.errosSintaticos.length > 0) {
            setTotErro(this.analisadorSintatico.errosSintaticos.length)
            abrirFecharConsole(true)
            this.is_executar = false
        }

        if(this.analisadorSintatico.avisosSintaticos.length > 0) {
            setTotAvisos(this.analisadorSintatico.avisosSintaticos.length)
            abrirFecharConsole(true)
            this.is_executar = false
        }

        setConsoleLogs(this.analisadorSintatico.analisadorLexico.errorList, this.analisadorSintatico.errosSintaticos, this.analisadorSintatico.avisosSintaticos)
    }

    gerarComandos(valor = "", linha, coluna) {
        let stmt = undefined

        if(valor != "") {
            const expr_regular = new ExpressaoRegular()

            if(expr_regular.Validadores.VALIDAR_PONTEIRO.test(valor)) {
                stmt =  {
                    conteudo: {
                        estado: valor,
                        valor: undefined,
                        direcao: undefined
                    },
                    linha,
                    coluna,
                    tipo: Dicionario.TIPO_TOKEN.PONTEIRO
                }
                
            } else if(expr_regular.Validadores.VALIDAR_COMANDOS.test(valor)) {
                let cmds = valor.split(" ")
                stmt =  {
                    conteudo: {
                        estado: cmds[0],
                        valor: cmds[1],
                        direcao: cmds[2]
                    },
                    linha,
                    coluna,
                    tipo: Dicionario.TIPO_TOKEN.COMANDO
                }
            } 
        }

        return stmt
    }

    mostrarBarraRolagem() {
        if(this.el_fita.classList.contains("rolagem")) {
            this.el_fita.classList.remove("rolagem")
            this.ponteiro.classList.add("rolagem")
        } else {
            this.el_fita.classList.add("rolagem")
            this.ponteiro.classList.remove("rolagem")
        }
    }

    // Executa a sequência de comandos
    async executarComandos() {
        this.mostrarBarraRolagem()

        const tr_cmds = this.el_tbody.querySelectorAll("tr")
    
        // Resertando configurações de estilo colocaod pelo script
        this.ponteiro.style.left = '0px'
        this.el_fita.scrollLeft = 0
        const el_estado_display = document.querySelector("#estado-display");

        // Pega o estado inicial
        let estado_atual = this.obj_nontuplas.estado_inicial[0]

        // Mostra no display o estado aonde esta sendo lido
        el_estado_display.innerText = estado_atual

        const POS_INVALIDA = -1
        if(this.comandosExecutar.length > 0 && this.is_executar) {
            let contador = 0;
            while( contador < this.el_entrada.length && contador >= 0 && !this.is_stop) {
                // Ler a cedula da fita
                let entrada = this.el_entrada[contador].innerText.trim()

                // Ler elemento que foi inserido na tabela
                let pos_alfaberto_fita = this.getPosColunaLeitura(entrada)
                let pos_estado_ponteiro = this.getComandos(estado_atual)
                
                // Verifica se o comando foi encontrado
                if(pos_alfaberto_fita != POS_INVALIDA && pos_estado_ponteiro != POS_INVALIDA) {
                    let cmd = this.comandosExecutar[pos_estado_ponteiro][pos_alfaberto_fita]

                    // Marca a tabela atual que esta sendo executado
                    let el_cedula = tr_cmds[pos_estado_ponteiro].querySelectorAll("td:not(.cmd-linha)")[pos_alfaberto_fita]
                    let el_cedula_original = el_cedula.innerHTML
                    el_cedula.innerHTML = "<i class='fa-solid fa-play executar-player'></i> " + el_cedula_original

                    // Estado atual de executação
                    estado_atual = cmd.conteudo.estado

                    // Mostra o estado atual de execução
                    el_estado_display.innerText = estado_atual

                    trocarValores(this.el_entrada[contador], cmd.conteudo.valor)
                    
                    // Verifica se esta movendo para a direita
                    if(cmd.conteudo.direcao == Dicionario.MOVER.R) {
                        await this.moverDireita(this.el_entrada[contador])
                        el_cedula.innerHTML = el_cedula_original
                        contador++
                    }
                    
                    // Verifica se esta movendo para esquerda
                    if(cmd.conteudo.direcao == Dicionario.MOVER.L) {
                        await this.moverEsquerda(this.el_entrada[contador])
                        el_cedula.innerHTML = el_cedula_original
                        contador--
                    }

                    // Verifica se houve comando de parada
                    if(cmd.conteudo.direcao == Dicionario.MOVER.P) {
                        await this.dormir(parseInt(this.time / 2));
                        el_cedula.innerHTML = el_cedula_original
                        await this.dormir(parseInt(this.time / 2));
                        break
                    }

                } else {
                    console.log('ERRO! Comando Invalido')
                    break
                }
            }
        }

        this.mostrarBarraRolagem()
    }

    // Executa o comandos e mostra a fita

    // Pesquisa na posição do alfaberto de fita qual pertence o valor lido
    getPosColunaLeitura(valor) {

        // Tira a formatação do delimitador e branco de fita
        valor = valor == this.caracter_especial.delimitador.simbolo2 ? this.caracter_especial.delimitador.simbolo1 : valor
        valor = valor == this.caracter_especial.branco_fita.simbolo2 ? this.caracter_especial.branco_fita.simbolo1 : valor
        
        // Busca o caracter
        if(this.obj_nontuplas.alfaberto_fita.length > 0) {
            for(let j = 0; j < this.obj_nontuplas.alfaberto_fita.length; j++) {
                if(valor == this.obj_nontuplas.alfaberto_fita[j]) return j + 1
            }
        }

        return -1
    }

    // Retorna o comando aonde estar o estado atual da tabela
    getComandos(estado) {
        const POS_PONTEIRO = 0
        for(let i = 0; i < this.comandosExecutar.length; i++) {
            if(this.comandosExecutar[i][POS_PONTEIRO].tipo == Dicionario.TIPO_TOKEN.PONTEIRO && estado == this.comandosExecutar[i][POS_PONTEIRO].conteudo.estado ) {
                return i
            }
        }

        return -1
    }

    // Move o cabecote para o lado direto da fita
    async moverDireita(el_cedula) {
        this.qtdCedulaPercorrida++;
        await this.dormir(this.time)
        
        const coords_cedula = el_cedula.getBoundingClientRect()
        const coords_fita = this.el_fita.getBoundingClientRect()

        this.calcularVelocidade()
        const quadro_por_segundos = Math.floor(10 * this.time / 500)
        if(this.qtdCedulaPercorrida * coords_cedula.width - coords_cedula.width / 2 >= coords_fita.width / 2 && this.el_fita.scrollWidth - coords_fita.width != this.el_fita.scrollLeft) {
            let inicio = this.el_fita.scrollLeft
            for(let i = inicio; i <= inicio + coords_cedula.width; i++) {
                await this.dormir(quadro_por_segundos)
                this.el_fita.scrollLeft = i
            }
            await this.dormir(quadro_por_segundos)
        } else {
            for(let i = this.ponteiro.offsetLeft; i < coords_cedula.left + coords_cedula.width / 2; i++) {
                await this.dormir(quadro_por_segundos)
                this.ponteiro.style.left = `${i}px`
            }
        }


    }


    // Move o cabeçote para lado esquerdo da fita
    async moverEsquerda(el_cedula) {
        this.qtdCedulaPercorrida--
        await this.dormir(this.time)
        
        const coords_cedula = el_cedula.getBoundingClientRect()
        const coords_fita = this.el_fita.getBoundingClientRect()

        this.calcularVelocidade()
        const quadro_por_segundos = Math.floor(10 * this.time / 500)
        if(this.qtdCedulaPercorrida * coords_cedula.width < coords_fita.width / 2 - coords_cedula.width / 2) {
            let final =  this.ponteiro.offsetLeft
            let inicio = final - coords_cedula.width

            for(let i = final; i >= inicio; i--) {
                await this.dormir(quadro_por_segundos)
                this.ponteiro.style.left = `${i}px`
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

    pontoExecucao(estado_atual) {
        return this.comandosExecutar.find(x => x[0].tipo == Dicionario.TIPO_TOKEN.PONTEIRO && estado_atual == x.conteudo.estado)
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
    linguagem.lerTabela()
    console.log(" Teste ", linguagem.comandosExecutar)

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
