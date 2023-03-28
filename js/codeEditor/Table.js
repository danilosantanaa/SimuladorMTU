import { createElement, insertElement } from "../utils.js"

export class Table {
    constructor() {
        this.tb_header_el = document.querySelector('.tb-cabecalho')

        this.tb_body_el = document.querySelector('.tb-corpo')

        this.ribbonAlphabet = []
        this.oldRibbonAlphabet = []

        /** ARRAY DE ELEMENTOS DE CABEÇAHO ADICIONADO
         * @type {Element[]}
         */
        this.el_tb_headers = []

        this.totLineRender = 0

        this.is_init = false

        /**
         * @private
         * @type {Element[]}
         */
        this.trows = []
    }
    
    /**
     * Atualiza a quantidade de coluna que tem na tabela.
     */
    updateTotColumn() {
        this.totColumnRender = this.ribbonAlphabet.length + 2
    }

    addHeader() {
        this.tb_header_el.innerHTML = ""
        this.createHeaderData()
    }

    addBody() {
        this.addLine()
    }

    init() {
        if(this.ribbonAlphabet.length > 0 && !this.is_init) {
            this.updateTotColumn()
            this.addHeader()
            this.addBody()
            this.is_init = true

            this.oldRibbonAlphabet = [...this.ribbonAlphabet]
        }
    }
    
    /**
     * Fica monitorando se houve alguma mudança na tabela
     */
    observer() {
        const ribbonAlphabetDeleted = this.oldRibbonAlphabet.filter(x => this.ribbonAlphabet.indexOf(x.trim()) == -1)
        const ribbonAlphabetAdd = this.ribbonAlphabet.some(x => this.oldRibbonAlphabet.indexOf(x.trim()) == -1)
        
        const isChanged = ribbonAlphabetDeleted.length > 0 || ribbonAlphabetAdd

        if(isChanged) {
            this.addHeader()

            const trows = this.tb_body_el.querySelectorAll("tr")
            console.log(ribbonAlphabetDeleted)
            for(let trow of trows) {

                // Verificar as colunas que foram removidas
                for(let scope of ribbonAlphabetDeleted) {
                    const td_deleted = trow.querySelector(`.scope-${scope.trim()}`)
                    trow.removeChild(td_deleted)
                }

                // Verificando as colunas que foram adicionadas
                const tds = trow.querySelectorAll('[ribbon-alphabet]')
                for(let i = 0; i < this.ribbonAlphabet.length; i++) {
                    const sameScoped = tds[i]?.classList.contains(`scope-${this.ribbonAlphabet[i]}`)

                    if(!sameScoped) {
                        const newTd = createElement('td', null, {
                            class: `scope-${this.ribbonAlphabet[i]}`,
                            "ribbon-alphabet": "",
                            contenteditable: true
                        })

                        
                        if(i == this.ribbonAlphabet.length - 1) {
                            newTd.addEventListener("keypress", e => this.callKeyDown(e, trow))
                        } else {
                            if(tds[i].has)
                            tds[i].removeEventListener("keydown", this.callKeyDown)
                            
                        }
                        insertElement(trow, newTd, tds[i])
                    }
                }
            }
        }
    }

    /**
     * Atualizar os números de linhas da tabela
     * @private
     */
    updateLineNumber(pos = 0) {
        const allTdNumberLine = this.tb_body_el.querySelectorAll(".number-line")
        const allTrs = this.tb_body_el.querySelectorAll("tr")

        for(let i = pos; i < allTdNumberLine.length; i++) {
            allTdNumberLine[i].innerHTML = i + 1
        }

        for(let i = pos; i < allTrs.length; i++) {
            allTrs[i].setAttribute("position", i)
        }
    }

    /**
     * Criar um cabeçalho da tabela conforme foi configurado no alphabeto de fita
     * @private
     */
    createHeaderData() {
        this.tr = createElement('tr')

        this.el_tb_headers = [
            createElement("th", null, {
                class: "cmd-line cl-code"
            }),

            createElement("th", "Q/Sig", {
                class: "label-table"
            })
        ]

        this.addRibbonAlphabet()

        // Inserindo os alfabeto de fita
        for(let el of this.el_tb_headers) {
            insertElement(this.tr, el)
        }

        // Adicionando o elemento na lista
        this.tb_header_el.appendChild(this.tr)
    }

    /**
     * Adiciona os alfabeto de fita no cabeçalho da tabela
     * @private
     */
    addRibbonAlphabet() {
        for(let alphabet of this.ribbonAlphabet) {
            this.el_tb_headers.push(
                createElement("th", alphabet.trim(), {
                    class: `ribbon-alphabet scope-${alphabet}`
                })
            )
        }
    }

    /**
     * Adiciona uma nova na tabela
     */
    addLine(pos = null) {
        const base = this
        const tr = createElement("tr")
        let td_focus = null

        this.updateTotColumn()

        for(let i = 0; i < this.totColumnRender; i++) {
            let td = null

            // Verifica se é a coluna dos número de linha
            if(i == 0) {
                td = createElement("td", this.totLineRender + 1, {
                    class: `number-line cl-code`
                })

            } else {
                td = createElement("td", null, {
                    contenteditable: true
                })
            }
            
            // Verifica se está na coluna dos conjuntos de estados e adiciona a funcionalidade de apagar a linha
            if(i == 1) {
                if(this.totLineRender > 0) {
                    td.onkeydown = e => base.removeLine(e, tr)
                }

                td_focus = td
            }

            // Adicionar o scopes, deve sempre retirar -2 devido as primeira colunas extras iniciais
            if(i > 1) {
                td.setAttribute("class", `scope-${this.ribbonAlphabet[i-2]}`)
                td.setAttribute("ribbon-alphabet", "")
            }

            // Adiciona a funcionalidade de criar uma nova linha
            this.addEventCreateNewLine(td, tr)
           
            insertElement(tr, td) 
            
            this.trows.push(tr)
        }

        this.totLineRender++
        
        const allTrs = this.tb_body_el.querySelectorAll("tr")
        
        insertElement(this.tb_body_el, tr, allTrs[pos])
        td_focus.focus()
        this.updateLineNumber(pos ?? 0)
    }

    removeLine(event, tr) {
        const position = tr.getAttribute("position")
        
        if(event.srcElement.innerText == "") {
            if(event.key == 'Backspace') {
                event.preventDefault()
                this.tb_body_el.removeChild(tr)
                this.totLineRender--

                // Focar para anterior que não foi removido
                const antepenult = this.tb_body_el.childNodes[position - 1]
                antepenult.querySelectorAll("td")[1]?.focus()
                
            }
        }

        this.updateLineNumber((position ?? 1) - 1)
    }

    /**
     * @private
     * @param {Element} td
     * @param {Element} tr
     */
    addEventCreateNewLine(td, tr) {
        const base = this
        td.addEventListener("keydown", (e) => base.callKeyDown(e, tr))
    }

    callKeyDown(e, tr) {
        this.updateTotColumn()

        const positionNextElement = Number(tr.getAttribute("position")) + 1
        const lastColumn = tr.querySelectorAll("td")[this.totColumnRender - 1]
        const positionLastColumn = e.target == lastColumn

        const lastPosition = this.totLineRender == positionNextElement && positionLastColumn

        if(e.shiftKey && e.key == 'Tab') {
            return
        }

        if(e.key == 'Tab' && lastPosition || e.key == 'Enter' || e.keyCode == 13) {
            e.preventDefault()
            this.addLine(positionNextElement)
        }
    }

}