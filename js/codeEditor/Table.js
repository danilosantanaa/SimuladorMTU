import { createElement, insertElement } from "../utils.js"

export class Table {
    constructor() {
        /** @type {Element} */
        this.content_code = document.querySelector('div.tb-content')

        this.tb_header_el = document.querySelector('.tb-cabecalho')

        this.tb_body_el = document.querySelector('.tb-corpo')

        /**@type {Array} */
        this.ribbonAlphabet = []

        /** ARRAY DE ELEMENTOS DE CABEÇAHO ADICIONADO
         * @type {Element[]}
         */
        this.headers_aux = []

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
        }

        this.observer()
    }

    updateRibbonRemoved() {
        const el_tr = this.tb_header_el.querySelector('tr')
        const headers = Array.from(this.tb_header_el.querySelectorAll("th[scope]"));
        const base = this
       
        const els_removed = 
            headers.map(el => el.getAttribute('scope'))
                .filter(attr => !base.ribbonAlphabet.some(ribbon => attr == ribbon))
        
        // Removendo o alfabeto que não se encontra mais no header
        for(let th of headers) {
            const scope = th.getAttribute('scope')
            const is_removed = els_removed.some(el_rem => el_rem == scope)

            if(is_removed) {
                el_tr.removeChild(th)
            }
        }

        // Removendo o alfabeto que não se encontra mais no body
        for(let tr of this.tb_body_el.querySelectorAll('tr')) {
            for(let td_scope of tr.querySelectorAll('td[scope]')) {
                const is_removed = els_removed.some(el_rem => el_rem == td_scope.getAttribute('scope'))

                if(is_removed) {
                    tr.removeChild(td_scope)
                }
            }
        }
    }

    updateRibbonAdded() {
        /**@type {Element} */
        const tr = this.tb_header_el.querySelector('tr')
        
        // Adicionando os novos alfabeto de fitas no header
        for(let pos = 0; pos < this.ribbonAlphabet.length; pos++) {
            const headers_th = this.tb_header_el.querySelectorAll('th[scope]')
            const alphabet =  this.ribbonAlphabet[pos]
            const scope = headers_th[pos]?.getAttribute('scope')

            if(scope != alphabet) {
                const th = createElement('th', alphabet, this.addDataInformationElement(alphabet, false))
                tr.insertBefore(th, headers_th[pos])
            }   
        }

        // Adicionando os novos alfabeti de fita no body
        for(let pos = 0; pos < this.ribbonAlphabet.length; pos++) {
            const trs = this.tb_body_el.querySelectorAll('tr')

            for(let tr of trs) {
                const tds_scope = tr.querySelectorAll('td[scope]')
                const alphabet =  this.ribbonAlphabet[pos]
                const scope = tds_scope[pos]?.getAttribute('scope')

                if(scope != alphabet) {
                    const td = createElement('td', null, this.addDataInformationElement(alphabet, true))
                    tr.insertBefore(td, tds_scope[pos])

                    this.addEventCreateNewLine(td, tr)
                }
            }
        }
    }
    
    /**
     * Fica monitorando se houve alguma mudança na tabela
     */
    observer() {
       
       this.content_code.style.display = this.ribbonAlphabet.length == 0 ? 'none' : 'block'

       this.updateTotColumn();
       this.updateRibbonRemoved()
       this.updateRibbonAdded()
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

        this.headers_aux = [
            createElement("th", null, {
                class: "number-line cl-code"
            }),

            createElement("th", "Q / Σ", {
                class: "label-table"
            })
        ]

        this.addRibbonAlphabet()

        // Inserindo os alfabeto de fita
        for(let el of this.headers_aux) {
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
            this.headers_aux.push(
                createElement("th", alphabet.trim(), this.addDataInformationElement(alphabet))
            )
        }
    }

    addDataInformationElement(alphabet, edditabled = false) {
        const data_dom = {
            class: `ribbon-alphabet`,
            scope: alphabet
        }

        if(edditabled) {
            data_dom.contenteditable = true
        }

        return data_dom
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
                td.setAttribute('scope', this.ribbonAlphabet[i-2])
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