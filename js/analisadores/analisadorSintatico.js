import * as configuracoes from "../configuracoes.js"
import { Nontupla } from "../validadorNontuplas.js"
import { AnalisadorLexico } from "./analisadorLexico.js"
import { AnalisadorSemantico } from "./analisadorSemantico.js"

export class AnalisadorSintatico {

    /**
     * @param {Nontupla} obj_nontuplas
     * @param {AnalisadorSemantico} analisadorSematico
     *  */
    constructor(obj_nontuplas, analisadorSematico) {

        /**@type {AnalisadorLexico} */
        this.analisadorLexico = new AnalisadorLexico()

        /**@type {Nontupla} */
        this.obj_nontuplas = obj_nontuplas

        /**@type {Array} */
        this.comandos = []

        /**@type {Number} */
        this.lookahead = 0
        
        this.errosSintaticos = []
        this.avisosSintaticos = []

        this.analisadorLexico.lerTabela()
        this.analisadorLexico.gerarTokens()

        // Analisador sematico
        this.analisadorSematico = analisadorSematico

        if(this.analisadorLexico.errorList.length == 0) {
            this.programa()

            this.verificarDeclaracaoTodosEstados()
            this.verificarErrosMovimentadorParada()
            this.verificarErrosEstadoInicial()
            this.verificarErrosEstadoFinal()
        }
    }

    // Gramatica livre de contexto
    programa() {
        const stmt = this.analisadorLexico.tabelaSimbolos[this.lookahead]

        if(stmt == undefined) return

        if(stmt.token == configuracoes.TOKENS.DELIMITADOR_APONTADOR) {
            this.delimitadorApontador()
            this.estado()
            if(!this.analisadorSematico.estado_apontador_declarado.has(this.analisadorSematico.estado)) {
                if(this.obj_nontuplas.estado_final.some(estado_final => estado_final == this.analisadorSematico.estado)) {
                    this.setAvisos(`O Estado "${this.analisadorSematico.estado}" não pode ser declarado. Estado final não precisa ser declarado na primeira coluna.`)
                } else {
                    this.analisadorSematico.estado_apontador_declarado.set(this.analisadorSematico.estado, configuracoes.TOKENS.ESTADO)
                    this.analisadorSematico.estado_apontador = this.analisadorSematico.estado
                }
            } else {
                this.setErros(`O ESTADO "${this.analisadorSematico.estado}" já foi declarado.`, this.analisadorSematico.num_linha, this.analisadorSematico.num_coluna)
            }

            this.pontoVirgula()
            this.comando()
            this.programa()
        }
    }

    delimitadorApontador() {
        const stmt = this.analisadorLexico.tabelaSimbolos[this.lookahead]

        if(stmt.token != configuracoes.TOKENS.DELIMITADOR_APONTADOR) {
            this.setErros(`Deve haver um operador no código-fonte que simboliza estado apontador"`, stmt.linha, stmt.coluna)
        }

        this.proximoToken()
    }
    
    pontoVirgula(apontador = true) {
        const stmt = this.analisadorLexico.tabelaSimbolos[this.lookahead]

        if(stmt.token != configuracoes.TOKENS.PONTOVIRGULA) {
            this.setErros(`${apontador ? "Deve haver somente único ESTADO. Deve ser q0 até qN, tal que qN pertença ao conjuntos de estados." : "Deve haver &lt;ESTADO&gt;&lt;ALFABERTO DE FITA&gt;&lt;MOVIMENTADOR&gt;: Exemplo de comando: \"qN A M\", esses elementos deve pertence ao conjuntos informado na nontuplas."}`, stmt.linha, stmt.coluna)
        }

        this.proximoToken()
    }

