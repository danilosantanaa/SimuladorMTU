import { criarElemento, adicionarElemento, trocarValores, SimbolosEspeciais, abrirFecharConsole } from "./ManipularDOM.js"

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

class Linguagem {
    constructor(el_tbody, obj_nontuplas) {
        const escopo = this
        this.el_fita = document.querySelector(".fitas")
        this.el_entrada = document.querySelectorAll(".fitas > div")
        this.el_tbody = el_tbody
        this.obj_nontuplas = obj_nontuplas
        this.ponteiro = document.querySelector("#cabecote")

        // Parte que será mostrada no console
        this.el_cli = document.querySelector(".cmd-line-display")
        this.el_tot_erros = document.querySelector(".info .erros .tot")
        this.el_tot_avisos = document.querySelector(".info .avisos .tot")

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

                // Analisando se as lexema estão válido.
                this.analisadorLexico(coluna.innerText.trim(), totLinha, totColuna)

                // Salvando o código, pode esta salvando código inválido, não há implementação da geração de código intermediario, será feita mais adiante
                let stmt = this.gerarComandos(coluna.innerText.trim(), totLinha, totColuna)
                if(stmt != undefined) {
                    elementos.push(stmt)
                }
                totColuna++
            }
            
            this.comandosExecutar.push(elementos)
            
