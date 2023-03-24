export const MESSAGE_ERROR_LEXER = {
    TOKENINVALID: `({0}, {1}) Caracter "{2}" não reconhecido!`
}

export const MESSAGE_ERROR_PASSER = {
    EXPECTED: `({0}, {1}) Esperava um "{2}" e não um "{3}".`
}

export const MESSAGE_ERROR_SEMATIC = {
    SCOPE: `({0}, {1}) O "{2}" do(a) "{3}" não foi declarado no(s) "{4}". Por favor, declare.`,
    DUPLICATE_SCOPE: `({0}, {1}) Não pode ter elementos duplicado(s) em "{2}".`,
    DUPLICATE_DELTA: `({0}, {1}) Não ter saída duplicada em {2}, gera indeterminismo.`,
    OBEYORDER: `({0}, {1}) Os elementos de "{2}" no inicio, deve conter a mesma sequência "{{3}}" de(o) "{4}"`,
    STATE_FINAL: `({0}, {1}) O estado final deve haver um movimentador "P" para determinar fim de execução. O comando será {2} {3} P`,
    STATE_BEGIN: `({0}, {1}) Por favor, deve ser colocado o estado inicial que irá dar inicio ao execução. O comando será {2} > R`,
    RIBBONALPHABET: `({0}, {1}) O alfabeto não foi declarado no alfabeto de fita. Por favor, coloque todo o alfabeto no alfabeto de fita.`,
} 