    comando() {
        const stmt = this.analisadorLexico.tabelaSimbolos[this.lookahead]

        if(stmt == undefined) return;
    
        if(stmt.token == configuracoes.TOKENS.ESTADO ) {
            this.estado()
            this.alfabertoFita()
            this.movimento()
            this.analisadorSematico.setComandos()
            this.comandos.push({
                estado_apontador: this.analisadorSematico.estado_apontador,
                estado: this.analisadorSematico.estado,
                alfaberto_fita_header: this.obj_nontuplas.alfaberto_fita[stmt.coluna-2],
                alfaberto_fita_subs: this.analisadorSematico.alfaberto_fita,
                movimentador: this.analisadorSematico.movimentador
            })

            this.pontoVirgula(false)
            this.comando()
        } else if(stmt.token == configuracoes.TOKENS.PONTOVIRGULA) {
            this.pontoVirgula(false)
            this.comando()
        } else if(stmt.token == configuracoes.TOKENS.NOVA_LINHA) {
            this.proximoToken();
            this.programa();
        } else {
            this.setErros(`Deve haver &lt;ESTADO&gt;&lt;ALFABERTO DE FITA&gt;&lt;MOVIMENTADOR&gt;: Exemplo de comando: \"qN A M\", esses elementos deve pertence ao conjuntos informado na nontuplas.`, stmt.linha, stmt.coluna)
        }
    }

    estado() {
        const stmt = this.analisadorLexico.tabelaSimbolos[this.lookahead]

        if(stmt.token != configuracoes.TOKENS.ESTADO) {
            this.setErros(`Esperava um ESTADO, e não um "${stmt.valor != ";"? stmt.valor : "" }". Para ser um estado válido, os estados deve ser de q0, q1, q2, ... qN.`, stmt.linha, stmt.coluna)
        } else if(stmt != null) {
           if(!this.obj_nontuplas.conjunto_estado.some(estado => estado == stmt.valor)) {
                this.setAvisos(`O Estado "${stmt.valor}" não pertence ao conjuntos de estados informado na nontuplas.`, stmt.linha, stmt.coluna)
           } 
        }

        // Será usada para fazer analise sematica
        this.analisadorSematico.setEstado(stmt.valor, stmt.linha, stmt.coluna)

        this.proximoToken()
    }

    alfabertoFita() {
        const stmt = this.analisadorLexico.tabelaSimbolos[this.lookahead]

        if(stmt.token != configuracoes.TOKENS.ALFABERTOFITA) {
            this.setErros(`Esperava um ALFABERTO DE FITA e não um "${stmt.valor != ";" ? stmt.valor : ""}"`, stmt.linha, stmt.coluna)
        } else if(stmt != null) {

            // Verificando se o alfaberto de fita pertence ao conjuntos de alfaberto declarada na nontuplas
            if(!this.obj_nontuplas.alfaberto_fita.some(alfaberto_fita => alfaberto_fita == stmt.valor)) {
                this.setAvisos(`O Alfaberto de fita "${stmt.valor}" não pertence ao conjuntos de alfaberto de fita informada na nontuplas.`, stmt.linha, stmt.coluna)
           } 
        }

        this.analisadorSematico.setAlfaberto(stmt.valor, stmt.linha, stmt.coluna)
        this.proximoToken()
    }

    movimento() {
        const stmt = this.analisadorLexico.tabelaSimbolos[this.lookahead] 

        if(stmt.token != configuracoes.TOKENS.MOVIMENTO) {
            this.setErros(`Esperava um MOVIMENTADOR não um "${stmt.valor != ";" ? stmt.valor : ""}". O movimentador válido são: R, L ou P e somente um deles.`, stmt.linha, stmt.coluna)
        }

        if(!this.isEstadoFinal) {
           this.isEstadoFinal = configuracoes.COMANDOS_MOVIMENTADOR.STOP == stmt && this.obj_nontuplas.estado_final.some(estado_final => estado_final == this.atributos.estado)
        }

        this.analisadorSematico.setMovimentador(stmt.valor, stmt.linha, stmt.coluna)
        this.proximoToken()
    }

    proximoToken() {
        this.lookahead++
    }

    setErros(msg, linha, coluna) {
        this.errosSintaticos.push({
            mensagem: `<span class='erro-code'>${msg}</span>`,
            linha: linha ?? 0,
            coluna: coluna ?? 0
        })
    }

