export class Error {
    constructor() {
        this.errorList = []
    }

    /**
     * 
     * @param {string} attribute 
     * @param {Number} line 
     * @param {Nuber} column 
     */
    add(attribute, line, column) {
        this.errorList.push({
            attribute,
            line,
            column
        })
    }
}