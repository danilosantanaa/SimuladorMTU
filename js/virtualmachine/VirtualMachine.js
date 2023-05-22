export class VirtualMachine {
    /**
     * 
     * @param {string} json_code_string 
     * @param {RunTime} runtime 
     */
    constructor(json_code_string, runtime) {
        try {
            /**@type {  } */
            const json_code = JSON.parse(json_code_string)

            /**@type { RunTime } */
            this.runtime = runtime

            /** Declarações dos estados iniciais e finais */
            this.stateBegin = json_code.stateBegin
            this.stateEnd = json_code.stateEnd

            /**
             * Listagem com todos os comandos, contendo os objetos:
             * {
             *      state: string,
             *      instructions: array(
            *           state_next: string,
            *           alphabet_expected: string,
            *           alphabet_replace: string,
            *           move: string
             *      )
             * }
             * @type {Object[]} */
            this.commands = json_code.commands

        } catch (e) {
            console.error(e)
        }
    }

    async run() {
        let finashed = false
        let state_current = this.stateBegin
        
        this.runtime.init()

        while (!finashed) {
            this.runtime.updateCeils()

            // Exibi o comando no display do simulador
            this.runtime.write(state_current)

            // Ler o comando na fita
            const input = this.runtime.read()

            // Pesquisa o comando
            const command = this.searchIntructions(state_current, input)

            if(command == undefined || command == null ) {
                console.log('Comando quebrado...')
                finashed = true
            }

            state_current = command.state_next
            this.runtime.put(command.alphabet_replace)
            switch(command.move) {
                case 'R':
                    await this.runtime.right()
                break
                case 'L':
                    await this.runtime.left()
                break;
                case 'P':
                    await this.runtime.stop()
                    console.log('Finalizado com sucesso!')
                    finashed = true
                    
                break;
                default:
                    throw 'Comando movimentador inválido!'
            }
        }

        // verificar se chegou no estado final
    }

    searchIntructions(statePointer, alphabet_reading) {
        const state_pointer = this.commands.filter(x => x.state == statePointer)[0]
        const instruction = state_pointer.instructions.filter(intruction => intruction.alphabet_expected == alphabet_reading)[0]

        return instruction
    }
}