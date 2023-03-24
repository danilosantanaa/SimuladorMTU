import { stringFormat } from "../utils.js"
import { MESSAGE_ERROR_SEMATIC } from "./ErroMessage.js"
import { Error } from "./Error.js"

export class ErrorSemantic extends Error {

    /**
     * 
     * @param {string} expectedToken 
     * @param {string} caughtToken
     * @param {Number} line 
     * @param {Nuber} column 
     * @param {string} message_template
     */
    add(expectedToken, caughtToken, line, column, message_template) {
        this.errorList.push({
            expectedToken,
            caughtToken,
            line,
            column,
            message_template
        })
    }

    addErroScope(line, column, caughtAttibute, current_scope, declared_scope) {
        this.errorList.push(stringFormat(MESSAGE_ERROR_SEMATIC.SCOPE, line, column, caughtAttibute, current_scope, declared_scope))
    }

    addErroSequenceObey(line, column, sequence, target_scoped, current_scope) {
        this.errorList.push(stringFormat(MESSAGE_ERROR_SEMATIC.OBEYORDER, line, column, sequence, target_scoped, current_scope))
    }

    addErroDuplicate(line, column, current_scope) {
        this.errorList.push(stringFormat(MESSAGE_ERROR_SEMATIC.DUPLICATE_SCOPE, line, column, current_scope))
    }
}