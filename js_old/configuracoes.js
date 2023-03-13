const GerarObjectCaracterEspecial = (caracter_codigo, caracter_display) => {
    return {
        SIMBOLO_NIVEL_LABEL: caracter_codigo,
        SIMBOLO_NIVEL_DISPLAY: caracter_display
    }
}

export const SIMBOLOS_ESPECIAIS = {
    DELIMITADOR: GerarObjectCaracterEspecial('>', '►'),
    BRANCO_DE_FITA: GerarObjectCaracterEspecial('b', 'Б')
}

export class ExpressaoRegular {
    constructor() {
        this.Validadores = {
            VALIDADOR_CONJUNTOS: /^(\s*[a-zA-Z0-9\>]+\s*)(\,\s*[a-zA-Z0-9\>]+\s*)*$/g,
            VALIDAR_PONTEIRO: /^q[0-9]+$/g,
            VALIDAR_COMANDOS: /^(q[0-9]+)\s+([a-zA-Z0-9\>\Б\►])\s+([R|L|P])$/g
        }

        this.ExtrairValores = {
            EXTRAIR_ELEMENTO_CONJUNTO: /[a-zA-Z0-9\>]+/g
        }

        this.Substituicao = {
            SUBSTITUIR_COMANDOS: /^\s*([qQ][0-9]+)(\s+)([a-pr-zA-KM-OS-Z0-9\>\Б\►])?(\s*)([R|L|P]?)\s*$/g,
            ESTADO: /^\s*([qQ][0-9]+)(\s*)$/g
        }
    }
}

export const gerarHashSHA256Text = async (text) => {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join("")
    
    return hashHex
}

export const COMANDOS_MOVIMENTADOR = {
    RIGHT: "R",
    LEFT: "L",
    STOP: "P"
}

export const TOKENS = {
    ESTADO: 100,
    ALFABERTOFITA: 200,
    MOVIMENTO: 300,
    PONTOVIRGULA: 400,
    DELIMITADOR_APONTADOR: 500,
    NOVA_LINHA: 600
}

export const EXTENSAO_CODIGO_FONTE = ".mtu"

/** ELEMENTOS DA NONTUPLAS */
export const STR_ESTADO_POR_ID = "#estados"
export const STR_ALFABERTO_POR_ID = "#alfaberto"
export const STR_ESTADO_INICIAL_POR_ID = "#estado-inicial"
export const STR_ESTADO_FINAL_POR_ID = "#estado-final"
export const STR_ESTADO_NAO_FINAl_POR_ID = "#estado-nao-final" 
export const STR_ALFABERTO_FITA_POR_ID = "#alfaberto-fita"
export const STR_DELIMITADOR_POR_ID = "#delimitador"
export const STR_BRANCO_DE_FITA_POR_ID = "#branco-fita"

/** ELEMENTOS DA TABELAS */
export const STR_TABLE_CABECALHO_POR_ID = "#tb-cabecalho"
export const STR_TABLE_CONTENT_POR_CLASS = ".tb-content"
export const STR_TABLE_CORPO_POR_ID = "#tb-corpo"

/** BOTÕES DE CONTROLES */
export const STR_BUTTON_EXECUTAR_POR_CLASS = ".btn.executar"
export const STR_BUTTON_RESERTAR_POR_CLASS = ".btn.resertar"
export const STR_BUTTON_SALVAR_POR_CLASS = ".btn.salvar"
export const STR_BUTTON_ABRIR_POR_CLASS = ".btn.abrir"