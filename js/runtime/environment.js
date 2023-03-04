import * as configuracoes from "../configuracoes.js"
import { GerarTabelaTransicao } from "../manipularTabela.js"
import { Nontupla } from "../validadorNontuplas.js"
import { Runtime } from "./runtime.js"


export class Environment {
    
    /**
     * @param {Nontupla} obj_nontuplas 
     */
    constructor(obj_nontuplas) {

        /**@type {Element} */
        this.el_btn_executar = document.querySelector(configuracoes.STR_BUTTON_EXECUTAR_POR_CLASS)

        /**@type {Element} */
        this.el_btn_resertar = document.querySelector(configuracoes.STR_BUTTON_RESERTAR_POR_CLASS)

        /**@type {Element} */
        this.el_btn_salvar = document.querySelector(configuracoes.STR_BUTTON_SALVAR_POR_CLASS)

        /**@type {Element} */
        this.el_btn_abrir = document.querySelector(configuracoes.STR_BUTTON_ABRIR_POR_CLASS)

        /**@type {Nontupla} */
        this.obj_nontuplas = obj_nontuplas

        this.modificado_arquivo = false
        this.hashfilecontent = ""
    }

    run() {
        this.btnExecutarClick()
        this.btnResertarClick()
        this.btnSalvarArquivoClick()
        this.btnAbrirArquivoClick()
        this.monitorarBotaoSalvar()
    }

    btnExecutarClick() {
        this.el_btn_executar.addEventListener(
            "click", 
            async () => {
                const runtime = new Runtime(
                    this.obj_nontuplas
                )

                await runtime.executarComandos()
            }, 
            true
        )
    }

    btnResertarClick() {
        this.el_btn_resertar.addEventListener(
            "click",
            () => {
                let pos_cedula_lida = 0
                const cedulas = document.querySelectorAll(".fitas > div")
                for(let i of  cedulas){

                    if(pos_cedula_lida == 0) {
                        i.innerText = configuracoes.SIMBOLOS_ESPECIAIS.DELIMITADOR.SIMBOLO_NIVEL_DISPLAY
                    }

                    let canResertarCelula = 
                        i.innerText.trim() != configuracoes.SIMBOLOS_ESPECIAIS.BRANCO_DE_FITA.SIMBOLO_NIVEL_DISPLAY && 
                        i.innerText.trim() != configuracoes.SIMBOLOS_ESPECIAIS.BRANCO_DE_FITA.SIMBOLO_NIVEL_LABEL && 
                        i.innerText.trim() != configuracoes.SIMBOLOS_ESPECIAIS.DELIMITADOR.SIMBOLO_NIVEL_DISPLAY && 
                        i.innerText.trim() != configuracoes.SIMBOLOS_ESPECIAIS.DELIMITADOR.SIMBOLO_NIVEL_LABEL
                                
                    if(canResertarCelula){
                        i.innerText = configuracoes.SIMBOLOS_ESPECIAIS.BRANCO_DE_FITA.SIMBOLO_NIVEL_DISPLAY
                    }
            
                    pos_cedula_lida++
                }
            },
            false
        )
    }

    btnSalvarArquivoClick() {
       this.el_btn_salvar.addEventListener(
            "click",
            () => {

                const runtime = new Runtime(
                    this.obj_nontuplas
                )

                if(!runtime.analisadorSintatico.comandos.some(() => true)) return
                
                const blob = new Blob([runtime.getComandos()], {
                    type: "text/plain"
                })

                /**@type {URL} */
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                const filename = `${new Date().getTime()}${configuracoes.EXTENSAO_CODIGO_FONTE}`

                a.setAttribute("href", url)
                a.setAttribute("download", filename)
                a.setAttribute("target", "_blank")

                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
            },
            false
       )
    }

    btnAbrirArquivoClick() {
        const base = this
        this.el_btn_abrir.addEventListener(
            "click",
            () => {
                const inputFile = document.createElement("input")

                inputFile.setAttribute("type", "file")
                inputFile.setAttribute("accept", configuracoes.EXTENSAO_CODIGO_FONTE)

                document.body.appendChild(inputFile)
                inputFile.click()
                base.inputFileChanged(inputFile)
                document.body.removeChild(inputFile)
            },
            false
        )
    }

    /**@param {HTMLInputElement} input */
    inputFileChanged(input) {
        const base = this
        input.addEventListener("change", async () => {

        try {
            const content = await base.lerArquivo(input)
           base.hashfilecontent = await configuracoes.gerarHashSHA256Text(content)

           console.log(content, base.hashfilecontent)

           const gerarTabela = new GerarTabelaTransicao()

           gerarTabela.gerarTabelaAoCarregarArquivo(content)
        } catch(e) {
            console.error(e)
        }
           
        },
        true)
    }

    /**@param {HTMLInputElement} input */
    async lerArquivo(input) {
        const file = input.files[0]
        const extensao = file.name.substring(file.name.lastIndexOf("."))
        const reader = new FileReader()
        let file_content = ""

        const isExtensaoValida = extensao == configuracoes.EXTENSAO_CODIGO_FONTE
        if(!isExtensaoValida) throw {
            erro: "Extensão Invalida!"
        }

        reader.readAsText(file)

        await new Promise((resolve, reject) => {
            reader.onload = (e) => {
                file_content += e.target.result
                resolve()
            }

            reader.onerror = reject
        })

        return file_content
    }

    monitorarBotaoSalvar() {
        const base = this
        setInterval(() => {
            
            const runtime = new Runtime(
                base.obj_nontuplas
            )

            /**@type {Element} */
            const btn_salva = document.querySelector(configuracoes.STR_BUTTON_SALVAR_POR_CLASS)
            const pendente_class = "pendente"
            const isValidoCodigo = !btn_salva.classList.contains(pendente_class) && runtime.anyCodigo()
            const isInvalidoCodigo = btn_salva.classList.contains(pendente_class) && !runtime.anyCodigo()

            if(isValidoCodigo) {
                btn_salva.classList.add(pendente_class)
            }

            if(isInvalidoCodigo) {
                btn_salva.classList.remove(pendente_class)
            }

        }, 250)
    }
}