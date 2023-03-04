import * as configuracoes from "./configuracoes.js"
import { moverCursorContentEditableFinal, criarElemento, adicionarElemento } from "./manipularElementHTML.js"
import { Nontupla, ValidadorNonTuplas } from "./validadorNontuplas.js"

/**
 * Normalmente quando gera uma tabela, tem que gerar com o alfaberto de fita e também tem alguma colunas extras fora o alfaberto de fita
 * como: numero da linha e estado apontador. Será necessário para corrigir a posição do alfaberto de fita que se encontra na tabela.
 */
const QUANTIDADE_EXTRA_COLUNA = 2

export class GerarTabelaTransicao {
    
    /**@param {Nontupla} nontuplaObj */
    constructor(nontuplaObj, thead, tbody) {

        /**@type {Nontupla} */
        this.nontuplaObj = nontuplaObj

        /**@type {Element} */
        this.thead = document.querySelector(configuracoes.STR_TABLE_CABECALHO_POR_ID)
        
        /**@type {Element} */
        this.tbody = document.querySelector(configuracoes.STR_TABLE_CORPO_POR_ID)

        if(this.nontuplaObj)
            this.gerarTabela()
    }

    /**@param {boolean} isgerarCorpo */
    gerarTabela(isgerarCorpo = true) {
        this.thead.innerHTML = ""
        this.tbody.innerHTML = ""
        adicionarElemento(this.thead, this.gerarCabecalho())

        if(isgerarCorpo)
            adicionarElemento(this.tbody, this.gerarLinha())
    }

    /**@param {string} file_content */
    gerarTabelaAoCarregarArquivo(file_content) {
        const el_conjunto_estado = document.querySelector(configuracoes.STR_ESTADO_POR_ID)
        const el_alfaberto = document.querySelector(configuracoes.STR_ALFABERTO_POR_ID)
        const el_estado_inicial = document.querySelector(configuracoes.STR_ESTADO_INICIAL_POR_ID)
        const el_estado_final = document.querySelector(configuracoes.STR_ESTADO_FINAL_POR_ID)
        const el_estado_nao_final = document.querySelector(configuracoes.STR_ESTADO_NAO_FINAl_POR_ID)
        const el_alfaberto_fita = document.querySelector(configuracoes.STR_ALFABERTO_FITA_POR_ID)

        try {
            /**@type {Object} */
            const comandos_convertido = JSON.parse(file_content)

            el_conjunto_estado.innerHTML = comandos_convertido.S.join()
            el_alfaberto.innerHTML = comandos_convertido.AF.join()
            el_estado_inicial.innerHTML = comandos_convertido.S0.join()
            el_estado_final.innerHTML = comandos_convertido.F.join()
            el_estado_nao_final.innerHTML = comandos_convertido.R.join()
            el_alfaberto_fita.innerHTML = comandos_convertido.AFF.join()

            this.nontuplaObj = new ValidadorNonTuplas().getNontupla()
            this.gerarTabela(false)
            this.mostrarTabela()
            this.preecharTabelaComCodigosDoArquivo(comandos_convertido)
            
            
        } catch(e) {
            console.error(e)
        }
    }

    /**@param {Object} obj_comandos */
    preecharTabelaComCodigosDoArquivo(obj_comandos) {

        /**@type {Array} */
        const codigo_tabela = obj_comandos.delta 

        /**@type {Array} */
        const estados_nao_finais = this.nontuplaObj.estado_nao_final

        for(let i = 0; i < estados_nao_finais.length; i++) {
            const estado_apontador = estados_nao_finais[i]
            const tr = this.gerarLinha(i + 1, estado_apontador)
            
            this.colocarComandos(estado_apontador, codigo_tabela, tr)

            adicionarElemento(this.tbody, tr)
        }
        
        new TabelaTransicao(new ValidadorNonTuplas())
            .monitorandoTabela()
    }

    /**
     * @param {string} estado_apontador 
     * @param {Array} comandos
     * @param {Element} tr
     * */
    colocarComandos(estado_apontador, comandos, tr) {
        const cmds_do_estado_apontador = comandos.filter(value => value.estado_apontador == estado_apontador)

        for(let cmd of cmds_do_estado_apontador) {
            const pos = this.getPosAlfabertoFitaHeader(cmd.alfaberto_fita_header)
            const tds = tr.querySelectorAll('td')
            const td = tds[pos]
            td.innerHTML = `${cmd.estado} ${cmd.alfaberto_fita_subs} ${cmd.movimentador}`
            formatarTableDataComando(td)
        }
    }

    /**
     * @param {string} alfaberto_fita_header
     */
    getPosAlfabertoFitaHeader(alfaberto_fita_header) {
        return this.nontuplaObj.alfaberto_fita.indexOf(alfaberto_fita_header) + QUANTIDADE_EXTRA_COLUNA
    }


    /**
     * Gerar o cabeçalho da tabela
     * @returns {Element}
     */
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

    /**
     * @param {Number} linha_numeracao
     * @param {string} estado_apontador_default
     * @returns {Element}
     */
    gerarLinha(linha_numeracao = 1, estado_apontador_default = null) {
        const tr = criarElemento("tr")

        const tdlinha = criarElemento("td", linha_numeracao, {
            class: "cmd-linha"
        })
        adicionarElemento(tr, tdlinha)

        // Linhas Dinamica
        for(let i = 0; i <= this.totAlfabetoFita(); i++) {

            if(i == 0) {
                this.el_primeiraLinha = criarElemento("td", estado_apontador_default, {
                    "contenteditable": "true",
                    "estado-apontador": "",
                    "tabindex": "0",
                    "id": "primeira-linha-focus"
                })

                formatarTableDataEstadoApontador(this.el_primeiraLinha)

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

    mostrarTabela() {
        const div_tabela = document.querySelector(configuracoes.STR_TABLE_CONTENT_POR_CLASS)
        div_tabela.classList.remove("ocultar")
    }
}

export class TabelaTransicao {
    constructor(analisadorSintaticoNontupla) {
        this.el_tbody = document.querySelector(configuracoes.STR_TABLE_CORPO_POR_ID)
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

        return this
    }

    apontadorFormatoChange(td) {

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
                formatarTableDataEstadoApontador(td)
                moverCursorContentEditableFinal(td)
            }
        })
        
        td.addEventListener("focus", () => formatarTableDataEstadoApontador(td))
        td.addEventListener("blur",  () => formatarTableDataEstadoApontador(td))
        
    }

    codigoFormatadoChange(td) {

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
                formatarTableDataComando(td)
                moverCursorContentEditableFinal(td)
            }
        })

        td.addEventListener("focus", () => formatarTableDataComando(td))
        td.addEventListener("blur",  () => formatarTableDataComando(td))
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


/** 
 * Método para formatar uma table data que tem um estado apontador 
 * @param {Element} td
 *  */
function formatarTableDataEstadoApontador(td) {
    let exRegular = new configuracoes.ExpressaoRegular()

    td.innerHTML = td.innerText.replace(
        exRegular.Substituicao.ESTADO, `<span class='cmd-apontador'>$1</span>`
    )
}

/**
 * Método para formatar uma table data que tem um estado, alfaberto e movimentador
 * @param {Element} td
 */
function formatarTableDataComando(td) {
    let exRegula = new configuracoes.ExpressaoRegular()

    td.innerHTML = td.innerText.replace(
        exRegula.Substituicao.SUBSTITUIR_COMANDOS, 
        "<span class='cmd-estado'>$1</span> <span class='cmd-transicao'>$3</span> <span class='cmd-direcao'>$5</span>"
    )
}