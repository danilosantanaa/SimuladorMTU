import * as configuracoes from "../configuracoes.js"

export class AnalisadorLexico {
    constructor() {
        this.el_table_row = document.querySelectorAll("#tb-corpo tr")
        this.string_lang = ""
        
        /**
         * Guardará uma sequência de token no formato [token, valor, linha, coluna]
         */
        this.tabelaSimbolos = []

        /**
         * Guardará os erros de reconhecimentos de lexemas [mensage, linha, coluna]
         */
        this.errorList = []
    }


    /**
     * Ler a tabela gerada no HTML e gera a sequência de caracteres
     */
    lerTabela() {
        // Lendo as linhas
        for(let i = 0; i < this.el_table_row.length; i++) {
            const table_data = this.el_table_row[i].querySelectorAll("td:not(.cmd-linha)")

            // lendos as colunas
            for(let j = 0; j < table_data.length; j++) {

                if(j == 0) {
                    this.string_lang += '$'
                }

                this.string_lang += `${table_data[j].innerText.trim()}; `
            }

            this.string_lang += "\n "
        }
    }

    /**
     * Será gerado a tabela de símbolos através da implementação do autômato finito deterministico - AFD.
     * Será gerado a tabela de simbolo que será compartilhado para qualquer fase de analise. 
     */
    gerarTokens() {
        let pos = 0
        let tot_linha = 1
        let tot_coluna = 1

        let estado_atual = 0;
        const ESTADO = {
            Q0: 0,
            Q1: 1,
            Q2: 2,
            Q3: 3,
            Q4: 4,
            Q5: 5,
            Q6: 6,
            Q8: 8,
            REJEICAO: 7
        }

        let cadeia = ""
        while(pos < this.string_lang.length) {
            let caracter =  this.string_lang[pos]

            switch(estado_atual) {
                case ESTADO.Q0:
                    if(caracter == 'Q' || caracter == 'q') {
                        estado_atual = ESTADO.Q1
                        cadeia += caracter
                    } else if(this.isQuebraLinha(caracter)) {
                        estado_atual = ESTADO.Q8;
                        tot_linha++
                        tot_coluna = 1
                        cadeia += caracter
                    } else if(caracter == ';') {
                       estado_atual = ESTADO.Q3
                       cadeia += caracter
                    } else if(this.isAlfabertoFita(caracter)) {
                        estado_atual = ESTADO.Q4
                        cadeia += caracter
                    } else if(this.isMovimentador(caracter)) {
                        estado_atual = ESTADO.Q5
                        cadeia += caracter
                    } else if(caracter == '$') {
                        estado_atual = ESTADO.Q6
                        cadeia += caracter
                    } else if(!this.isIguinorarCaracter(caracter)) {
                        estado_atual = ESTADO.REJEICAO
                        cadeia += caracter
                    }
                    break
                case ESTADO.Q1:
                    if(this.isNumero(caracter)) {
                        estado_atual = ESTADO.Q2
                        cadeia += caracter
                    } else {
                        estado_atual = ESTADO.REJEICAO
                        cadeia += caracter
                    }
                    break
                case ESTADO.Q2:
                    if(this.isNumero(caracter)) {
                        estado_atual = ESTADO.Q2
                        cadeia += caracter
                    }else if(!this.isNumero(caracter)) {
                        estado_atual = ESTADO.Q0
                        pos-- // Back()
                        this.setTabelaSimbolos(configuracoes.TOKENS.ESTADO, cadeia, tot_linha, tot_coluna)
                        cadeia = ""
                    } else {
                        estado_atual = ESTADO.REJEICAO
                    }
                    break
                    case ESTADO.Q3: 
                    estado_atual = ESTADO.Q0
                    pos--
                    this.setTabelaSimbolos(configuracoes.TOKENS.PONTOVIRGULA, cadeia, tot_linha, tot_coluna)
                    tot_coluna++
                    cadeia = ""
                    break
                case ESTADO.Q4:
                    estado_atual = ESTADO.Q0
                    pos--
                    this.setTabelaSimbolos(configuracoes.TOKENS.ALFABERTOFITA, cadeia, tot_linha, tot_coluna)
                    cadeia= ""
                    break
                case ESTADO.Q5:
                    estado_atual = ESTADO.Q0
                    pos--
                    this.setTabelaSimbolos(configuracoes.TOKENS.MOVIMENTO, cadeia, tot_linha, tot_coluna)
                    cadeia = ""
                    break
                case ESTADO.Q6:
                    estado_atual = ESTADO.Q0
                    pos--
                    this.setTabelaSimbolos(configuracoes.TOKENS.DELIMITADOR_APONTADOR, cadeia, tot_linha, tot_coluna)
                    cadeia = ""
                    break
                case ESTADO.Q8:
                    estado_atual = ESTADO.Q0
                    pos--
                    this.setTabelaSimbolos(configuracoes.TOKENS.NOVA_LINHA, cadeia, tot_linha, tot_coluna)
                    cadeia = ""
                    break
                case ESTADO.REJEICAO:
                    if( caracter != 'Q' && 
                        caracter != 'q' && 
                        !this.isNumero(caracter) && 
                        !this.isAlfabertoFita(caracter) && 
                        !this.isIguinorarCaracter(caracter) &&
                        !this.isMovimentador(caracter) &&
                        !this.isQuebraLinha(caracter)
                    ) {
                        estado_atual = ESTADO.REJEICAO
                        cadeia += caracter
                    } else {
                        estado_atual = ESTADO.Q0
                        pos--
                        this.setErros(`A cadeia "${cadeia}" não foi reconhecida!`, tot_linha, tot_coluna)
                        cadeia = ""
                    }
                
            }

            pos++;
        }
    }

    setErros(mensagem, linha, coluna) {
        this.errorList.push({
            mensagem: `<span class='erro-code'>${mensagem}</span>`,
            linha,
            coluna
        })
    }

    setTabelaSimbolos(token, valor, linha, coluna) {
        this.tabelaSimbolos.push({
            token,
            valor,
            linha,
            coluna
        })
    }

    isAlfabertoFita(carater) {
        return  this.isNumero(carater) ||
                carater >= 'a' && carater <= 'p' ||
                carater >= 'r' && carater <= 'z' ||
                carater >= 'A' && carater <= 'K' ||
                carater >= 'M' && carater <= 'O' ||
                carater >= 'S' && carater <= 'Z' ||
                carater == configuracoes.SIMBOLOS_ESPECIAIS.BRANCO_DE_FITA.SIMBOLO_NIVEL_LABEL ||
                carater == configuracoes.SIMBOLOS_ESPECIAIS.BRANCO_DE_FITA.SIMBOLO_NIVEL_DISPLAY ||
                carater == configuracoes.SIMBOLOS_ESPECIAIS.DELIMITADOR.SIMBOLO_NIVEL_LABEL ||
                carater == configuracoes.SIMBOLOS_ESPECIAIS.DELIMITADOR.SIMBOLO_NIVEL_DISPLAY ||
                carater == '+' ||
                carater == '-' ||
                carater == '*' ||
                carater == '/'
    }

    isMovimentador(caracter) {
        return caracter == 'P' || caracter == 'R' || caracter == 'L'
    }

    isQuebraLinha(caracter) {
        return caracter == '\n'
    }

    isIguinorarCaracter(caracter) {
        return caracter[0] == '\s' || caracter[0] == '\r' || caracter[0] == '\b' || caracter[0] == ' ' || caracter == " "
    }

    isNumero(caracter) {
        return caracter >= '0' && caracter <= '9'
    }

}
