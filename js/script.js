class Analisador {
    constructor(conjuntosEstados, alfaberto, estadoInicial, estadoFinal, estadoNaoFinal, alfabertoFita, demitador, brancoFita) {
        this.conjuntosEstados = conjuntosEstados;
        this.alfaberto = alfaberto;
        this.estadoInicial = estadoInicial;
        this.estadoFinal = estadoFinal;
        this.estadoNaoFinal = estadoNaoFinal;
        this.alfabertoFita = alfabertoFita;
        this.demitador = demitador;
        this.brancoFita = brancoFita;
    }

    IsConjuntos(str) {
        return /^[a-zA-z0-9]+(,\s*[a-zA-z0-9]+)*/.test(str);
    }
}