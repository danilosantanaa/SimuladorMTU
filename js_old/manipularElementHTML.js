import { SIMBOLOS_ESPECIAIS } from "./configuracoes.js"
 
/**
 * 
 * @param {string} elemento 
 * @param {string} valor 
 * @param {string} propriedades 
 * @returns {Element}
 */
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
    el.innerText = el.innerText.replace(/b|B/, SIMBOLOS_ESPECIAIS.BRANCO_DE_FITA.SIMBOLO_NIVEL_DISPLAY)
    el.innerText = el.innerText.replace(">", SIMBOLOS_ESPECIAIS.DELIMITADOR.SIMBOLO_NIVEL_DISPLAY)
}

export {
    criarElemento,
    adicionarElemento,
    moverCursorContentEditableFinal,
    SimbolosEspeciais,
    trocarValores
}