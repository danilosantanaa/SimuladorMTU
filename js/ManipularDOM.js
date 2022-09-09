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


export {
    criarElemento,
    adicionarElemento
}