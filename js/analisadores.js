import { criarElemento, adicionarElemento } from "./ManipularDOM.js"

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
            VALIDADOR_CONJUNTOS: /^(\s*[a-zA-Z0-9\>]+\s*)(\,\s*[a-zA-Z0-9\>]+\s*)*$/g
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

        // Atribuindo eventos
        this.el_estado_final.addEventListener("focusout", () => {
            this.estado_final
        })

        this.el_alfaberto.addEventListener("focusout", () => {
            this.el_alfaberto_fita.innerText = `${this.alfaberto.join(",")}, ${this.delimitador}, ${this.branco_fita}`
        })
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

            // Colocando os estados não finais como padrão
            this.el_estado_nao_final.innerText = this.conjunto_estado.filter(value => {
                if(!conj_estados_finais.includes(value)) {
                    return value
                }
            }).join(", ")
            
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
                    "estado-apontador": ""
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

/** CHAMADA A EVENTOS */
el_alfaberto_fita.addEventListener("focusout", () => {

    if(analisadorSintaticoNontupla.isAlfabertoFitaPreenchida()) {
        if(analisadorSintaticoNontupla.isNontuplaValida()) {
            el_div_tb_content.classList.add("mostrar")
            el_div_tb_content.classList.remove("ocultar")
            const gerarTabela = new GerarTabelaTransicao(analisadorSintaticoNontupla.getNontupla(), el_thead_codigo, el_tbody_codigo)
            gerarTabela.gerarTabela()
            tabelaTransicao.monitorandoTabela()

            if(gerarTabela.el_primeiraLinha != undefined) {
                gerarTabela.el_primeiraLinha.focus()
            }

        } else {
            el_div_tb_content.classList.add("ocultar")
            el_div_tb_content.classList.remove("mostrar")
        }
    }
})


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
        this.el_fita = document.querySelector(".fitas")
        this.el_entrada = document.querySelectorAll(".fitas > div")
        this.el_tbody = el_tbody
        this.obj_nontuplas = obj_nontuplas
        this.ponteiro = document.querySelector("#cabecote")

        this.sequenciaTokens = []
        this.lookahead = null
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
        this.sequenciaTokens = []
        let totLinha = 1
        for(let linha of this.el_tbody.querySelectorAll("tr")) {
            const elementos = []
            let totColuna = 1
            for(let coluna of linha.querySelectorAll("td:not(.cmd-linha)")) {
                let cmds = coluna.innerText.trim().split(" ") 
                elementos.push({
                    conteudo: {
                        estado: cmds[0],
                        valor: cmds.length == 3 ? cmds[1] : null,
                        direcao: cmds.length == 3 ? String(cmds[2]).toLocaleUpperCase() : null
                    },
                    linha: totLinha,
                    coluna: totColuna,
                    tipo: totColuna == 1 ? Dicionario.TIPO_TOKEN.PONTEIRO : Dicionario.TIPO_TOKEN.COMANDO
                })

                totColuna++
            }
            
            // Verificando se o ponteiro foi informado
            if(elementos.some(el => el.conteudo.estado != "")) {
                this.sequenciaTokens.push(elementos)
            }
            totLinha++
        }
    }

    // Executa a sequência de comandos
    async executarComandos() {

        // Resertando configurações de estilo colocaod pelo script
        this.ponteiro.style.left = '0px'
        this.el_fita.scrollLeft = 0
        const el_estado_display = document.querySelector("#estado-display");

        // Pega o estado inicial
        let estado_atual = this.obj_nontuplas.estado_inicial[0]

        // Mostra no display o estado aonde esta sendo lido
        el_estado_display.innerText = estado_atual

        const POS_INVALIDA = -1
        if(this.sequenciaTokens.length > 0) {
            let contador = 0;
            while( contador < this.el_entrada.length && contador >= 0) {
                // Ler a cedula da fita
                let entrada = this.el_entrada[contador].innerText.trim()

                // Ler elemento que foi inserido na tabela
                let pos_alfaberto_fita = this.getPosColunaLeitura(entrada)
                let pos_estado_ponteiro = this.getComandos(estado_atual)
                
                // Verifica se o comando foi encontrado
                if(pos_alfaberto_fita != POS_INVALIDA && pos_estado_ponteiro != POS_INVALIDA) {
                    let cmd = this.sequenciaTokens[pos_estado_ponteiro][pos_alfaberto_fita]

                    estado_atual = cmd.conteudo.estado

                    // Mostra o estado atual de execução
                    el_estado_display.innerText = estado_atual

                    // Verifica se esta movendo para a direita
                    if(cmd.conteudo.direcao == Dicionario.MOVER.R) {
                        this.el_entrada[contador].innerText = cmd.conteudo.valor
                        await this.moverDireita(this.el_entrada[contador])
                        contador++
                    }
                    
                    // Verifica se esta movendo para esquerda
                    if(cmd.conteudo.direcao == Dicionario.MOVER.L) {
                        this.el_entrada[contador].innerText = cmd.conteudo.valor
                        await this.moverEsquerda(this.el_entrada[contador])
                        contador--
                    }

                    // Verifica se houve comando de parada
                    if(cmd.conteudo.direcao == Dicionario.MOVER.P) {
                        await this.dormir(300);
                        this.el_entrada[contador].innerText = cmd.conteudo.valor
                        break
                    }

                } else {
                    console.log('ERRO! Comando Invalido')
                    break
                }
            }
        }
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
        for(let i = 0; i < this.sequenciaTokens.length; i++) {
            if(this.sequenciaTokens[i][POS_PONTEIRO].tipo == Dicionario.TIPO_TOKEN.PONTEIRO && estado == this.sequenciaTokens[i][POS_PONTEIRO].conteudo.estado ) {
                return i
            }
        }

        return -1
    }

    // Move o cabecote para o lado direto da fita
    async moverDireita(el_cedula) {
        await this.dormir(500)
        const elemCedula = el_cedula.getBoundingClientRect()
        
        // Move o cabeçote na celula
        this.ponteiro.style.left = `${elemCedula.x - 6.5 + elemCedula.width / 2}px`

        if(this.el_fita.clientWidth < elemCedula.left + elemCedula.width / 2) {
            this.el_fita.scrollLeft += elemCedula.x
        }
    }


    // Move o cabeçote para lado esquerdo da fita
    async moverEsquerda(el_cedula) {
        await this.dormir(500)
        const elemFita = this.el_fita.getBoundingClientRect()
        const elemCedula = el_cedula.getBoundingClientRect()

        this.ponteiro.style.left = `${this.ponteiro.offsetLeft - this.ponteiro.offsetWidth}px`

        if(this.el_fita.clientWidth > elemCedula.left + elemCedula.width / 2 && this.el_fita.scrollLeft - elemCedula.x > 0) {
            this.el_fita.scrollLeft -= elemCedula.x
        }
    }

    pontoExecucao(estado_atual) {
        return this.sequenciaTokens.find(x => x[0].tipo == Dicionario.TIPO_TOKEN.PONTEIRO && estado_atual == x.conteudo.estado)
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
    console.log(" Teste ", linguagem.sequenciaTokens)

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