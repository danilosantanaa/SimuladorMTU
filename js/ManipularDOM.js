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

function moverCursorContentEditableFinal(elem) {
    let sel = window.getSelection()
    sel.selectAllChildren(elem)
    sel.collapseToEnd()
}

const SimbolosEspeciais = {
    delimitador: {
        simbolo1: ">",
        simbolo2: "►"
    },

    branco_fita: {
        simbolo1: "b",
        simbolo2: "Б"
    }
}

function trocarValores(el, valor) {
    el.innerText = valor
    el.innerText = el.innerText.replace(/b|B/, SimbolosEspeciais.branco_fita.simbolo2)
    el.innerText = el.innerText.replace(">", SimbolosEspeciais.delimitador.simbolo2)
}

/** Responsavel por fazer a manipulação do console */
const cmd =  document.querySelector(".cli-content")
const btn_fechar_console = cmd.querySelector(".controles > .fechar-cmd")
const btn_abrir_console = cmd.querySelector(".controles > .abrir-cmd")
const cli = cmd.querySelector(".cli")

function abrirFecharConsole(abrir_automatico = false) {

    btn_abrir_console.addEventListener("click", abrir)
    btn_fechar_console.addEventListener("click", fechar)

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

export {
    criarElemento,
    adicionarElemento,
    moverCursorContentEditableFinal,
    SimbolosEspeciais,
    trocarValores,
    abrirFecharConsole
}