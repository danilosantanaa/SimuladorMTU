class FileManager {
    constructor() {
        this.fileHandle = null
        this.options = {
            types: [
                {
                    description: "MTU Code ",
                    accept: {
                        "text/mtu": [".mtu"]
                    }
                }
            ]
        }
        
        this.contents = ""
    }

    async open() {
        try {

            this.contents = ""
            this.fileHandle = (await window.showOpenFilePicker(this.options))[0]
            
            const file = await this.fileHandle.getFile()
            
            this.contents = await file.text()
        } catch(e) {
            console.error(e)
        }
    }

    async create() {
        try {
            this.fileHandle = await window.showSaveFilePicker(this.options)
            await this.write()
        } catch(e) {
            console.error(e)
        }
    }

    async save() {
        await this.write()
    }

    getFileInformation() {
        return {
            name: this.fileHandle.name
        }
    }

    getContents() {
        return this.contents
    }

    /**
     * @private
     */
    async write() {
        if(this.fileHandle != null) {
            const writable = await this.fileHandle.createWritable()
            await writable.write(this.contents)
            await writable.close()
        }
    }

}