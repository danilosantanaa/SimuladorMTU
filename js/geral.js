import { criarElemento, adicionarElemento } from "./ManipularDOM.js"

const el_fitas = document.querySelector(".fitas")
document.addEventListener("DOMContentLoaded", gerarCedulasFitas);

function gerarCedulasFitas() {
    el_fitas.innerHTML = ""

    for(let contador = 0; contador < 1000; contador++) {
        if(contador == 0) { // DELIMITADOR
            adicionarElemento(el_fitas, criarElemento("div", "&#9658;", {
                class: "cedula"
            }))
        } else {
            adicionarElemento(el_fitas, criarElemento("div", "&#x411;", {
                class: "cedula",
                "contenteditable": "true"
            }))
        }
    }
}


