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
        this.file = null
        this.contents = ""
    }

    async open() {
        try {

            this.contents = ""
            this.fileHandle = (await window.showOpenFilePicker(this.options))[0]
            
            this.file = await this.fileHandle.getFile()

            await this.read()
        
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

    async read() {
        this.contents = await this.file.text()
    }

    getFileInformation() {
        return {
            name: this.fileHandle.name
        }
    }

    getContents() {
        return this.contents
    }

    setContents(contents) {
        this.contents = contents
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