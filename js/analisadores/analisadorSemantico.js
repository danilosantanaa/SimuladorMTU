export class AnalisadorSemantico {
    constructor() {
        this.estado_apontador = null
        this.estado = null
        this.alfaberto_fita = null
        this.movimentador = null

        this.num_linha = 0
        this.num_coluna = 0

        this.estado_apontador_declarado = new Map()
        this.estado_inicial_declarado = new Map()
        this.estado_final_declarado = new Map()
        
        this.comandosList = []
        this.movimentadorList = []

        this.matrAdjacente = new Map()
    }

    setEstado(estado, linha, coluna) {
        this.estado = estado.trim()
        this.num_linha = linha
        this.num_coluna = coluna
    }

    setAlfaberto(alfaberto_fita, linha, coluna) {
        this.alfaberto_fita = alfaberto_fita.trim()
        this.num_linha = linha
        this.num_coluna = coluna
    }

    setMovimentador(movimentador, linha, coluna) {
        this.movimentador = movimentador.trim()
        this.num_linha = linha
        this.num_coluna = coluna
        this.setMovimentadorList()
    }

    setComandos() {
        this.comandosList.push({
            estado: this.estado,
            alfaberto_fita: this.alfaberto_fita,
            movimentador: this.movimentador,
            linha: this.num_linha,
            coluna: this.num_coluna
        })
    }

    setMovimentadorList() {
        this.movimentadorList.push({
            movimentador: this.movimentador,
            linha: this.num_linha,
            coluna: this.num_coluna
        })
    }

}