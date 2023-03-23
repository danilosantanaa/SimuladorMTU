export class CodeGeneration {
    constructor() {
        /**
         * Será gerada a lista de comandos
         * @type {StateMain[]}
         */
        this.commands = []
    }

    /**
     * @param {StateMain} stateMain
     */
    add(state) {
        this.commands.push(state)
    }

    /**
     * Geração de código final
     */
    generationFinalCode() {
        let cmd_final = ''

        this.commands.forEach(cmd => {
            cmd_final += cmd.convert()
        });

        return cmd_final
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
        let cmds = `function ${this.label}(){ let _input_ribbon = read();`
        
        for(let pos = 0; pos < this.body.length; pos++) {
            if (pos == 0) {
                cmds += "if"
            } else {
                cmds += "else if"
            }

            cmds += `
                (_input_ribbon == '${this.body[pos].alphabetParams}')
                {
                    ${this.body[pos].state}();
                    ${this.body[pos].getMoveComand()}();
                    put('${this.body[pos].alphabetModifier}');
                }    
            `
        }

        cmds += 'else {reject();}'

        cmds += '}'

        return cmds
    }
}

export class Instruction {
    constructor() {
        this.state = null
        this.alphabetParams = null
        this.alphabetModifier = null

        /**
         * @private
         */
        this.__move = null
    }

    setRightCommand() {
        this.__move = 'right'
    } 

    setLeftCommand() {
        this.__move = 'left'
    }

    setStopCommand() {
        this.__move = 'stop'
    }

    getMoveComand() {
        return this.__move
    }
}