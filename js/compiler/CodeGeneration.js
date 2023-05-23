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
     * @param {StateMain} stateMain
     */
    add(state, last = false) {
        if(!last) {
            this.commands.push(state)
        } else {
            this.headers.push(state)
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


        // for(let pos = 0; pos < this.body.length; pos++) {

        //     // cmds += `(_input_ribbon  ==  '${this.body[pos].alphabetParams}')
        //     //     {
        //     //         write('${this.body[pos].state}');
        //     //         ${this.body[pos].state}();
        //     //         ${this.body[pos].getMoveComand()}();
        //     //         put('${this.body[pos].alphabetModifier}');
        //     //     }    
        //     // `

        //     cmds += `
        //         {"state_next": "${this.body[pos].state}",
        //         "alphabet_expected": "",
        //         "alphabet_replace": "${this.body[pos].alphabet_expected}",
        //         "move": "${this.body[pos].getMoveComand()}"
            
        //     `
        // }

        cmds += ']}'

        return JSON.stringify(JSON.parse(cmds))
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