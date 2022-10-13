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



export {
    criarElemento,
    adicionarElemento,
    moverCursorContentEditableFinal,
    SimbolosEspeciais,
    trocarValores
}