const GerarObjectCaracterEspecial = (caracter_codigo, caracter_display) => {
    return {
        SIMBOLO_NIVEL_LABEL: caracter_codigo,
        SIMBOLO_NIVEL_DISPLAY: caracter_display
    }
}

export const TYPE_ENVORONMENT = {
    CODEFIRST: 1,
    TABLEFIRST: 2
}


export const SIMBOLOS_ESPECIAIS = {
    DELIMITADOR: GerarObjectCaracterEspecial('>', '►'),
    BRANCO_DE_FITA: GerarObjectCaracterEspecial('b', 'Б')
}

export const COMANDOS_MOVIMENTADOR = {
    RIGHT: "R",
    LEFT: "L",
    STOP: "P"
}

export const EXTENSAO_CODIGO_FONTE = ".mtu"