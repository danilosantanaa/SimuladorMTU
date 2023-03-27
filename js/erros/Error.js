export class Error {
    constructor() {
        this.errorList = []
    }

    getLastErro() {
        return this.errorList[this.errorList.length - 1]
    }
}