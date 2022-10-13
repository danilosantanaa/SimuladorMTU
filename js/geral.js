import { criarElemento, adicionarElemento, SimbolosEspeciais } from "./ManipularDOM.js"
import { abrirFecharConsole } from "./console.js"

const el_fitas = document.querySelector(".fitas")
document.addEventListener("DOMContentLoaded", gerarCedulasFitas);

// Gerador das cedulas
function gerarCedulasFitas() {
    el_fitas.innerHTML = ""

    for(let contador = 0; contador < 1000; contador++) {

        let cedula = undefined
        if(contador == 0) { // DELIMITADOR
            cedula = criarElemento("div", "&#9658;", {
                class: "cedula"
            })

            adicionarElemento(el_fitas, cedula)
        } else {

            cedula = criarElemento("div", "&#x411;", {
                class: "cedula",
                "contenteditable": "true"
            })

            adicionarElemento(el_fitas, cedula)
        }

        //cedula.addEventListener("focusout", (e => verificarCaracteresCedula(e)))
        cedula.addEventListener("keydown", (e => verificarCaracteresCedula(e)))
        cedula.addEventListener("keyup", (e => verificarCaracteresCedula(e)))
        cedula.addEventListener("keypress", (e => verificarCaracteresCedula(e)))
        cedula.addEventListener("change", (e => trocarCaracteres(e)))
    }
}

function verificarCaracteresCedula(e) {
    const keyCode = e.keyCode
    console.log(keyCode)

    /**
     * Isso foi programado usando como base a tabela da simbolos ASCII
     * https://bournetocode.com/projects/GCSE_Computing_Fundamentals/pages/img/ascii_table_lge.png
     */
    if(keyCode >= 33 && keyCode <= 126 || keyCode == 62) {
        e.preventDefault()
        
        if((e.target.innerText.length == 0 || e.target.innerText.length == 1) && keyCode != 62) {

            // Se Capslock está desligado e estiver no intervalo de letra entao mostrar os caracteres corretos => (p ^ q) --> r
            if(keyCode >= 65 && keyCode <= 90) {
                const isCapslock = event.getModifierState("CapsLock")

                e.target.innerText = String.fromCharCode(e.keyCode + (!isCapslock ? 32 : 0))
            } else {
                e.target.innerText = String.fromCharCode(e.keyCode)
            }

            trocarCaracteres(e)
        }
        
    } 

}


function trocarCaracteres(e) {
    e.target.innerText = e.target.innerText.replace(/b|B/, SimbolosEspeciais.branco_fita.simbolo2)
    e.target.innerText = e.target.innerText.replace(">", SimbolosEspeciais.delimitador.simbolo2)
}

abrirFecharConsole()