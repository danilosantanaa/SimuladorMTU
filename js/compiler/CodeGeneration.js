export class CodeGeneration {
    constructor() {
        /**
         * Será gerada a lista de comandos
         * @type {any[]}
         */
        this.commands = []

        /**
         * Últimos comandos
         */
        this.headers = []
    }

    /**
     * @param {any} stateMain
     */
    add(sets, is_header = false) {
        if(!is_header) {
            this.commands.push(sets)
        } else {
            this.headers.push(sets)
        }
    }

    /**
     * Geração de código final
     */
    generationFinalCode() {
        let json = "{"

        // Gerando as chamada iniciais: estado inicial e final
        json += this.headers.map(x => `${x.convert()},`).join("")

        // Gerando as instruções
        json += `"commands": [`
        json += this.commands.map(x => x.convert()).join(',')
        json += ']'
        // fim da geração de instruções

        json += '}'

        return json
    }
}

export class StateMain {
    /**
     * 
     * @param {string} label
     */
    constructor(label) {
        this.label = label

        /**@type {Instruction[]} */
        this.body = []
    }

    /**
     * @param {Instruction} instruction
     */
    add(instruction) {
        this.body.push(instruction)
    }

    convert() {
        let cmds = `{ "state": "${this.label}",`
        
        cmds += `"instructions": [`
        cmds += this.body.map(x => {
            return ` {
                "state_next": "${x.state}",
                "alphabet_expected": "${x.alphabet_expected}",
                "alphabet_replace": "${x.alphabet_replace}",
                "move": "${x.getMoveComand()}"
            }
            `
        }).join(', ')
        cmds += ']}'

        return JSON.stringify(JSON.parse(cmds))
    }
}

export class SetState {
    constructor() {
        this.labels = []
    }

    add(label) {
        this.labels.push(`"${label}"`)
    }

    convert() {
        return `"stateSets": [${this.labels.join(',')}]`
    }
}

export class Alphabet {
    constructor() {
        this.labels = []
    }

    add(label) {
        this.labels.push(`"${label}"`)
    }

    convert() {
        return `"alphabet": [${this.labels.join(',')}]`
    }
}

export class StateBegin {
    constructor(label) {
        this.label = label
    }

    convert() {
       return `"stateBegin": "${this.label}"`
    }
}

export class StateEnd {
    constructor(label) {
        this.label = label
    }

    convert() {
        return `"stateEnd": "${this.label}"`
    }
}

export class StateNoFinal {
    constructor() {
        this.labels = []
    }

    add(label) {
        this.labels.push(`"${label}"`)
    }

    convert() {
        return `"stateNoFinal": [${this.labels.join(',')}]`
    }
}

export class RibbonAlphabet {
    constructor() {
        this.labels = []
    }

    add(label) {
        this.labels.push(`"${label}"`)
    }

    convert() {
        return `"ribbonAlphabet": [${this.labels.join(',')}]`
    }
}

export class Delimiter {
    constructor() {
        this.label = ""
    }

    add(label) {
        this.label = label
    }

    convert() {
        return `"delimiter":"${this.label}"`
    }
}

export class TangeBlank {
    constructor() {
        this.label = ""
    }

    add(label) {
        this.label = label
    }

    convert() {
        return `"tangeBlank":"${this.label}"`
    }
}

export class Instruction {
    constructor() {
        this.state = null
        this.alphabet_expected = null
        this.alphabet_replace = null

        /**
         * @private
         */
        this.__move = null
    }

    setRightCommand() {
        this.__move = 'R'
    } 

    setLeftCommand() {
        this.__move = 'L'
    }

    setStopCommand() {
        this.__move = 'P'
    }

    getMoveComand() {
        return this.__move
    }
}