import { stringFormat } from "../utils.js"
import { MESSAGE_ERROR_LEXER } from "./ErroMessage.js"
import { Error } from "./Error.js"

export class ErrorLexer extends Error {
    /**
     * 
     * @param {Number} line 
     * @param {Number} colunm 
     * @param {string} lexeme 
     */
    add(line, colunm, lexeme) {
        this.errorList.push(stringFormat(MESSAGE_ERROR_LEXER.TOKENINVALID, line, colunm, lexeme))
    }
}