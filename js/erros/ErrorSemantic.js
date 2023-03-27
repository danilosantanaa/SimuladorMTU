import { stringFormat } from "../utils.js"
import { MESSAGE_ERROR_SEMATIC } from "./ErroMessage.js"
import { Error } from "./Error.js"

export class ErrorSemantic extends Error {

    addErroScope(line, column, caughtAttibute, current_scope, declared_scope) {
        this.errorList.push(stringFormat(MESSAGE_ERROR_SEMATIC.SCOPE, line, column, caughtAttibute, current_scope, declared_scope))
    }

    addErroSequenceObey(line, column, target_scoped, current_scope) {
        this.errorList.push(stringFormat(MESSAGE_ERROR_SEMATIC.OBEYORDER, line, column, target_scoped, current_scope))
    }

    addErroDuplicate(line, column, attribute, current_scope) {
        this.errorList.push(stringFormat(MESSAGE_ERROR_SEMATIC.DUPLICATE_SCOPE, line, column, attribute, current_scope))
    }

    addErroStateBegin(stateBeginDeclared) {
        this.errorList.push(stringFormat(MESSAGE_ERROR_SEMATIC.STATE_BEGIN, stateBeginDeclared))
    }
}