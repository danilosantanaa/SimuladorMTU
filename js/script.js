function criarElemento(elemento, valor = null, propriedades = {}) {
    const tagElemento = document.createElement(elemento)

    // Colocando o valor na tag
    if(valor != null && valor != undefined && tagElemento.innerHTML != undefined) {
        tagElemento.innerHTML = valor
    }

    // Colocando a propriedade
    for(let propriedade in propriedades) {
        tagElemento.setAttribute(propriedade, propriedades[propriedade])
    }

    return tagElemento
}

function adicionarElemento(elementoPai, elementoFilho) {
    elementoPai.append(elementoFilho)
}

/**
 * 
 * Tabela de simbolos
 */
SimbolosEstaticos = {
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

/** EXPRESSÕES REGULARES VALIDADORES */
const VALIDADOR_CONJUNTOS = /^(\s*[a-zA-Z0-9\>]+\s*)(\,\s*[a-zA-Z0-9\>]+\s*)*$/g

/** EXPRESSÕES REGULARES EXTRATORES DE ELEMENTOS */
const RX_ELEMENTOS_VALIDOS = /[a-zA-Z0-9\>]+/g

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
    }

    get conjunto_estado() {
        return this.isConjuntosEstado() ? this.extrairConjuntos(this.el_conjunto_estado) : []
    }

    isConjuntosEstado() {
        return this.el_conjunto_estado != undefined && VALIDADOR_CONJUNTOS.test(this.el_conjunto_estado.innerText)
    }

    get alfaberto() {
        return this.isAlfaberto() ? this.extrairConjuntos(this.el_alfaberto) : []
    }

    isAlfaberto() {
        return this.el_alfaberto != undefined && VALIDADOR_CONJUNTOS.test(this.el_alfaberto.innerText)
    }

    get estado_inicial() {
        return this.isEstadoInicial() ? this.extrairConjuntos(this.estado_inicial) : []
    }

    isEstadoInicial() {
        const estado_inicial = this.extrairConjuntos(this.el_estado_inicial)
        return VALIDADOR_CONJUNTOS.test(this.el_estado_inicial.innerText) && this.pertence(estado_inicial, this.conjunto_estado)
    }

    get estado_final() {
        return this.isEstadoFinal() ? this.extrairConjuntos(this.el_estado_final) : []
    }

    isEstadoFinal() {
        const estado_final = this.extrairConjuntos(this.el_estado_final)
        return VALIDADOR_CONJUNTOS.test(this.el_estado_final.innerText) && this.pertence(estado_final, this.conjunto_estado)
    }

    get estado_nao_final() {
        return this.isEstadoNaoFinal() ? this.extrairConjuntos(this.el_estado_nao_final) : []
    }

    isEstadoNaoFinal() {
        const estado_nao_final = this.extrairConjuntos(this.el_estado_nao_final)
        return VALIDADOR_CONJUNTOS.test(this.el_estado_nao_final.innerText) && !this.pertence(this.estado_nao_final, this.estado_final) && this.pertence(estado_nao_final, this.conjunto_estado)
    }

    get alfaberto_fita() {
        return this.isAlfabertoFita() ? this.extrairConjuntos(this.el_alfaberto_fita) : []
    }

    isAlfabertoFita() {
        const lista_elementos = this.extrairConjuntos(this.el_alfaberto_fita)
        let ultimo_elemento =  lista_elementos.length - 1
        let penultimo_elemento = lista_elementos.length - 2

        return lista_elementos.length > 2 && this.isConjuntos(this.el_alfaberto_fita.innerText) && this.branco_fita == lista_elementos[ultimo_elemento] && this.delimitador == lista_elementos[penultimo_elemento]
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

    extrairConjuntos(el) {
        
       if(el != undefined && el != null && el.innerText) {
            const texto = el.innerText.trim()
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
            adicionarElemento(tr, criarElemento("td", null, {
                "contenteditable": "true"
            }))
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
const el_thead_codigo = document.querySelector("#tb-cabecalho")
const el_tbody_codigo = document.querySelector("#tb-corpo")

// OBJETOS
const analisadorSintaticoNontupla = new AnalisadorSintaticoNonTuplas(el_estados, el_alfaberto, el_estado_inicial, el_estado_final, el_estado_nao_final, el_alfaberto_fita, el_delimitador, el_branco_fita)

/** CHAMADA A EVENTOS */
el_alfaberto_fita.addEventListener("focusout", () => {

    if(analisadorSintaticoNontupla.isAlfabertoFitaPreenchida()) {
        if(analisadorSintaticoNontupla.isAlfabertoFita()) {
            const gerarTabela = new GerarTabelaTransicao(analisadorSintaticoNontupla.getNontupla(), el_thead_codigo, el_tbody_codigo)
            gerarTabela.gerarTabela()
        }
    }
})

