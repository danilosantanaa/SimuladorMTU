import { SymbolTable } from "../compiler/SymbolTable.js"
import { Nontuple } from "./Nontuple.js"
import { Parser } from "../compiler/Parser.js"
import { FileManager } from "../filemanager/FileManager.js"
import { Lexer } from "../compiler/Lexer.js"

export class Toolbar {
    constructor() {
        this.nontuple = new Nontuple()
        this.fileManager = new FileManager()

        this.btn_open_el = document.querySelector('.btn.abrir')
        this.btn_save_el = document.querySelector('.btn.salvar')
        this.btn_novo_el = document.querySelector('.btn.novo')
        this.btn_execute_el = document.querySelector('.btn.executar')
        this.btn_stop_el = document.querySelector('.btn.parar')
        this.btn_resert_el = document.querySelector('.btn.resertar')
        this.range_speed_el = document.querySelector('#velocidade')

        this.onClickExecute()
        this.onClickOpenFile()
        this.onClickNewFile()
        this.onClickSave()

        this.source = ""
    }

    onClickExecute() {
        const base = this
        this.btn_execute_el.addEventListener("click", () => {
           const source = base.getSourceComplete()

            const symbol_table = new SymbolTable()
            const lexer = new Lexer(source, symbol_table)
            lexer.tokenize()

            const parse = new Parser(lexer, symbol_table)
            parse.parser()

            console.log('------------')
            console.log(base.getSourceComplete())
        })
    }

    onClickOpenFile() {
        const base = this
        this.btn_open_el.addEventListener("click", async () => {
            await base.fileManager.open()
            await base.fileManager.read()
            base.source = base.fileManager.getContents()
            console.log(base.source)
        }, true)

    }

    onClickNewFile() {
        const base = this

        this.btn_novo_el.addEventListener("click", async () => {
            await base.fileManager.create()
        }, true)
    }

    onClickSave() {
        const base = this

        this.btn_save_el.addEventListener("click", async () => {
            await base.fileManager.setContents(this.getSourceComplete())
            await base.fileManager.save()
        })
    }

    getSourceComplete() {
        return this.nontuple.getCode() + this.nontuple.table.readContent()
    }
}