            totLinha++
        }
        
        const el_erros_list = this.el_cli.querySelector("ul")
        el_erros_list.innerHTML = ""
        
        // Analise sintatica
        if(this.totErroLexico == 0) {
            this.programa()

            if(this.totErroSintatico > 0) {
                this.el_cli.style.display = 'block'
                abrirFecharConsole(true)
                
                for(let i = 0; i < this.erroListSintatico.length; i++) {
                    let li = criarElemento("li")
                    li.innerHTML = `(linha ${this.erroListSintatico[i].linha}, coluna ${this.erroListSintatico[i].coluna})${this.erroListSintatico[i].mensagem}`

                    adicionarElemento(el_erros_list, li)
                }   
                
            } else {
                this.el_cli.style.display = 'none'
            }
        } else {
            this.el_cli.style.display = 'block'
            abrirFecharConsole(true)
            this.el_tot_erros.innerHTML = `(${this.totErroLexico})`

            for(let i = 0; i < this.erroListLexico.length; i++) {
                let li = criarElemento("li")
                li.innerHTML = `(linha ${this.erroListLexico[i].linha}, coluna ${this.erroListLexico[i].coluna})${this.erroListLexico[i].mensagem}`

                adicionarElemento(el_erros_list, li)
            }     
        }
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

    analisadorLexico(lexema, linha, coluna) {
        let estado = 1;
        let cadeia = ""
        let resto_cadeia = ""

        let poscaracterlido = 0
        lexema += " " // Espaço que será uma frag para indicar final de comando
        while(poscaracterlido < lexema.length) {
            let caracter = lexema[poscaracterlido]

            switch(estado) {
                case 1:
                    cadeia += caracter
                    if(caracter == 'q' || caracter == 'Q') {
                        estado = 2
                    } else if (caracter >= 'a' && caracter <= 'p' || 
                               caracter >= 'r' && caracter <= 'z' || 
                               caracter >= 'A' && caracter <= 'K' || 
                               caracter >= 'M' && caracter <= 'O' || 
                               caracter >= 'S' && caracter <= 'Z' || 
                               caracter == '-' || caracter == '+' || 
                               caracter == '*' || caracter == '/' || 
                               caracter >= 0 && caracter <= 9 ||
                               caracter == SimbolosEspeciais.branco_fita.simbolo1 ||
                               caracter == SimbolosEspeciais.branco_fita.simbolo2 || 
                               caracter == SimbolosEspeciais.delimitador.simbolo1 ||
                               caracter == SimbolosEspeciais.delimitador.simbolo2
                    ) {
                        estado = 5
                    } else if(caracter == 'R' || caracter == 'P' || caracter == 'L') {
                        estado = 8
                    } else if(caracter == ' ' || caracter == '\n' || caracter == '\t' || caracter == '\r') {
                        estado = 1
                    }
                    break;
                case 2:
                    cadeia += caracter
                    if(caracter >= '0' && caracter <= '9') {
                        estado = 3
                    } else if(caracter != ' '){
                        estado = 3
                    } else {
                        resto_cadeia = caracter
                        estado = 4
                    }
                    break;
                case 3:
                    cadeia += caracter
                    if(caracter >= '0' && caracter <= '9') {
                        estado = 3
                    } else if(caracter == ' ' || caracter == '\n' || caracter == '\t' || caracter == '\r') {
                        estado = 1
                        this.listStmts.push({
                            token: this.TOKENS.ESTADO,
                            valor: cadeia.trim(),
                            linha,
                            coluna
                        })

                        cadeia = ""
                    } else {
                        resto_cadeia = caracter
                        estado = 4
                    }
                    break;
                case 4: // caracteres invalido
                    cadeia += caracter

                    if(caracter != ' ' && caracter != '\n' && caracter != '\t' && caracter != '\r') {
                        estado = 4
                    } else if(caracter == ' ' || caracter == '\n' || caracter == '\t' || caracter == '\r'){
                        this.erroLexico(`O lexema <strong>"${cadeia.trim()}"</strong> não foi reconhecido como um ESTADO válido.`, linha, coluna)
                        cadeia = ""
                        estado = 1
                    }
                    break
                case 5:
                    cadeia += caracter
                    if(caracter == ' ' || caracter == '\n' || caracter == '\t' || caracter == '\r') {
                        estado = 1
                        this.listStmts.push({
                            token: this.TOKENS.ALFABERTOFITA,
                            valor: cadeia.trim(),
                            linha,
                            coluna
                        })

                        cadeia = ""
                    } else {
                        resto_cadeia = cadeia
                        estado = 6
                    }
                    break;
                case 6: // estado validador 
                    cadeia += caracter
                    if(caracter != ' ' && caracter != '\n' && caracter != '\t' && caracter != '\r') {
                        estado = 6
                    } else if(caracter == ' ' || caracter == '\n' || caracter == '\t' || caracter == '\r') {
                        this.erroLexico(`O lexema <strong>"${cadeia.trim()}"</strong> não foi reconhecido como um ALFABERTO DE FITA válido.`, linha, coluna)
                        estado = 1
                        cadeia = ""
                    }
                    break;
                case 8:
                    cadeia += caracter
                    if(caracter == ' ' || caracter == '\n' || caracter == '\t' || caracter == '\r') {
                        estado = 1
                        this.listStmts.push({
                            token: this.TOKENS.MOVIMENTO,
                            valor: cadeia.trim(),
                            linha,
                            coluna
                        })

                        cadeia = ""
                        estado = 1
                    } else {
                        resto_cadeia = caracter
                        estado = 7
                    }
                        break
                    case 7:
                        cadeia += caracter
                        if(caracter != ' ' && caracter != '\n' && caracter != '\t' && caracter != '\r') {
                            estado = 7
                        } else if(caracter == ' ' || caracter == '\n' || caracter == '\t' || caracter == '\r') {
                            this.erroLexico(`O lexema <strong>"${cadeia.trim()}"</strong> não foi reconhecido como um MOVIMENTO DE FITA válido.`, linha, coluna)
                            cadeia = ""
                            estado = 1
                        }
                        break;
            }

            poscaracterlido++
        }
    }

    erroLexico(msg, linha, coluna) {
        this.erroListLexico.push({
            mensagem: msg,
            linha,
            coluna
        })

        this.totErroLexico++
    }

    programa() {
        if(this.lookahead < this.listStmts.length && this.listStmts[this.lookahead].token == this.TOKENS.ESTADO) {
            this.estado()
            this.comando()
            this.programa()
        }
    }

    ponteiroa() {
        const stmt = this.listStmts[this.lookahead]    
        if(stmt.token == this.TOKENS.ESTADO_PONTEIRO) {
            
            // Verifica se o estado apontador pertence ao conjunto de estados
            const valido = this.obj_nontuplas.conjunto_estado.some(estado => estado == stmt.valor)

            if(!valido) {
                this.erroSintatico(`<span class='erro-code'>O estado "${stmt.valor}" não pertence ao conjunto de estados na nontuplas!</span>`, stmt)
            }

            this.reconhecer()
        } else {
            this.erroSintatico(`<span class='erro-code'>Esperava um estado apontador válido.</span>`, stmt)
        }
    }

    comando() {
        const stmt = this.listStmts[this.lookahead];
        if(this.lookahead < this.listStmts.length && stmt.token == this.TOKENS.ESTADO) {
            this.estado()
            this.alfabertoFita()
            this.movimento()
            this.comando()
        } else if(stmt != undefined) {
            this.erroSintatico(`<span class='erro-code'>Esperava um estado válido.</span>`, stmt)
        }
    }

    estado() {
        const stmt = this.listStmts[this.lookahead]
        if(stmt.token == this.TOKENS.ESTADO) {
        
            // Verifica se o estado apontador pertence ao conjunto de estados
            const valido = this.obj_nontuplas.conjunto_estado.some(estado => estado == stmt.valor)

            if(!valido) {
                this.erroSintatico(`<span class='erro-code'>O estado "${stmt.valor}" não pertence ao conjunto de estados na nontuplas!</span>`, stmt)
            }

            this.reconhecer()
        } else if(stmt != undefined) {
            this.erroSintatico(`<span class='erro-code'>Esperava um estado válido.</span>`, stmt)
        }
    }
   
    alfabertoFita() {
        const stmt = this.listStmts[this.lookahead]
        
        if(stmt.token == this.TOKENS.ALFABERTOFITA) {

            // Verifica se o alfaberto de fita informado, pertence ao conjunto do alfaberto da fita informada na nontupla
            const valido = this.obj_nontuplas.alfaberto_fita.some(alfaberto_fita => alfaberto_fita == stmt.valor)

            if(!valido) {
                this.erroSintatico(`<span class='erro-code'>O alfaberto de fita "${stmt.valor}" não pertence ao conjunto do alfaberto de fita informado na nontupla!</span>`, stmt)
            }

            this.reconhecer()
        } else if(stmt != undefined) {
            this.erroSintatico("<span class='erro-code'>Esperava um alfaberto de fita válido.</span>", stmt)
        }
    }

    movimento() {
        const stmt = this.listStmts[this.lookahead]
        if(this.listStmts[this.lookahead].token == this.TOKENS.MOVIMENTO) {
           this.reconhecer()
        } else if(stmt != undefined){
            this.erroSintatico("<span class='erro-code'>Esperava um movimentador. Sendo ou L ou P ou R</span>", stmt)
        }
    }

    reconhecer() {
        this.lookahead++
    }

    erroSintatico(mensagem, stmt) {
        this.totErroSintatico++
        this.erroListSintatico.push({ mensagem, linha: stmt.linha, coluna: stmt.coluna })
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
        if(this.comandosExecutar.length > 0 && this.totErroLexico == 0 && this.totErroSintatico == 0) {
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
