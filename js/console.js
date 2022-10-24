import { criarElemento, adicionarElemento } from "./ManipularDOM.js"

/** Responsavel por fazer a manipulação do console */
const cmd =  document.querySelector(".cli-content")
const btn_fechar_console = cmd.querySelector(".controles > .fechar-cmd")
const btn_abrir_console = cmd.querySelector(".controles > .abrir-cmd")
const btn_erros = cmd.querySelector(".erros")
const btn_avisos = cmd.querySelector(".avisos")
const cli = cmd.querySelector(".cli")
const el_ul_console = document.querySelector(".cmd-line-display ul")

function abrirFecharConsole(abrir_automatico = false) {

    btn_abrir_console.addEventListener("click", abrir)
    btn_fechar_console.addEventListener("click", fechar)
    btn_erros.addEventListener("click", abrir)
    btn_avisos.addEventListener("click", abrir)

    if(abrir_automatico) {
        abrir()
    }
}

function abrir() {
    btn_abrir_console.classList.add("open")
    btn_fechar_console.classList.add("open")
    cli.classList.add("open")
    cli.classList.remove("close")
}

function fechar() {

    btn_abrir_console.classList.remove("open")
    btn_fechar_console.classList.remove("open")
    cli.classList.add("close")
    cli.classList.remove("open")
}

function setTotErro(tot = 0) {
    document.querySelector(".info .erros .tot").innerHTML = `(${tot})`
}

function setTotAvisos(tot = 0) {
    document.querySelector(".info .avisos .tot").innerHTML = `(${tot})`
}

function setItemConsole(arry = []) {
    for(let i = 0; i < arry.length; i++) {
        const li = criarElemento("li")
        li.innerHTML = `(${arry[i].linha}, ${arry[i].coluna}) - ${arry[i].mensagem}`
        adicionarElemento(el_ul_console, li)
    }
}

function setConsoleLogs(errosLexico = [], errosSintatico = [],  avisos = []) {
    el_ul_console.innerHTML = ""
    setItemConsole(errosLexico)
    setItemConsole(errosSintatico)
    setItemConsole(avisos)

    setTotAvisos(avisos.length)
    setTotErro(errosLexico.length + errosSintatico.length)
}

export {
    abrirFecharConsole,
    setTotErro,
    setTotAvisos,
    setConsoleLogs
}