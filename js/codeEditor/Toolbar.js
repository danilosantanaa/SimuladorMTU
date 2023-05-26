import { SymbolTable } from "../compiler/SymbolTable.js"
import { Nontuple } from "./Nontuple.js"
import { Parser } from "../compiler/Parser.js"
import { FileManager } from "../filemanager/FileManager.js"
import { Lexer } from "../compiler/Lexer.js"
import { VirtualMachine } from "../virtualmachine/VirtualMachine.js"

export class Toolbar {
    constructor() {
        this.nontuple = new Nontuple()
        this.fileManager = new FileManager()
        this.runtime = new RunTime()

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

        this.json_teste = `
        {"stateBegin":"q1","stateEnd":"q3","commands":[{"state":"q1","instructions":[{"state_next":"q1","alphabet_expected":">","alphabet_replace":">","move":"R"},{"state_next":"q1","alphabet_expected":"1","alphabet_replace":"1","move":"R"},{"state_next":"q2","alphabet_expected":"b","alphabet_replace":"1","move":"L"}]},{"state":"q2","instructions":[{"state_next":"q2","alphabet_expected":"1","alphabet_replace":"1","move":"L"},{"state_next":"q3","alphabet_expected":">","alphabet_replace":">","move":"P"}]}]}
        `
    }

    onClickExecute() {
        const base = this

        
        this.btn_execute_el.addEventListener("click", async () => {
            base.btn_execute_el.disabled = true
            const source = base.getSourceComplete()
            
            const symbol_table = new SymbolTable()
            const lexer = new Lexer(source, symbol_table)
            lexer.tokenize()
            
            const parse = new Parser(lexer, symbol_table)
            const json_code = parse.parser()
            
            console.log('--- CODIGO FONTE ---')
            console.log(base.getSourceComplete())
            
            console.log('--- CODIGO GERADO ---')
            console.log(json_code)
            
            const virtual_machine = new VirtualMachine(json_code, base.runtime)
            await virtual_machine.run()

            base.btn_execute_el.disabled = false
        })
    }

    onClickOpenFile() {
        const base = this
        this.btn_open_el.addEventListener("click", async () => {
            await base.fileManager.open()
            await base.fileManager.read()
            base.source = base.fileManager.getContents()

            const symbol_table = new SymbolTable()
            const lexer = new Lexer(base.source, symbol_table)
            lexer.tokenize()

            const parser = new Parser(lexer, symbol_table)
            const json_code = parser.parser()

            console.log('---- CÓDIGO LIDO ----')
            console.log(base.source)

            console.log('---- CÓDIGO GERADO ----')
            console.log(json_code)
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