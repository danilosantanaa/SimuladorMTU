export class Nontuple {
    constructor() {
        this.stateSetsEl = document.querySelector("#estados")
        this.alphabetEl = document.querySelector("#alfabeto")
        this.stateBeginEl = document.querySelector("#estado-inicial")
        this.stateFinalEl = document.querySelector("#estado-final")
        this.stateNotFinal = document.querySelector("#estado-nao-final")
        this.ribbonAlphabetSetsEl = document.querySelector("#alfabeto-fita")
        this.delimiter = document.querySelector("#delimitadir")
        this.tangeBlank = document.querySelector("#branco-fita")
    }

    getStateSets() {
        return this.stateSetsEl.innerText.split(',')
    }

    getAlphabetSets() {
        return this.alphabetEl.innerText.split(',')
    }

    getStateBegin() {
        return this.stateBeginEl.innerText.split(',')
    }

    getStateFinal() {
        return this.stateFinalEl.innerText.split(',')
    }

    getStateNotFinal() {
        return this.stateNotFinal.innerText.split(',')
    }

    getRibbonAlphabetSets() {
        return this.ribbonAlphabetSetsEl.innerText.split(',')
    }

    getDelimiter() {
        return this.delimiter.innerText(',')
    }

}