    setAvisos(msg, linha, coluna) {
        this.avisosSintaticos.push({
            mensagem: `<span class='aviso-code'>${msg}</span>`,
            linha: linha ?? 0,
            coluna: coluna ?? 0
        })
    }


    verificarErrosMovimentadorParada() {
        const movimentador_parada = this.analisadorSematico.movimentadorList.filter(mov => mov.movimentador == configuracoes.COMANDOS_MOVIMENTADOR.STOP)

        if(movimentador_parada.length == 0) {
            this.setAvisos(`Foi detectado possível loop infinito, por favor verifique seu código e certifique de colocar o movimentador "${configuracoes.COMANDOS_MOVIMENTADOR.STOP}".`, 0, 0)
        } 

        if(movimentador_parada.length > 1) {
           this.setAvisos(`Existe duplicidade de comando de parada! Só pode haver somente um único comando movimentador "${configuracoes.COMANDOS_MOVIMENTADOR.STOP}".`, 0, 0)
        }
    }

    verificarErrosEstadoInicial() {
        const estado_inicial = this.analisadorSematico.comandosList.filter(cmd => cmd.estado == this.obj_nontuplas.estado_inicial.join(' ').trim() && 
                                                                                  (cmd.alfaberto_fita == configuracoes.SIMBOLOS_ESPECIAIS.DELIMITADOR.SIMBOLO_NIVEL_LABEL ||  cmd.alfaberto_fita == configuracoes.SIMBOLOS_ESPECIAIS.DELIMITADOR.SIMBOLO_NIVEL_DISPLAY) &&
                                                                                  cmd.movimentador == configuracoes.COMANDOS_MOVIMENTADOR.RIGHT)

        // Verifica se o estado de partida está na coluna do delimitador de fita
        let posDelimitadorColuna = this.obj_nontuplas.alfaberto_fita.indexOf(configuracoes.SIMBOLOS_ESPECIAIS.DELIMITADOR.SIMBOLO_NIVEL_LABEL) + 2
        // Verifica se há algum comando de partida informada
        if(estado_inicial.length == 0) {
            this.setAvisos(`Não foi encontrado o estado de partida (estado inicial). O estado inicial deve está no formato "${this.obj_nontuplas.estado_inicial.join('')} ${configuracoes.SIMBOLOS_ESPECIAIS.DELIMITADOR.SIMBOLO_NIVEL_LABEL} ${configuracoes.COMANDOS_MOVIMENTADOR.RIGHT}".`, 1, posDelimitadorColuna)
            return
        }


        if(estado_inicial[0].coluna != posDelimitadorColuna) {
            this.setAvisos(`Não foi encontrado o estado inicial na coluna do delimitador na linha 1 e coluna ${posDelimitadorColuna}.`, 0, 0)
        }

    }

    verificarErrosEstadoFinal() {
        const estado_final = this.analisadorSematico.comandosList.filter(cmd => cmd.estado == this.obj_nontuplas.estado_final.join('').trim() && cmd.movimentador == configuracoes.COMANDOS_MOVIMENTADOR.STOP)

        if(estado_final.length == 0) {
            this.setAvisos(`Não foi encontrado o estado final "${this.obj_nontuplas.estado_final.join('')}" codificado. Por favor codifique o estado final`)
        }
    }

    verificarDeclaracaoTodosEstados() {
        const estados_nao_finais_nao_declados = this.obj_nontuplas.estado_nao_final.filter(estados_nao_finais => !this.analisadorSematico.estado_apontador_declarado.has(estados_nao_finais))

        if(estados_nao_finais_nao_declados.length > 0) {
            this.setAvisos(`Os estados "{${estados_nao_finais_nao_declados.join(', ')}}" precisa ser declarado na primeira coluna.`)
        }
    }

    isErrosOuAvisos() {
        return this.errosSintaticos.length > 0 || this.analisadorLexico.errorList.length > 0 || this.avisosSintaticos.length > 0
    }

}
